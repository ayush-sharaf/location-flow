import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
      });

      const google = await loader.load();

      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 15,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        setMap(map);

        // Create initial marker
        const marker = new google.maps.Marker({
          map,
          draggable: true,
        });

        setMarker(marker);

        // Handle marker drag events
        marker.addListener('dragend', () => {
          const position = marker.getPosition();
          if (position) {
            onLocationSelect({
              lat: position.lat(),
              lng: position.lng(),
            });
          }
        });

        // Handle map click events
        map.addListener('click', (e) => {
          const position = e.latLng;
          if (position) {
            marker.setPosition(position);
            onLocationSelect({
              lat: position.lat(),
              lng: position.lng(),
            });
          }
        });

        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              
              // Center map on user's location
              map.setCenter(userLocation);
              
              // Place marker at user's location
              marker.setPosition(userLocation);
              
              // Notify parent component
              onLocationSelect(userLocation);
              
              setIsLoading(false);
            },
            (error) => {
              console.error('Error getting location:', error);
              setIsLoading(false);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          setIsLoading(false);
        }
      }
    };

    initMap();
  }, [onLocationSelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-md shadow-md">
          Getting your location...
        </div>
      )}
    </div>
  );
};

export default Map;