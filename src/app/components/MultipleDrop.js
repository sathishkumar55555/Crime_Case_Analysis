"use client";
import { useState } from 'react';

const MultipleDropdown = () => {
    const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
    const [isFirstSubDropdownOpen, setIsFirstSubDropdownOpen] = useState(false);
    const [isSecondSubDropdownOpen, setIsSecondSubDropdownOpen] = useState(false);

    const toggleMainDropdown = () => setIsMainDropdownOpen(!isMainDropdownOpen);
    const toggleFirstSubDropdown = () => setIsFirstSubDropdownOpen(!isFirstSubDropdownOpen);
    const toggleSecondSubDropdown = () => setIsSecondSubDropdownOpen(!isSecondSubDropdownOpen);

    return (
        <div className="relative inline-block text-left bg-black">
            <button
                onClick={toggleMainDropdown}
                className="text-white bg-black hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-blue-300  mr-22 bg-black rounded-lg text-sm px-1 py-1 w-30 text-center inline-flex items-center"
            >
                Tables
                <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>

            {isMainDropdownOpen && (
                <div className="absolute z-10 mt-2 w-44 bg-zinc-900 rounded-lg shadow-lg">
                    <ul className="py-2 text-sm text-white">
                        
                        <li>
                            <button
                                onClick={toggleFirstSubDropdown}
                                className="flex items-center justify-between w-full px-4 py-2 hover:bg-green-500"
                            >
                                Update
                                <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </button>
                            {isFirstSubDropdownOpen && (
                                <div className="absolute left-full top-0 mt-2 w-44 bg-zinc-900 rounded-lg shadow-lg">
                                    <ul className="py-2 text-sm text-white">
                                        <li>
                                            <a href="/update" className="block px-4 py-2 hover:bg-green-500">Case</a>
                                        </li>
                                        <li>
                                            <a href="/updateInvestigator" className="block px-4 py-2 hover:bg-green-500">Investigator</a>
                                        </li>
                                        <li>
                                            <a href="/updateEvidence" className="block px-4 py-2 hover:bg-green-500">Evidence</a>
                                        </li>
                                        <li>
                                            <a href="/updateSuspect" className="block px-4 py-2 hover:bg-green-500">Suspect</a>
                                        </li>
                                        <li>
                                            <a href="/updateWitness" className="block px-4 py-2 hover:bg-green-500">Witness</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                        <li>
                            <button
                                onClick={toggleSecondSubDropdown}
                                className="flex items-center justify-between w-full px-4 py-2 hover:bg-green-500"
                            >
                                Insert
                                <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </button>
                            {isSecondSubDropdownOpen && (
                                <div className="absolute left-full top-0 mt-2 w-44 bg-zinc-900 rounded-lg shadow-lg">
                                    <ul className="py-2 text-sm text-white">
                                        <li>
                                            <a href="/add" className="block px-4 py-2 hover:bg-green-500">Case</a>
                                        </li>
                                        <li>
                                            <a href="/addInvestigator" className="block px-4 py-2 hover:bg-green-500">Investigator</a>
                                        </li>
                                        <li>
                                            <a href="/addEvidence" className="block px-4 py-2 hover:bg-green-500">Evidence</a>
                                        </li>
                                        <li>
                                            <a href="/addSuspect" className="block px-4 py-2 hover:bg-green-500">Suspect</a>
                                        </li>
                                        <li>
                                            <a href="/addWitness" className="block px-4 py-2 hover:bg-green-500">Witness</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                        <li>
                            <a href="/delete" className="block px-4 py-2 hover:bg-green-500">Delete</a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultipleDropdown;
