import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiMapPin, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

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
  const defaultCenter = [-31.4201, -64.1888];
  const [position, setPosition] = useState(null);
  const [searching, setSearching] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [error, setError] = useState('');
  const debounceTimer = useRef(null);

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
        setError('No se encontró el punto exacto en el mapa. Podés ingresar la dirección normalmente.');
      }
    } catch {
      setError('Error al consultar el mapa de entrega.');
    } finally {
      setSearching(false);
    }
  }, []);

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
    <div className="mt-3 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 shadow-soft">
      {/* Map Container */}
      <div className="relative h-56 sm:h-64 w-full">
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

        {searching && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-md shadow-soft border border-zinc-200">
              <div className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-zinc-800">Localizando dirección...</span>
            </div>
          </div>
        )}
      </div>

      {/* Info / Confirmation Footer */}
      <div className="p-3.5 space-y-2 bg-white border-t border-zinc-200">
        {error && (
          <p className="text-xs text-amber-700 flex items-center gap-1.5 font-normal">
            <FiAlertTriangle size={13} /> {error}
          </p>
        )}

        {position && resolvedAddress && !error && (
          <>
            <div className="flex items-start space-x-2">
              <FiMapPin className="text-zinc-700 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-xs text-zinc-600 leading-relaxed flex-1">
                <span className="font-medium text-zinc-900">Ubicación detectada: </span>
                {resolvedAddress}
              </p>
            </div>

            {!confirmed ? (
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full flex items-center justify-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2 rounded-md transition-colors"
              >
                <span>Confirmar punto en el mapa</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1.5 text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
                <FiCheckCircle className="text-xs" />
                <span className="text-xs font-medium">Ubicación confirmada para logística</span>
              </div>
            )}

            <p className="text-[11px] text-zinc-400 text-center font-normal">
              Podés mover el marcador en el mapa para mayor precisión de entrega
            </p>
          </>
        )}

        {!position && !error && !searching && address && address.length >= 5 && (
          <p className="text-xs text-zinc-400 text-center py-1 font-normal">
            Localizando en el mapa...
          </p>
        )}

        {!address && (
          <p className="text-xs text-zinc-400 text-center py-1 font-normal">
            Completá la dirección arriba para visualizar el punto de entrega
          </p>
        )}
      </div>
    </div>
  );
};

export default AddressMap;
