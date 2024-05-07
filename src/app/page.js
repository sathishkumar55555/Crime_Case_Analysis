"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Map from './components/Map';
import Payment from "./components/Payment";
import Info from "./components/Info";
const Home = () => {
 

  return (
    <div>
      <Payment/>
      <Info/>
    </div>
  );
};

export default Home;
