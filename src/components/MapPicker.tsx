import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MapPickerProps = {
  initialLat?: number;
  initialLng?: number;
  onSelect: (result: { latitude: number; longitude: number; formattedAddress?: string }) => void;
  onCancel?: () => void;
  showControls?: boolean;
};

// Simple MapPicker using react-leaflet and OpenStreetMap tiles.
// Provides clickable/dragable marker and reverse-geocoding via Nominatim to get a formatted address.
export default function MapPicker({ initialLat, initialLng, onSelect, onCancel, showControls = true }: MapPickerProps) {
  const DEFAULT_LAT = 6.5244; // Lagos
  const DEFAULT_LNG = 3.3792;
  const [lat, setLat] = useState<number>(initialLat ?? DEFAULT_LAT);
  const [lng, setLng] = useState<number>(initialLng ?? DEFAULT_LNG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formattedAddress, setFormattedAddress] = useState<string | undefined>(undefined);

  // Ensure default marker icon works (avoid bundler asset issues)
  useEffect(() => {
    try {
      delete (L.Icon.Default as any).prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      });
    } catch (e) {
      // swallow
    }
  }, []);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        setFormattedAddress(undefined);
      },
    });
    return null;
  }

  // Ensure the map invalidates its size after being shown in a modal so tiles render
  function MapResizeOnShow() {
    const map = useMap();
    useEffect(() => {
      if (!map) return;
      const id = setTimeout(() => {
        try { map.invalidateSize(); } catch (e) { /* ignore */ }
      }, 200);
      return () => clearTimeout(id);
    }, [map]);
    return null;
  }

  async function reverseGeocode(latitude: number, longitude: number) {
    try {
      setLoading(true);
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('Reverse geocode failed');
      const data = await res.json();
      return data.display_name as string | undefined;
    } catch (err) {
      return undefined;
    } finally {
      setLoading(false);
    }
  }

  async function handleUseLocation() {
    try {
      const formatted = await reverseGeocode(lat, lng);
      setFormattedAddress(formatted);
      onSelect({ latitude: lat, longitude: lng, formattedAddress: formatted });
    } catch (err: unknown) {
      setError('Failed to fetch location');
    }
  }

  return (
    <div className="w-full">
      {error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : (
        <div>
          <div style={{ width: '100%', height: 420 }}>
            <MapContainer center={[lat, lng]} zoom={13} style={{ width: '100%', height: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapResizeOnShow />
              <MapClickHandler />
              <Marker
                position={[lat, lng]}
                draggable={true}
                eventHandlers={{
                  dragend: (e: any) => {
                    const p = e.target.getLatLng();
                    setLat(p.lat);
                    setLng(p.lng);
                    setFormattedAddress(undefined);
                  },
                }}
              />
            </MapContainer>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="text-sm text-gray-600">
              <div>Latitude: {lat.toFixed(6)}</div>
              <div>Longitude: {lng.toFixed(6)}</div>
              {formattedAddress && <div className="mt-1 text-xs text-gray-500">{formattedAddress}</div>}
            </div>

            {showControls && (
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onCancel && onCancel()} className="px-4 py-2 rounded border">Cancel</button>
                <button type="button" onClick={handleUseLocation} className="px-4 py-2 rounded bg-blue-600 text-white">Use this location</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
