import React, { useState, useEffect } from 'react';
import { Input, Select, IconButton, Button, Spinner } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
const LocationMap = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    const [loading, setLoading] = useState(false);

    const fetchCrimeMap = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/crime_map?fromDate=${fromDate}&toDate=${toDate}&option=${selectedOption}`);
            if (!response.ok) {
                throw new Error('Failed to fetch crime map');
            }
            const html = await response.text();
            setHtmlContent(html);
        } catch (error) {
            console.error('Error fetching crime map:', error);
        }
    };

    return (
        <div className='border-solid border-green-500 border-2 p-8 rounded-md mt-6 h-[500px] ml-12 mr-12 mb-12'>
            <div className="bg-black h-24 w-full flex justify-content items-center">
                <div className="text-white items-center  ml-20 mr-12 flex border-solid border-green-500 border-2 p-8 rounded-md">
                    <div className='flex'>
                        <div className='mt-1 mr-4'>From :</div>
                        <Input
                            placeholder='Select Date'
                            size='md'
                            type='date'
                            variant="pill"
                            bg="gray"
                            color="white"
                            borderColor="gray.500"
                            style={{ borderRadius: '4px', padding: '4px' }}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div className='flex ml-6'>
                        <div className='mt-1 mr-4'>To :</div>
                        <Input
                            placeholder='Select Date'
                            size='md'
                            type='date'
                            variant="pill"
                            bg="gray"
                            color="white"
                            borderColor="gray.500"
                            style={{ borderRadius: '4px', padding: '4px' }}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    <div className='ml-6'>
                        <Select
                            placeholder='Crime Cases'
                            bg='grey'
                            size='lg'
                            color='white'
                            style={{ borderRadius: '4px', padding: '4px' }}
                            onChange={(e) => setSelectedOption(e.target.value)}
                        >
                            <option value='THEFT'>Theft</option>
                            <option value='"ROBBERY"'>Robbery</option>
                            <option value='VANDALISM'>Vandalism</option>
                            <option value='ASSAULT'>Assault</option>
                            <option value='TRESPASSING'>Trespassing</option>

                        </Select>
                    </div>
                    <div className='ml-16'>
                    {loading ? (
                <Spinner
                  size='lg'
                  color='blue'
                  style={{ width: '40px', height: '40px' }}
                />
              ) : (
                <IconButton
                  colorScheme='blue'
                  aria-label='Search database'
                  onClick={fetchCrimeMap}
                  icon={<SearchIcon />}
                />
              )}
                    </div>
                </div>
                <hr className="mx-auto" />
            </div>
            <div className='ml-[200px] '>
               
                {htmlContent && (
                    <div style={{ borderRadius: '8px', overflow: 'hidden' }} className='mt-12'>
                    <iframe
                        srcDoc={htmlContent}
                        title="Crime Map"
                        width="490"
                        height="270"
                        style={{ borderRadius: '8px' }}
                    />
                </div>
                
                )}
            </div>
        </div>
    );
};

export default LocationMap;
