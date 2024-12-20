"use client";
import React, { useState } from 'react';
import { Input, useToast } from '@chakra-ui/react';
import axios from 'axios'; // Import axios for making HTTP requests

const InsertInvestigatorForm = () => {
    const [formData, setFormData] = useState({
        investigator_id: '',
        name: '',
        date_of_birth: '',
        department: '',
        case_id: ''
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make a POST request to insert investigator data
            const response = await axios.post('http://127.0.0.1:8000/insert-investigator', formData);
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
                investigator_id: '',
                name: '',
                date_of_birth: '',
                department: '',
                case_id: ''
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
        <div className='border-solid border-green-500 border-2 p-8 rounded-md mt-12 ml-48 w-[600px] text-green-500 mb-10'>
            <h1 className='ml-[120px] mb-12 text-3xl bold'>Insert Investigator Data</h1>
            <form className='ml-10' onSubmit={handleSubmit}>
                <div className='mt-3'>
                    <label htmlFor="investigator_id">Investigator ID:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson'
                        type="number"
                        id="investigator_id"
                        name="investigator_id"
                        value={formData.investigator_id}
                        onChange={handleChange}
                        className='bg-black border-2 border-green-500 rounded-lg ml-[78px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="name">Name:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson'
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className='bg-black border-2 border-green-500 rounded-lg ml-[143px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="date_of_birth">Date of Birth:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson'
                        type="date"
                        id="date_of_birth"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className='bg-black border-2 border-green-500 rounded-lg ml-[92px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="department">Department:</label>
                    <Input
                        isInvalid
                        errorBorderColor='crimson'
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className='bg-black border-2 border-green-500 rounded-lg ml-[98px] w-[200px] px-4'
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
                        className='bg-black border-2 border-green-500 rounded-lg ml-[129px] w-[200px] px-4'
                    />
                </div>
                <div className='border-solid border-green-500 border-2 p-2 rounded-md ml-40 mt-12 w-[155px]'>
                    <button
                        className=''
                        type="submit"
                    >
                        Insert Investigator Data
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

export default InsertInvestigatorForm;
