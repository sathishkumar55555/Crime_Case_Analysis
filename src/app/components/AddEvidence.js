"use client";
import React, { useState } from 'react';
import { Input, useToast } from '@chakra-ui/react';
import axios from 'axios'; // Import axios for making HTTP requests

const AddEvidence = () => {
    const [formData, setFormData] = useState({
        evidence_id: '',
        date_acquired: '',
        case_id: '',
        weapon_desc: ''
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make a POST request to insert evidence data
            const response = await axios.post('http://127.0.0.1:8000/insert-evidence', formData);
            console.log(response.data); // Log response data
            setShowSuccessMessage(true);
            toast({
                title: 'Data successfully inserted into the table',
                status: 'success',
                duration: 5000,
                isClosable: true
            });
            // Clear form data after successful submission
            setFormData({
                evidence_id: '',
                date_acquired: '',
                case_id: '',
                weapon_desc: ''
            });
        } catch (error) {
            console.error('Error inserting data:', error);
            // Display error message using toast
            toast({
                title: 'Error inserting data',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className='border-solid border-green-500 border-2 p-8 rounded-md mt-12 ml-44 w-[600px] text-green-500'>
            <h1 className='ml-[120px] mb-12 text-3xl bold'>Insert Evidence Data</h1>
            <form className='ml-10' onSubmit={handleSubmit}>
                <div className='mt-3'>
                    <label htmlFor="evidence_id">Evidence ID:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson'
                        type="number"
                        id="evidence_id"
                        name="evidence_id"
                        value={formData.evidence_id}
                        onChange={handleChange}
                        className='bg-black border-2 border-green-500 rounded-lg ml-[112px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="date_acquired">Date Acquired:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson'
                        type="date"
                        id="date_acquired"
                        name="date_acquired"
                        value={formData.date_acquired}
                        onChange={handleChange}
                        className='bg-black border-2 border-green-500 rounded-lg ml-[83px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="case_id">Case ID:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson'
                        type="number"
                        id="case_id"
                        name="case_id"
                        value={formData.case_id}
                        onChange={handleChange}
                        className='bg-black border-2 border-green-500 rounded-lg ml-[147px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="weapon_desc">Weapon Description:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson'
                        type="text"
                        id="weapon_desc"
                        name="weapon_desc"
                        value={formData.weapon_desc}
                        onChange={handleChange}
                        className='bg-black border-2 border-green-500 rounded-lg ml-[50px] w-[200px] px-4'
                    />
                </div>
                <div className='border-solid border-green-500 border-2 p-2 rounded-md ml-40 mt-12 w-[105px]'>
                    <button
                        className=''
                        type="submit"
                    >
                        Insert Evidence Data
                    </button>
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

export default AddEvidence;
