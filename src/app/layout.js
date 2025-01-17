"use client";
import { Inter } from "next/font/google";
import React, { useState } from 'react';
import "./globals.css";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

// Define Inter font configuration
const inter = Inter({ subsets: ['latin'] });

const Layout = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Save the theme preference to local storage if needed
  };

  return (
    <html>
      <head>
        <title>Crime Case Analysis</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </head>
 
      <body className={inter.className}>
        <div className={isDarkMode ? 'dark' : 'light'}>
          <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
};

export default Layout;