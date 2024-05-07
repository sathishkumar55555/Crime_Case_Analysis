import React from 'react';
import Image from 'next/image';

export default function Info() {
    return (
        <div>

            <div className='ml-2  flex'>

                <div className='p-32 mt-6'>
                    <div className='font-bold text-green-800 text-4xl'>
                        About the data
                    </div>
                    <div className='w-[500px] mt-6'>
                        This dataset provides comprehensive information about crime incidents reported in Los Angeles from January 2020 to June 2023. It includes details such as the type of crime, date and time of occurrence, location, and other relevant attributes. The dataset is sourced from the Los Angeles Police Department and offers valuable insights into crime patterns and trends in the city.
                    </div>


                </div>
                <div className='rounded-xl mt-44 '>
                    <Image alt="some image" src="/display.png" className='rounded-3xl mr-12 -ml-24' width="600" height="750" />

                </div>
            </div>
            <div className='ml-2 -mt-28 flex'>

                <div className='p-32 mt-6'>
                    <div className='font-bold text-green-800 text-4xl'>
                        About the Website
                    </div>
                    <div className='w-[800px] mt-6'>

                        A website that displays crime data from 2020 to present, such as Crime Data From 2020 to Present, serves as a crucial tool for various stakeholders. Users can input specific date ranges, locations, and crime types to analyze trends, identify hotspots, and assess similarities between incidents. Researchers can leverage this resource to study crime patterns, evaluate the effectiveness of law enforcement strategies, and develop targeted interventions. Law enforcement agencies can use the data to allocate resources efficiently and prioritize areas for crime prevention initiatives. Additionally, policymakers and community organizations can utilize the insights gained to advocate for evidence-based policies and allocate resources for community safety measures. By providing comprehensive and structured information, this website facilitates informed decision-making and empowers stakeholders to address crime effectively in Los Angeles.
                    </div>


                </div>
                
            </div>
        </div>
    )
}
