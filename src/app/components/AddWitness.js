"use client";

import { useState } from 'react';
import { Input, Button, useToast } from '@chakra-ui/react';

export default function InsertWitnessForm() {
    const [formData, setFormData] = useState({
        witness_id: '',
        name: '',
        dob: '',
        case_id: ''
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/insert-witness', {
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
                duration: 5000,
                isClosable: true
            });
            setFormData({
                witness_id: '',
                name: '',
                dob: '',
                case_id: ''
            });
        } catch (error) {
            console.error('Error inserting data:', error);
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
        <div className='border-solid border-green-500 border-2 p-8 rounded-md mt-12 ml-44 w-[600px] text-green-500 mb-10'>
            <h1 className='ml-[120px] mb-12 text-3xl bold'>Insert Witness Data</h1>
            <form className='ml-10' onSubmit={handleSubmit}>
                <div className='mt-3'>
                    <label htmlFor="witness_id">Witness ID:</label>
                    <Input type="number" id="witness_id" name="witness_id" value={formData.witness_id} onChange={handleChange}
                    className='bg-black border-2 border-green-500 rounded-lg ml-[76px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="name">Name:</label>
                    <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                    className='bg-black border-2 border-green-500 rounded-lg ml-[113px] w-[200px] px-4'
                     />
                </div>
                <div className='mt-3'>
                    <label htmlFor="dob">Date of Birth:</label>
                    <Input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} 
                    className='bg-black border-2 border-green-500 rounded-lg ml-[63px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="case_id">Case ID:</label>
                    <Input type="number" id="case_id" name="case_id" value={formData.case_id} onChange={handleChange}
                    className='bg-black border-2 border-green-500 rounded-lg ml-[98px] w-[200px] px-4'
                     />
                </div>
                <div className='border-solid border-green-500 border-2 p-2 rounded-md ml-40 mt-12 w-[105px]'>
                    <Button type="submit">Insert Data</Button>
                </div>
            </form>
            {showSuccessMessage && (
                <Button
                    onClick={() => setShowSuccessMessage(false)}
                    colorScheme="green"
                    mt={4}
                >
                    Successfully Inserted
                </Button>
            )}
        </div>
    );
}
