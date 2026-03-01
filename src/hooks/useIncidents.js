import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useIncidents - Real-time hook for active incidents
 * Fetches all active incidents and subscribes to INSERT/UPDATE events.
 */
export function useIncidents() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initial fetch
        const fetchIncidents = async () => {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('incidents')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (fetchError) {
                console.error('Failed to fetch incidents:', fetchError);
                setError(fetchError);
            } else {
                setIncidents(data || []);
            }
            setLoading(false);
        };

        fetchIncidents();

        // Real-time subscription
        const channel = supabase
            .channel('incidents-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'incidents',
                },
                (payload) => {
                    const newIncident = payload.new;
                    if (newIncident.status === 'active') {
                        setIncidents((prev) => [newIncident, ...prev]);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'incidents',
                },
                (payload) => {
                    const updated = payload.new;
                    if (updated.status !== 'active') {
                        // Remove resolved/dismissed incidents
                        setIncidents((prev) => prev.filter((inc) => inc.id !== updated.id));
                    } else {
                        // Update in place
                        setIncidents((prev) =>
                            prev.map((inc) => (inc.id === updated.id ? updated : inc))
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { incidents, loading, error };
}
