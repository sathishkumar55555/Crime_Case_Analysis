import React, { useState } from 'react';
import { Input, IconButton, ChakraProvider, extendTheme, Spinner } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner as NextUISpinner, getKeyValue } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";

export default function MovieRecommendations() {
    const [movie, setMovie] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);

    const handleChange = (e) => {
        setMovie(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:8000/recommend?movie=${movie}`);
            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                setRecommendations(data.recommended_cases);
            }
        } catch (error) {
            console.error(error);
            setError('Error fetching data');
        }
    };

    let list = useAsyncList({
        async load({ signal, cursor }) {
            if (cursor) {
                setIsLoading(false);
            }
            const res = await fetch(cursor || "https://swapi.py4e.com/api/people/?search=", { signal });
            let json = await res.json();
            setHasMore(json.next !== null);
            return {
                items: json.results,
                cursor: json.next,
            };
        },
    });

    const [loaderRef, scrollerRef] = useInfiniteScroll({ hasMore, onLoadMore: list.loadMore });
  
    

    return (
        <div className='ml-32 mt-6'>
            <h1 className="bold">Find Similar Crime Cases</h1>
            <div className='flex'>
                <form className='mt-4 flex' onSubmit={handleSubmit}>
                    <Input
                        className="bg-black text-green-500 border border-white rounded py-2 px-4 focus:outline-none focus:border-green-500"
                        type="text"
                        value={movie}
                        onChange={handleChange}
                    />
                    <div className='ml-8 border w-8 border-solid border-white flex justify-center mb-2 mt-2 rounded-xl border-2'>
                        <IconButton
                            className=' mt-2 mb-2'
                            aria-label="Search database"
                            icon={<SearchIcon />}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
            <div className='w-full mt-12 -ml-16'>
            
                <div className="border-solid border-green-500 border-2 p-2 rounded-md">
                <Table
                    isHeaderSticky
                    aria-label="Movie Recommendations"
                    baseRef={scrollerRef}
         
                    color="secondary"
                    bottomContent={
                        hasMore ? (
                            <div className="flex w-full justify-center">
                                <NextUISpinner ref={loaderRef} color="green" />
                            </div>
                        ) : null
                    }
                    classNames={{
                        base: "max-h-[620px] ",
                        table: "min-w-[900px]",
                        
                    }}
                >
                    <TableHeader>
                        <TableColumn key="case_id">Case_id </TableColumn>
                        <TableColumn key="crime_description"> Crime Description</TableColumn>
                        <TableColumn key="investigator_name">Investigator</TableColumn>
                        <TableColumn key="suspect_name">Suspect</TableColumn>
                        <TableColumn key="location">Location</TableColumn>
                        <TableColumn key="weapon_desc">Weapon Description</TableColumn>
                        <TableColumn key="witness_name">Witness</TableColumn>
                    </TableHeader>
                    
                    <TableBody
                        isLoading={isLoading}
                        color="grey"
                        items={recommendations}
                        loadingContent={<Spinner color="green" />}
                    >
                        {(rec) => (
                            <TableRow key={rec.case_id}>
                                <TableCell>{rec.case_id}</TableCell>
                                <TableCell>{rec.crime_description}</TableCell>
                                <TableCell>{rec.investigator_name}</TableCell>
                                <TableCell>{rec.suspect_name}</TableCell>
                                <TableCell>{rec.location}</TableCell>
                                <TableCell>{rec.weapon_desc}</TableCell>
                                <TableCell>{rec.witness_name}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                </div>
               
            </div>
            <div className='h-24'>

            </div>
        </div>
    );
}
