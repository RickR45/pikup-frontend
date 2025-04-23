import React, { useEffect, useRef } from 'react';
import './MapComponent.css';

interface MapComponentProps {
  pickupAddress: string;
  destinationAddress: string;
  onPickupCoordinatesChange: (lat: number, lng: number) => void;
  onDestinationCoordinatesChange: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapComponent: React.FC<MapComponentProps> = ({
  pickupAddress,
  destinationAddress,
  onPickupCoordinatesChange,
  onDestinationCoordinatesChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    // Initialize the map
    const initMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });

      mapInstanceRef.current = map;
      geocoderRef.current = new window.google.maps.Geocoder();

      // Initialize markers
      pickupMarkerRef.current = new window.google.maps.Marker({
        map,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        }
      });

      destinationMarkerRef.current = new window.google.maps.Marker({
        map,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (!geocoderRef.current || !mapInstanceRef.current) return;

    const updateMarkerAndMap = (
      address: string,
      marker: google.maps.Marker | null,
      onCoordinatesChange: (lat: number, lng: number) => void
    ) => {
      if (!address.trim()) return;

      geocoderRef.current?.geocode(
        { address },
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === 'OK' && results[0] && marker) {
            const location = results[0].geometry.location;
            marker.setPosition(location);
            onCoordinatesChange(location.lat(), location.lng());

            // Adjust map bounds to show both markers
            if (pickupMarkerRef.current && destinationMarkerRef.current) {
              const bounds = new window.google.maps.LatLngBounds();
              if (pickupMarkerRef.current.getPosition()) {
                bounds.extend(pickupMarkerRef.current.getPosition()!);
              }
              if (destinationMarkerRef.current.getPosition()) {
                bounds.extend(destinationMarkerRef.current.getPosition()!);
              }
              mapInstanceRef.current?.fitBounds(bounds);
            } else {
              mapInstanceRef.current?.setCenter(location);
            }
          }
        }
      );
    };

    // Update markers when addresses change
    if (pickupAddress) {
      updateMarkerAndMap(pickupAddress, pickupMarkerRef.current, onPickupCoordinatesChange);
    }
    if (destinationAddress) {
      updateMarkerAndMap(destinationAddress, destinationMarkerRef.current, onDestinationCoordinatesChange);
    }
  }, [pickupAddress, destinationAddress, onPickupCoordinatesChange, onDestinationCoordinatesChange]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" />
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-marker pickup" />
          <span>Pickup Location</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker destination" />
          <span>Destination</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent; 