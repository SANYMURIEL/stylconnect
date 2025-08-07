"use client"; 

import React, { useState } from 'react'; 

const Map = () => {
 
  const [isMapLoaded, setIsMapLoaded] = useState(false);

 
  const handleIframeLoad = () => {
    setIsMapLoaded(true);
  };

  return (
    <div
      className="relative rounded-lg shadow-lg overflow-hidden flex justify-center items-center bg-gray-100"
      style={{ width: '500px', height: '300px' }} 
    >
      {!isMapLoaded && (
        
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          <p className="text-pink-500 font-semibold text-lg absolute bottom-4">
            Chargement de la carte...
          </p>
        </div>
      )}

      <iframe
       
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.722818616544!2d9.75065967357585!3d4.0767740467533455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10610dc42612c01f%3A0xdc400c4848323ca4!2sGroupe%20Universitaire%20DEUTOU!5e0!3m2!1sfr!2scm!4v1752800110746!5m2!1sfr!2scm"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localisation du Groupe Universitaire DEUTOU sur Google Maps"
        onLoad={handleIframeLoad} 
      ></iframe>
    </div>
  );
};

export default Map;