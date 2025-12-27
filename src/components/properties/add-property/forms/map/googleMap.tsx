"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id?: string;
    lat: number;
    lng: number;
    title?: string;
    label?: string;
  }>;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
  className?: string;
}

export default function GoogleMapComponent({
  center,
  zoom = 12,
  markers = [],
  onMapClick,
  className = "",
}: GoogleMapProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [selectedPoint, setSelectedPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => setUserLocation(null)
      );
    }
  }, []);

  const mapCenter = useMemo(() => {
    if (center) return center;
    if (userLocation) return userLocation;
    return defaultCenter;
  }, [center, userLocation]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
  });

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      scrollwheel: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    []
  );

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setSelectedPoint({ lat, lng });
      onMapClick?.({ lat, lng });
    },
    [onMapClick]
  );

  useEffect(() => {
    if (!map || markers.length === 0 || !(window as any).google?.maps) return;

    const googleMaps = (window as any).google.maps;
    const bounds = new googleMaps.LatLngBounds();

    markers.forEach((m) => {
      if (m.lat && m.lng) {
        bounds.extend(new googleMaps.LatLng(m.lat, m.lng));
      }
    });

    if (!bounds.isEmpty()) {
      if (markers.length > 1) {
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      } else {
        map.setCenter(bounds.getCenter());
        map.setZoom(14);
      }
    }
  }, [map, markers]);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center bg-gray-100">
        <p className="text-red-600 text-sm">Google Maps API key is missing</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center bg-gray-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-r-transparent" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={mapCenter}
      zoom={zoom}
      options={mapOptions}
      onLoad={onLoad}
      onClick={handleMapClick}
    >
      {selectedPoint && (
        <Marker position={selectedPoint} title="Selected Location" />
      )}

      {markers.map((marker, index) => (
        <Marker
          key={marker.id ?? `${marker.lat}-${marker.lng}-${index}`}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.title}
          label={marker.label}
        />
      ))}
    </GoogleMap>
  );
}
