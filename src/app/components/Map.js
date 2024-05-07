"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Map = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://127.0.0.1:8000/plot'); // Adjust API route if needed

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);
      } catch (err) {
        console.error('Error fetching image:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading image...</p>}
      {error && <p>Error: {error}</p>}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Plot Image"
          width={450} // Adjust width as needed
          height={330} // Adjust height as needed
         // Ensures responsive image display
          priority // Prioritizes image loading for faster display
        />
      )}
    </div>
  );
};

export default Map;
