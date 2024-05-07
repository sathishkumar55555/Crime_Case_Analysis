// components/DeleteForm.js
"use client";
import { useState } from 'react';
import axios from 'axios';

const DeleteForm = () => {
    const [caseId, setCaseId] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleChange = (e) => {
        setCaseId(e.target.value);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/delete/${caseId}`);
            console.log(response.data);
            setShowSuccessMessage(true);
            // Handle success
        } catch (error) {
            console.error('Error deleting data:', error);
            // Handle error
        }
    };

    return (
        <div className='border-solid border-red-500 border-2 p-8 rounded-md mt-12 ml-44 w-[600px] text-red-500'>
            <h1 className='ml-[175px] mb-12 text-3xl bold'>Delete Data</h1>
            <form className='ml-10'>
                <div className='mt-3'>
                    <label htmlFor="case_id">Case ID:</label>
                    <input
                        type="number"
                        id="case_id"
                        className='bg-black border-2 border-red-500 rounded-lg ml-[179px] w-[200px] px-4'
                        name="case_id"
                        value={caseId}
                        onChange={handleChange}
                    />
                </div>
                <div className='border-solid border-red-500 border-2 p-2 rounded-md ml-40 mt-12 w-[85px]'>
                    <button
                    className='ml-2'
                        onClick={handleDelete}
                        type="button"
                    >
                        Delete
                    </button>
                </div>
            </form>
            {showSuccessMessage && (
                <p className='mt-4 ml-6'>Data deleted successfully</p>
            )}
        </div>
    );
};

export default DeleteForm;
