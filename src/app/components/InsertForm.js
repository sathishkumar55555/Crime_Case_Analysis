"use client";
import React, { useState } from 'react';
import { Input } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
const InsertForm = () => {
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
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
      const toast = useToast()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/insert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data);
            setShowSuccessMessage(true);
            toast({
                title: 'Data successfully inserted into the table',
                status: 'success',
                duration: 5000, // Display duration in milliseconds
                isClosable: true
            });
            setFormData(initialFormData);
            // Handle success or display a success message
        } catch (error) {
            console.error('Error inserting data:', error);
            // Handle error or display an error message
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className='border-solid border-green-500 border-2 p-8 rounded-md mt-12 ml-44 w-[600px] text-green-500 '>
            <h1 className='ml-[120px] mb-12 text-3xl bold'>Insert into the Table</h1>
            <form className='ml-10' onSubmit={handleSubmit}>
                <div >
                    <label htmlFor="date_rptd">Date Reported  :</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson' type="date"
                        className='bg-black border-2 border-green-500 rounded-lg ml-[124px] px-4 w-[200px]'
                        id="date_rptd" name="date_rptd" value={formData.date_rptd} onChange={handleChange} />
                </div>
                <div className='mt-3'>
                    <label htmlFor="date_occ">Date Occurred:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson' type="date" id="date_occ"
                        className='bg-black border-2 border-green-500 rounded-lg ml-32 px-4 w-[200px]' name="date_occ" value={formData.date_occ} onChange={handleChange} />
                </div>
                <div className='mt-3'>
                    <label htmlFor="crm_desc">Crime Description:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson' type="text" id="crm_desc"
                        className='bg-black border-2 border-green-500 rounded-lg 
                        ml-[104px] w-[200px] px-4' 
                        name="crm_desc" value={formData.crm_desc} onChange={handleChange} />
                </div>
                <div className='mt-3'>
                    <label htmlFor="location">Location:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson' type="text" id="location"
                        className='bg-black border-2 border-green-500 rounded-lg  ml-[174px] w-[200px] px-4' name="location" value={formData.location} onChange={handleChange} />
                </div>
                <div className='mt-3'>
                    <label htmlFor="weapon_desc">Weapon Description:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson' type="text" id="weapon_desc"
                        className='bg-black border-2 border-green-500 rounded-lg ml-[88px] w-[200px] px-4' name="weapon_desc" value={formData.weapon_desc} onChange={handleChange} />
                </div>
                <div className='mt-3'>
                    <label htmlFor="lat">Latitude:</label>
                    <input type="number" id="lat" name="lat"
                        className='bg-black border-2 border-green-500 rounded-lg ml-[177px] w-[200px] px-4' value={formData.lat} onChange={handleChange} />
                </div>
                <div className='mt-3'>
                    <label htmlFor="lon">Longitude:</label>
                    <input type="number"
                        color="green"
                        id="lon" name="lon"
                        className='bg-black border-2 border-green-500 rounded-lg ml-[163px] w-[200px] px-4' value={formData.lon} onChange={handleChange} />
                </div>
                <div className='mt-3'>
                    <label htmlFor="investigator_id">Investigator ID:</label>
                    <input type="number" id="investigator_id"
                        className='bg-black border-2 border-green-500 rounded-lg ml-[129px] w-[200px] px-4'                    name="investigator_id" value={formData.investigator_id} onChange={handleChange} />
                </div>
                <div className='mt-3'>
                    <label htmlFor="case_id">Case ID:</label>
                    <input type="number" id="case_id"
                        className='bg-black border-2 border-green-500 rounded-lg ml-[179px] w-[200px] px-4'
                        name="case_id" value={formData.case_id} onChange={handleChange} />
                </div>
                <div className='border-solid border-green-500 border-2 p-2 rounded-md ml-40 mt-12 w-[105px]'>
                <button
                className=''
                type="submit">Insert Data</button>
                </div>
            </form>
            {showSuccessMessage && (
                <button
                    onClick={() => setShowSuccessMessage(false)}
                    colorScheme="green"
                    mt={4}
                >
                    Successfully Inserted
                </button>
            )}
           
        </div>
    );
};

export default InsertForm;
