declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
    fitBounds(bounds: LatLngBounds): void;
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setPosition(latLng: LatLng | LatLngLiteral): void;
    getPosition(): LatLng | null;
  }

  class Geocoder {
    geocode(
      request: GeocoderRequest,
      callback: (results: GeocoderResult[], status: GeocoderStatus) => void
    ): void;
  }

  class LatLngBounds {
    constructor();
    extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  interface MapOptions {
    zoom?: number;
    center?: LatLng | LatLngLiteral;
    mapTypeControl?: boolean;
    fullscreenControl?: boolean;
    streetViewControl?: boolean;
  }

  interface MarkerOptions {
    map?: Map;
    position?: LatLng | LatLngLiteral;
    icon?: string | Icon;
  }

  interface Icon {
    url: string;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface GeocoderRequest {
    address?: string;
  }

  interface GeocoderResult {
    geometry: {
      location: LatLng;
    };
  }

  type GeocoderStatus = 'OK' | 'ZERO_RESULTS' | 'ERROR';
} 