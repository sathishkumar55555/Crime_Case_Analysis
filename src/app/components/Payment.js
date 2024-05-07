import React from 'react';
import Image from 'next/image';

export default function Picture() {
    return (
        <div className='bg-green-800 ml-20 mt-32 w-[900px] rounded-3xl h-[400px]'>
            <div className='flex'>
                <div className='ml-16 py-20 '>
                    <div className='text-5xl font-extrabold '>
                    Crime Data From 2020 to Present
                    </div>
                    <div className='py-8'>
                    The dataset contains information on crime incidents reported in Los Angeles, including various attributes such as the type of crime, date and time of occurrence, location, and other relevant details. It is provided in a structured format and is suitable for analyzing crime patterns, conducting research, and developing insights into crime trends in Los Angeles.
                    </div>
                    
                </div>
                <div className='mt-12 w-[200px]'>
                
            </div>
         
            </div>
            
           
        </div>
    )
}
