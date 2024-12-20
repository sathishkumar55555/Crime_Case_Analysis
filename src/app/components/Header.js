"use client";

import Head from "next/head";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Switch } from "@nextui-org/react";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import MultipleDropdown from "../components/MultipleDrop";

//import { ChevronDownIcon } from "@heroicons/react/solid/24/ChevronDownIcon";

export default function Header() {
  const [navbar, setNavbar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You can save the theme preference to local storage here
  };

  return (
    <div>
      <Head>
        <title>
          <Link href="/">
            Crime Case Analysis
          </Link>
        </title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="w-full  shadow ">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
              <div className="flex  justify-self-center mt-2">

                <h2 className="text-xl text-green-500 font-bold items-center mt-2 ml-6">
                  <a href="/">
                    Crime Case Analysis
                  </a>
                </h2>
                <div className=" items-center mb-42 mt-3 ml-16 text-sm text-right">
                  <a href="/between">
                    Between
                  </a>

                </div>
                <div className=" items-center mb-42 mt-3 ml-16 text-sm text-right">
                  <a
                    className="mt-2"
                    href="/location">
                    Location
                  </a>

                </div>
                <div className="items-center mb-42 mt-3 ml-16 text-sm text-right">
                  <a
                    className="mt-2"
                    href="/similarity"
                    >
                   
                    Similar
               
                  </a>
                </div>
                <div className="items-center mb-42 mt-2 ml-12 text-sm text-right">
                  <MultipleDropdown/>
                </div>
                
              </div>
              <div></div>

              <div className="md:hidden">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3  md:block md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"
                }`}
            >
              <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 text-xs mt-3.5 md:space-y-0">
                <li>
                  By Sathish Kumar
                </li>
                <li>
                <Image  className="rounded-3xl" size='sm' width={40} height={40} name='Dan Abrahmov' src='/me.png' />
                </li>
                
                

              </ul>
            </div>
          </div>
        </div>
      </nav>
      <hr className="mx-auto" />
    </div>
  );
}