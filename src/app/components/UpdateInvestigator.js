"use client";
import { useState } from 'react';
import { Input, Button, useToast } from '@chakra-ui/react';

export default function UpdateInvestigatorForm() {
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
            const response = await fetch('http://127.0.0.1:8000/update-investigator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data);
            setShowSuccessMessage(true);
           
            
        } catch (error) {
            console.error('Error updating data:', error);
            toast({
                title: 'Error updating data',
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
            <h1 className='ml-[120px] mb-12 text-3xl bold'>Update Investigator Data</h1>
            <form className='ml-10' onSubmit={handleSubmit}>
                <div className='mt-3'>
                    <label htmlFor="investigator_id">Investigator ID:</label>
                    <Input type="number" id="investigator_id" name="investigator_id" value={formData.investigator_id} onChange={handleChange}
                    className='bg-black border-2 border-green-500 rounded-lg ml-[89px] w-[200px] px-4'
                     />
                </div>
                <div className='mt-3'>
                    <label htmlFor="name">Name:</label>
                    <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                    className='bg-black border-2 border-green-500 rounded-lg ml-[152px] w-[200px] px-4'
                     />
                </div>
                <div className='mt-3'>
                    <label htmlFor="date_of_birth">Date of Birth:</label>
                    <Input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange}
                    className='bg-black border-2 border-green-500 rounded-lg ml-[98px] w-[200px] px-4'
                     />
                </div>
                <div className='mt-3'>
                    <label htmlFor="department">Department:</label>
                    <Input type="text" id="department" name="department" value={formData.department} onChange={handleChange} 
                    className='bg-black border-2 border-green-500 rounded-lg ml-[102px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="case_id">Case ID:</label>
                    <Input type="number" id="case_id" name="case_id" value={formData.case_id} onChange={handleChange}
                    className='bg-black border-2 border-green-500 rounded-lg ml-[133px] w-[200px] px-4'
                     />
                </div>
                <div className='border-solid border-green-500 border-2 p-2 rounded-md ml-40 mt-12 w-[115px]'>
                    <Button type="submit">Update Data</Button>
                </div>
            </form>
            {showSuccessMessage && (
                <button
                    onClick={() => setShowSuccessMessage(false)}
                    colorScheme="green"
                    mt={4}
                >
                    Successfully Updated
                </button>
            )}
        </div>
    );
}
