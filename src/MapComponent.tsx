import React, { useRef, useEffect } from 'react';
import './MapComponent.css';

interface MapComponentProps {
  pickupAddress: string;
  destinationAddress: string;
  onPickupCoordinatesChange: (lat: number, lng: number) => void;
  onDestinationCoordinatesChange: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options?: google.maps.MapOptions) => google.maps.Map;
        Marker: new (options?: google.maps.MarkerOptions) => google.maps.Marker;
        Geocoder: new () => google.maps.Geocoder;
        LatLngBounds: new () => google.maps.LatLngBounds;
        event: {
          addListener: (instance: any, eventName: string, handler: Function) => void;
        };
      };
    };
  }
}

const MapComponent: React.FC<MapComponentProps> = ({
  pickupAddress,
  destinationAddress,
  onPickupCoordinatesChange,
  onDestinationCoordinatesChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 12,
    });

    mapInstanceRef.current = map;

    const geocoder = new window.google.maps.Geocoder();

    const updateMarker = (
      address: string,
      onCoordinatesChange: (lat: number, lng: number) => void
    ) => {
      if (!address) return;

      geocoder.geocode({ address }, (results: google.maps.GeocoderResult[], status: string) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const marker = new window.google.maps.Marker({
            position: location,
            map: mapInstanceRef.current || undefined,
          });
          markersRef.current.push(marker);
          onCoordinatesChange(location.lat(), location.lng());

          // Adjust map bounds to show all markers
          const bounds = new window.google.maps.LatLngBounds();
          markersRef.current.forEach((marker) => {
            const position = marker.getPosition();
            if (position) {
              bounds.extend(position);
            }
          });

          if (markersRef.current.length > 0) {
            mapInstanceRef.current?.fitBounds(bounds);
          } else {
            mapInstanceRef.current?.setCenter(location);
            if (mapInstanceRef.current) {
              (mapInstanceRef.current as any).setZoom(15);
            }
          }
        }
      });
    };

    updateMarker(pickupAddress, onPickupCoordinatesChange);
    updateMarker(destinationAddress, onDestinationCoordinatesChange);

    return () => {
      markersRef.current.forEach((marker) => {
        (marker as any).setMap(null);
      });
      markersRef.current = [];
    };
  }, [pickupAddress, destinationAddress, onPickupCoordinatesChange, onDestinationCoordinatesChange]);

  return <div ref={mapRef} className="map-container" />;
};

export default MapComponent; 