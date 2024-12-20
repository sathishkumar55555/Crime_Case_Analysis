import { useState } from 'react';
import { Input, Button, useToast } from '@chakra-ui/react';

export default function UpdateEvidenceForm() {
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
            const response = await fetch('http://127.0.0.1:8000/update-evidence', {
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
                title: 'Data updated successfully',
                status: 'success',
                duration: 5000,
                isClosable: true
            });
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
        <div className='border-solid border-green-500 border-2 p-8 rounded-md mt-12 ml-44 w-[600px] text-green-500 '>
            <h1 className='ml-[120px] mb-12 text-3xl bold'>Update Evidence Data</h1>
            <form className='ml-10' onSubmit={handleSubmit}>
                <div className='mt-3'>
                    <label htmlFor="evidence_id">Evidence ID:</label>
                    <Input type="number" id="evidence_id" name="evidence_id" value={formData.evidence_id} onChange={handleChange}
                    className='bg-black border-2 border-green-500 rounded-lg ml-[89px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="date_acquired">Date Acquired:</label>
                    <Input type="date" id="date_acquired" name="date_acquired" value={formData.date_acquired} onChange={handleChange}
                    className='bg-black border-2 border-green-500 rounded-lg ml-[69px] w-[200px] px-4'
                     />
                </div>
                <div className='mt-3'>
                    <label htmlFor="case_id">Case ID:</label>
                    <Input type="number" id="case_id" name="case_id" value={formData.case_id} onChange={handleChange}
                    className='bg-black border-2 border-green-500 rounded-lg ml-[119px] w-[200px] px-4'
                    />
                </div>
                <div className='mt-3'>
                    <label htmlFor="weapon_desc">Weapon Description:</label>
                    <Input type="text" id="weapon_desc" name="weapon_desc" value={formData.weapon_desc} onChange={handleChange} 
                    className='bg-black border-2 border-green-500 rounded-lg ml-[26px] w-[200px] px-4'
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
