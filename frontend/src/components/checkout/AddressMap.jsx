import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon (leaflet + bundlers issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to recenter the map when position changes
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1 });
    }
  }, [position, map]);
  return null;
};

// Draggable marker component
const DraggableMarker = ({ position, onDragEnd }) => {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const latlng = marker.getLatLng();
        onDragEnd([latlng.lat, latlng.lng]);
      }
    },
  };

  return position ? (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  ) : null;
};

const AddressMap = ({ address, onAddressConfirmed }) => {
  // Default center: Córdoba, Argentina
  const defaultCenter = [-31.4201, -64.1888];
  const [position, setPosition] = useState(null);
  const [searching, setSearching] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [error, setError] = useState('');
  const debounceTimer = useRef(null);

  // Geocode address using Nominatim (OpenStreetMap)
  const geocodeAddress = useCallback(async (query) => {
    if (!query || query.length < 5) {
      setPosition(null);
      setResolvedAddress('');
      setConfirmed(false);
      setError('');
      return;
    }

    setSearching(true);
    setError('');
    setConfirmed(false);

    try {
      const encodedQuery = encodeURIComponent(query + ', Argentina');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&addressdetails=1`,
        { headers: { 'Accept-Language': 'es' } }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const newPos = [parseFloat(result.lat), parseFloat(result.lon)];
        setPosition(newPos);
        setResolvedAddress(result.display_name);
      } else {
        setPosition(null);
        setResolvedAddress('');
        setError('No se encontró la dirección. Intentá ser más específico.');
      }
    } catch {
      setError('Error al buscar la dirección. Verificá tu conexión.');
    } finally {
      setSearching(false);
    }
  }, []);

  // Reverse geocode when marker is dragged
  const reverseGeocode = useCallback(async (latlng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng[0]}&lon=${latlng[1]}&addressdetails=1`,
        { headers: { 'Accept-Language': 'es' } }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setResolvedAddress(data.display_name);
      }
    } catch {
      // Silently fail reverse geocode
    }
  }, []);

  // Debounced geocoding when address changes
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      geocodeAddress(address);
    }, 800);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [address, geocodeAddress]);

  const handleMarkerDrag = (newPos) => {
    setPosition(newPos);
    setConfirmed(false);
    reverseGeocode(newPos);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    if (onAddressConfirmed) {
      onAddressConfirmed({
        position,
        resolvedAddress,
      });
    }
  };

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
      {/* Map */}
      <div className="relative h-52 sm:h-64 w-full">
        <MapContainer
          center={position || defaultCenter}
          zoom={position ? 16 : 13}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position && <RecenterMap position={position} />}
          <DraggableMarker position={position} onDragEnd={handleMarkerDrag} />
        </MapContainer>

        {/* Loading overlay */}
        {searching && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="w-4 h-4 border-2 border-wine border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Buscando dirección...</span>
            </div>
          </div>
        )}
      </div>

      {/* Info / Confirmation area */}
      <div className="p-3 space-y-2">
        {error && (
          <p className="text-xs text-red-500 flex items-center">
            <span className="mr-1">⚠️</span> {error}
          </p>
        )}

        {position && resolvedAddress && !error && (
          <>
            <div className="flex items-start space-x-2">
              <span className="text-base mt-0.5">📍</span>
              <p className="text-xs text-gray-600 leading-relaxed flex-1">
                <span className="font-semibold text-gray-800">Dirección encontrada: </span>
                {resolvedAddress}
              </p>
            </div>

            {!confirmed ? (
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full flex items-center justify-center space-x-1.5 bg-wine hover:bg-wine/90 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                <span>✅</span>
                <span>Confirmar Ubicación</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1.5 text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <span>✅</span>
                <span className="text-xs font-semibold">Ubicación confirmada</span>
              </div>
            )}

            <p className="text-[10px] text-gray-400 text-center">
              Podés arrastrar el marcador 📌 para ajustar la ubicación exacta
            </p>
          </>
        )}

        {!position && !error && !searching && address && address.length >= 5 && (
          <p className="text-xs text-gray-400 text-center py-1">
            Buscando tu dirección en el mapa...
          </p>
        )}

        {!address && (
          <p className="text-xs text-gray-400 text-center py-1">
            📍 Escribí tu dirección arriba para verla en el mapa
          </p>
        )}
      </div>
    </div>
  );
};

export default AddressMap;

