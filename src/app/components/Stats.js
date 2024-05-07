import React, { useState, useEffect } from 'react';
import { Input, Select, IconButton, ChakraProvider, extendTheme, Spinner } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const Stats = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchImage = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/crime_data?fromDate=${fromYear}&toDate=${toYear}&option=${selectedOption}`);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
    } catch (err) {
      console.error('Error fetching image:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="border-solid border-green-500 border-2 p-8 rounded-md mt-6 h-[500px] ml-12 mr-12 mb-12">
      <div>
      <div className="bg-black h-24 w-full flex justify-content items-center">
        <div className="text-white items-center ml-20 mr-12 flex border-solid border-green-500 border-2 p-8 rounded-md ">
          <div className='flex'>
            <div className='mt-1 mr-4'>From :</div>
            <Input
              placeholder='Select Date and Time'
              size='md'
              type='date'
              variant="pill"
              bg="gray"
              color="white"
              borderColor="gray.500"
              style={{ borderRadius: '4px', padding: '4px' }}
              onChange={(e) => setFromYear(e.target.value)}
            />
          </div>
          <div className='flex ml-6'>
            <div className='mt-1 mr-4'>To :</div>
            <Input
              placeholder='Select Date and Time'
              size='md'
              type='date'
              variant="pill"
              bg="gray"
              color="white"
              borderColor="gray.500"
              style={{ borderRadius: '4px', padding: '4px' }}
              onChange={(e) => setToYear(e.target.value)}
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
                  onClick={fetchImage}
                  icon={<SearchIcon />}
                />
              )}
          </div>
        </div>
        <hr className="mx-auto" />
      </div>
      <div className='ml-[240px] mt-10'>
        
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Plot Image"
            width={450} // Adjust width as needed
            height={150} // Adjust height as needed
            layout="responsive"
            className="rounded-lg" 
             // Ensures responsive image display
            priority // Prioritizes image loading for faster display
          />
        )}

      </div>
    </div>
    </div>
  );
};

export default Stats;
