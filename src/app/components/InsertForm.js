import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InsertForm = () => {
    const [crimeData, setCrimeData] = useState([]);
    const [formData, setFormData] = useState({
        date_rptd: '',
        date_occ: '',
        crm_desc: '',
        location: '',
        weapon_desc: '',
        lat: '',
        lon: '',
        investigator_id: '',
        case_id: ''
    });
    const [editingCaseId, setEditingCaseId] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [selectedCrime, setSelectedCrime] = useState(null);
    const [idInput, setIdInput] = useState('');
    const [editIndex, setEditIndex] = useState(-1); // Track the index of the row being edited

    useEffect(() => {
        fetchCrimeData();
    }, []);

    const fetchCrimeData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/crime_data');
            setCrimeData(response.data);
        } catch (error) {
            console.error('Error fetching crime data:', error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (editingCaseId) {
            // Update crime data
            try {
                await axios.put(`http://127.0.0.1:8000/crime_data/${editingCaseId}`, formData);
                setEditingCaseId(null);
                setEditIndex(-1); // Reset edit index
            } catch (error) {
                console.error('Error updating crime data:', error);
            }
        } else {
            // Add crime data
            try {
                await axios.post('http://127.0.0.1:8000/crime_data', formData);
            } catch (error) {
                console.error('Error adding crime data:', error);
            }
        }
        setFormData({
            date_rptd: '',
            date_occ: '',
            crm_desc: '',
            location: '',
            weapon_desc: '',
            lat: '',
            lon: '',
            investigator_id: '',
            case_id: ''
        });
        fetchCrimeData();
    };

    const handleDelete = async (case_id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/crime_data/${case_id}`);
            fetchCrimeData();
        } catch (error) {
            console.error('Error deleting crime data:', error);
        }
    };

    const handleEdit = (crime, index) => {
        setEditingCaseId(crime.case_id);
        setFormData({
            date_rptd: crime.date_rptd,
            date_occ: crime.date_occ,
            crm_desc: crime.crm_desc,
            location: crime.location,
            weapon_desc: crime.weapon_desc,
            lat: crime.lat,
            lon: crime.lon,
            investigator_id: crime.investigator_id,
            case_id: crime.case_id
        });
        setSelectedCrime(crime);
        setEditIndex(index); // Set edit index to the clicked row
        setShowForm(true);
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    const handleIdInputChange = (e) => {
        setIdInput(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Crime Data</h2>
            <h4>Enter the id : </h4>
            <input type="text" value={idInput} onChange={handleIdInputChange} />

            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-4" onClick={toggleFormVisibility}>
                {showForm ? 'Hide Form' : 'Show Form'}
            </button>

            {showForm && (
                <form className="mb-4" onSubmit={handleFormSubmit}>
                    <div>
                        <label>Date Reported:</label>
                        <input type="text" name="date_rptd" value={formData.date_rptd} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Date Occurred:</label>
                        <input type="text" name="date_occ" value={formData.date_occ} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Crime Description:</label>
                        <input type="text" name="crm_desc" value={formData.crm_desc} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Weapon Description:</label>
                        <input type="text" name="weapon_desc" value={formData.weapon_desc} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Latitude:</label>
                        <input type="text" name="lat" value={formData.lat} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Longitude:</label>
                        <input type="text" name="lon" value={formData.lon} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Investigator ID:</label>
                        <input type="text" name="investigator_id" value={formData.investigator_id} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Case ID:</label>
                        <input type="text" name="case_id" value={formData.case_id} onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                        {editingCaseId ? 'Update' : 'Add'} Crime Data
                    </button>
                </form>
            )}

            <table className="w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">Date Reported</th>
                        <th className="p-2">Date Occurred</th>
                        <th className="p-2">Crime Description</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Weapon Description</th>
                        <th className="p-2">Latitude</th>
                        <th className="p-2">Longitude</th>
                        <th className="p-2">Investigator ID</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {crimeData.map((crime, index) => (
                        <tr key={crime.case_id}>
                            <td className="p-2">
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        name="date_rptd"
                                        value={formData.date_rptd}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    crime.date_rptd
                                )}
                            </td>
                            <td className="p-2">
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        name="date_occ"
                                        value={formData.date_occ}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    crime.date_occ
                                )}
                            </td>
                            <td className="p-2">
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        name="crm_desc"
                                        value={formData.crm_desc}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    crime.crm_desc
                                )}
                            </td>
                            <td className="p-2">
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    crime.location
                                )}
                            </td>
                            <td className="p-2">
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        name="weapon_desc"
                                        value={formData.weapon_desc}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    crime.weapon_desc
                                )}
                            </td>
                            <td className="p-2">
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        name="lat"
                                        value={formData.lat}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    crime.lat
                                )}
                            </td>
                            <td className="p-2">
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        name="lon"
                                        value={formData.lon}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    crime.lon
                                )}
                            </td>
                            <td className="p-2">
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        name="investigator_id"
                                        value={formData.investigator_id}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    crime.investigator_id
                                )}
                            </td>
                            <td className="p-2">
                                {editIndex === index ? (
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={handleFormSubmit}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => handleEdit(crime, index)}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => handleDelete(crime.case_id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InsertForm;
