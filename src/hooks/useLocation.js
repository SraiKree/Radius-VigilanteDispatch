import { useState, useEffect, useRef } from 'react';

/**
 * Campus zones — polygons defined as arrays of [lat, lng] pairs.
 * Coordinates are approximate for IIIT Hyderabad campus.
 * Add/adjust zones as campus evolves.
 */
const CAMPUS_ZONES = [
    {
        name: 'Academic Block (Vindhya)',
        polygon: [
            [17.5460, 78.3495],
            [17.5460, 78.3510],
            [17.5448, 78.3510],
            [17.5448, 78.3495],
        ],
    },
    {
        name: 'Library Complex',
        polygon: [
            [17.5448, 78.3490],
            [17.5448, 78.3502],
            [17.5438, 78.3502],
            [17.5438, 78.3490],
        ],
    },
    {
        name: 'Hostel Area (OBH)',
        polygon: [
            [17.5435, 78.3475],
            [17.5435, 78.3495],
            [17.5420, 78.3495],
            [17.5420, 78.3475],
        ],
    },
    {
        name: 'Sports Complex',
        polygon: [
            [17.5468, 78.3480],
            [17.5468, 78.3500],
            [17.5460, 78.3500],
            [17.5460, 78.3480],
        ],
    },
    {
        name: 'Admin Block (Himalaya)',
        polygon: [
            [17.5455, 78.3505],
            [17.5455, 78.3518],
            [17.5445, 78.3518],
            [17.5445, 78.3505],
        ],
    },
];

/**
 * Broad campus bounding box — if the user is inside this, they're "on campus"
 * even if not matched to a specific zone.
 */
const CAMPUS_BOUNDS = {
    north: 17.5480,
    south: 17.5410,
    east: 78.3530,
    west: 78.3460,
};

/**
 * Ray-casting point-in-polygon test
 */
function pointInPolygon(lat, lng, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [yi, xi] = polygon[i];
        const [yj, xj] = polygon[j];
        const intersect =
            yi > lat !== yj > lat &&
            lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}

function isOnCampus(lat, lng) {
    return (
        lat >= CAMPUS_BOUNDS.south &&
        lat <= CAMPUS_BOUNDS.north &&
        lng >= CAMPUS_BOUNDS.west &&
        lng <= CAMPUS_BOUNDS.east
    );
}

function resolveZone(lat, lng) {
    for (const zone of CAMPUS_ZONES) {
        if (pointInPolygon(lat, lng, zone.polygon)) {
            return zone.name;
        }
    }
    if (isOnCampus(lat, lng)) return 'On Campus';
    return 'Off Campus';
}

function accuracyLabel(meters) {
    if (meters == null) return 'Unknown';
    if (meters <= 10) return 'High';
    if (meters <= 30) return 'Medium';
    return 'Low';
}

/**
 * useLocation — watches the user's real GPS position and resolves
 * it to a named campus zone (or "Off Campus").
 *
 * Returns { zone, accuracy, status, coords, error }
 *   status: 'requesting' | 'active' | 'denied' | 'unavailable' | 'error'
 */
export function useLocation() {
    const [state, setState] = useState({
        zone: null,
        accuracy: null,
        status: 'requesting',
        coords: null,
        error: null,
    });
    const watchId = useRef(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setState(s => ({
                ...s,
                status: 'unavailable',
                zone: 'Location unavailable',
                error: 'Geolocation not supported by this browser',
            }));
            return;
        }

        watchId.current = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude: lat, longitude: lng, accuracy } = pos.coords;
                setState({
                    zone: resolveZone(lat, lng),
                    accuracy: accuracyLabel(accuracy),
                    status: 'active',
                    coords: { lat, lng },
                    error: null,
                });
            },
            (err) => {
                const denied = err.code === err.PERMISSION_DENIED;
                setState(s => ({
                    ...s,
                    status: denied ? 'denied' : 'error',
                    zone: denied ? 'Location access denied' : 'Location error',
                    error: err.message,
                }));
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10_000,
                timeout: 15_000,
            }
        );

        return () => {
            if (watchId.current != null) {
                navigator.geolocation.clearWatch(watchId.current);
            }
        };
    }, []);

    return state;
}
