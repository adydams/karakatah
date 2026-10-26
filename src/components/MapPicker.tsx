import { useEffect, useState } from "react";
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

export default function MapPicker({ initialLat, initialLng, onSelect, onCancel, showControls = true }: MapPickerProps) {
  const [lat, setLat] = useState<number>(initialLat || 0);
  const [lng, setLng] = useState<number>(initialLng || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formattedAddress, setFormattedAddress] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      delete (L.Icon.Default as any).prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      });
    } catch {
      // swallow
    }
  }, []);

  useEffect(() => {
    if (lat === 0 && lng === 0) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
            setIsInitialized(true);
          },
          () => {
            console.warn("Geolocation denied or unavailable, using fallback.");
            if (!initialLat || !initialLng) {
              setLat(6.5244); // Lagos fallback
              setLng(3.3792);
            }
            setIsInitialized(true);
          }
        );
      } else {
        setIsInitialized(true);
      }
    } else {
      setIsInitialized(true);
    }
  }, [initialLat, initialLng]);

  // Sync when the parent provides coordinates after mount (e.g. async form load)
  // or when the user edits the lat/lng inputs directly.
  useEffect(() => {
    const newLat = Number(initialLat);
    const newLng = Number(initialLng);
    if (Number.isFinite(newLat) && Number.isFinite(newLng) && initialLat != null && initialLng != null) {
      if (newLat !== lat || newLng !== lng) {
        setLat(newLat);
        setLng(newLng);
      }
    }
  }, [initialLat, initialLng]);

  function MapViewUpdater() {
    const map = useMap();
    useEffect(() => {
      if (map && lat !== 0 && lng !== 0) {
        map.setView([lat, lng], map.getZoom());
      }
    }, [map, lat, lng]);
    return null;
  }

  async function reverseGeocode(latitude: number, longitude: number) {
    try {
      setLoading(true);
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'KarakataCommerce-LocationPicker' }
      });
      if (!res.ok) throw new Error('Reverse geocode failed');
      const data = await res.json();
      return data.display_name as string | undefined;
    } catch {
      return undefined;
    } finally {
      setLoading(false);
    }
  }

  async function performSearch(query: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'KarakataCommerce-LocationPicker' }
    });
    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  }

  async function searchAddress() {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setSearchResults([]);

      // Strategy 1: Exact query (Handles detailed addresses like "14, Karimu kotun street...")
      let data = await performSearch(searchQuery);

      // Strategy 2: Broaden search if no results found
      if (!data || data.length === 0) {
        const strippedQuery = searchQuery.replace(/^\d+[\s,.]*/, '').trim();
        if (strippedQuery && strippedQuery !== searchQuery) {
          data = await performSearch(strippedQuery);
        }
      }

      if (data && data.length > 0) {
        setSearchResults(data);
        // Optionally auto-select the first result to show on map
        const firstResult = data[0];
        setLat(parseFloat(firstResult.lat));
        setLng(parseFloat(firstResult.lon));
        setFormattedAddress(firstResult.display_name);
      } else {
        setError('No locations found. Try removing the house number or using a broader area name.');
        setTimeout(() => setError(null), 3000);
      }
    } catch {
      setError('Error searching for address.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectResult(result: any) {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    setLat(newLat);
    setLng(newLng);
    setFormattedAddress(result.display_name);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    // Immediately notify parent that a valid location is selected
    onSelect({ latitude: newLat, longitude: newLng, formattedAddress: result.display_name });
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

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[420px] text-sm text-gray-500">
        Initializing map location...
      </div>
    );
  }

  return (
    <div className="w-full">
      {error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter detailed address (e.g. 14, Karimu Kotun St, VI, Lagos)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchResults.length > 0) setSearchResults([]);
                }}
                onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 z-[1000] w-full max-h-60 overflow-y-auto rounded-xl bg-white shadow-lg border border-slate-200 mt-1">
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectResult(result)}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 border-b last:border-b-0 border-slate-100"
                    >
                      {result.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={searchAddress}
              disabled={loading}
              className="rounded-xl bg-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange/90 disabled:bg-orange/50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div style={{ width: '100%', height: 420 }}>
            <MapContainer center={[lat, lng]} zoom={13} style={{ width: '100%', height: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapViewUpdater />
              <Marker
                position={[lat, lng]}
                draggable={true}
                eventHandlers={{
                  dragend: (e: any) => {
                    const p = e.target.getLatLng();
                    setLat(p.lat);
                    setLng(p.lng);
                    setFormattedAddress(undefined);
                    // Update parent on drag to keep coords in sync
                    onSelect({ latitude: p.lat, longitude: p.lng, formattedAddress: undefined });
                  },
                }}
              />
            </MapContainer>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="text-sm text-gray-600">
              <div className="flex gap-2">
                <span className="font-medium">Lat:</span> {lat.toFixed(6)}
                <span className="font-medium ml-2">Lng:</span> {lng.toFixed(6)}
              </div>
              {formattedAddress && <div className="mt-1 text-xs text-gray-500 italic">{formattedAddress}</div>}
            </div>

            {showControls && (
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onCancel && onCancel()} className="px-4 py-2 rounded border hover:bg-gray-50">Cancel</button>
                <button type="button" onClick={handleUseLocation} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Confirm Location</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
