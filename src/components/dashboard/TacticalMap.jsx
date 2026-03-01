import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Trash2 } from 'lucide-react';

/**
 * Format a timestamp into a relative time string (e.g. "2 mins ago")
 */
function timeAgo(timestamp) {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Fix for default Leaflet marker icons not loading correctly in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom CSS-based SOS Marker using Leaflet's divIcon
const sosIcon = L.divIcon({
    className: 'bg-transparent border-none',
    html: `
        <div class="relative w-8 h-8 flex items-center justify-center">
            <div class="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75"></div>
            <div class="relative w-4 h-4 bg-red-600 rounded-full border-2 border-zinc-900 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
        </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

// MLRIT Dundigal Coordinates
const DEFAULT_CENTER = [17.5945, 78.4403];
const DEFAULT_ZOOM = 17;

/**
 * TacticalMap Component
 * Central visual interface for the Radius dashboard showing active incidents.
 * Accepts incidents, onDeleteIncident, and isAdmin as props.
 */
function TacticalMap({ incidents = [], onDeleteIncident, isAdmin = false }) {
    return (
        <div className="w-full h-full relative rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
            <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                minZoom={14}
                zoomControl={false}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
            >
                {/* CartoDB Dark Matter TileLayer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Render Incidents */}
                {incidents.map((incident) => (
                    <div key={incident.id}>
                        {/* Danger Zone Radius indicator */}
                        <Circle
                            center={[incident.lat, incident.lng]}
                            radius={50}
                            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1 }}
                        />

                        {/* Custom Marker */}
                        <Marker
                            position={[incident.lat, incident.lng]}
                            icon={sosIcon}
                        >
                            <Popup className="tactical-popup">
                                <div className="bg-zinc-900 text-zinc-50 p-3 rounded-lg border border-zinc-800 shadow-xl w-52 -m-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-red-500">{incident.type}</h3>
                                    </div>
                                    <p className="text-sm border-b border-zinc-800 pb-2 mb-2">{incident.note || <span className="text-zinc-500 italic">No additional details</span>}</p>
                                    <p className="text-xs text-zinc-500 text-right mb-2">{timeAgo(incident.created_at)}</p>
                                    {isAdmin && (
                                        <button
                                            onClick={() => onDeleteIncident && onDeleteIncident(incident.id)}
                                            className="w-full flex items-center justify-center gap-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-md py-1.5 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Mark False Positive
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    </div>
                ))}
            </MapContainer>
        </div>
    );
}

export default TacticalMap;