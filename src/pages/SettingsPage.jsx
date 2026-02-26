import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShieldAlert, Car, MapPin, Save, BellRing } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from '../components/common';

// Simple accessible Switch component
function Switch({ checked, onChange, name, id }) {
    return (
        <button
            type="button"
            id={id}
            name={name}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900',
                checked ? 'bg-amber-500' : 'bg-zinc-700'
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    checked ? 'translate-x-5' : 'translate-x-0'
                )}
            />
        </button>
    );
}

/**
 * SettingsPage - User profile and preferences configuration
 */
function SettingsPage() {
    // Profile State
    const [profile, setProfile] = useState({
        name: 'Alex Johnson',
        year: 'Junior',
        section: 'Computer Science',
        email: 'alex.j@university.edu'
    });

    // Preferences State
    const [preferences, setPreferences] = useState({
        hasVehicle: false,
        hasFirstAid: true,
        shareLocation: true,
    });

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleToggle = (key) => (checked) => {
        setPreferences({ ...preferences, [key]: checked });
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Here you would typically send data to your backend
        console.log('Saved settings:', { profile, preferences });
        // Simulating a temporary success text or toast would go here.
    };

    return (
        <div className="h-full overflow-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-zinc-50 mb-2">Settings</h1>
                    <p className="text-zinc-400">
                        Manage your profile information and configure emergency preferences.
                    </p>
                </motion.div>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Profile Settings Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-zinc-800 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-50">Profile Information</h2>
                                <p className="text-sm text-zinc-400">Update your account details identity details.</p>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={profile.name}
                                    onChange={handleProfileChange}
                                    className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                                    Student Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full h-10 px-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-zinc-500 mt-1">Contact admin to change your email.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Year / Grade
                                </label>
                                <div className="flex items-center gap-3">
                                    {['I', 'II', 'III', 'IV'].map((yearOption) => (
                                        <label
                                            key={yearOption}
                                            className={cn(
                                                'relative flex items-center justify-center px-4 h-10 rounded-lg border text-sm font-medium cursor-pointer transition-colors',
                                                profile.year === yearOption
                                                    ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="year"
                                                value={yearOption}
                                                checked={profile.year === yearOption}
                                                onChange={handleProfileChange}
                                                className="sr-only"
                                            />
                                            {yearOption}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="section" className="block text-sm font-medium text-zinc-300 mb-1">
                                    Department
                                </label>
                                <input
                                    id="section"
                                    name="section"
                                    type="text"
                                    value={profile.section}
                                    onChange={handleProfileChange}
                                    placeholder="e.g. Computer Science, Section A"
                                    className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Emergency Parameters Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-zinc-800 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-50">Emergency & Volunteer Parameters</h2>
                                <p className="text-sm text-zinc-400">These help us route requests to you efficiently.</p>
                            </div>
                        </div>

                        <div className="p-0">
                            {/* Vehicle */}
                            <div className="px-6 py-5 border-b border-zinc-800/50 flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="mt-0.5 text-zinc-500">
                                        <Car className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <label htmlFor="hasVehicle" className="text-sm font-medium text-zinc-200">
                                            I have a personal vehicle
                                        </label>
                                        <p className="text-sm text-zinc-500 mt-1">
                                            Allows you to be alerted for transport-related bounties or severe emergencies that require logistics.
                                        </p>
                                    </div>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <Switch
                                        id="hasVehicle"
                                        checked={preferences.hasVehicle}
                                        onChange={handleToggle('hasVehicle')}
                                    />
                                </div>
                            </div>

                            {/* First Aid */}
                            <div className="px-6 py-5 border-b border-zinc-800/50 flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="mt-0.5 text-zinc-500">
                                        <ShieldAlert className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <label htmlFor="hasFirstAid" className="text-sm font-medium text-zinc-200">
                                            I have experience with first aid
                                        </label>
                                        <p className="text-sm text-zinc-500 mt-1">
                                            Marks you as a responder for medical distress alerts around campus.
                                        </p>
                                    </div>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <Switch
                                        id="hasFirstAid"
                                        checked={preferences.hasFirstAid}
                                        onChange={handleToggle('hasFirstAid')}
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="px-6 py-5 flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="mt-0.5 text-zinc-500">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <label htmlFor="shareLocation" className="text-sm font-medium text-zinc-200">
                                            Share my location for emergency prompts
                                        </label>
                                        <p className="text-sm text-zinc-500 mt-1">
                                            We will securely ping your device if there is an active emergency requiring support nearby.
                                        </p>
                                    </div>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <Switch
                                        id="shareLocation"
                                        checked={preferences.shareLocation}
                                        onChange={handleToggle('shareLocation')}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SettingsPage;
