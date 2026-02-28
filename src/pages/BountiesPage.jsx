import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Filter, Search, Plus, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../components/common';
import { BountyCard } from '../components/bounties';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

// Mock bounty data
const initialBounties = [
    {
        id: 1,
        title: 'Emergency Student Fund',
        charity: 'Student Relief Org',
        location: 'Central Campus',
        goal: 5000,
        raised: 3750,
        status: 'open',
        daysLeft: 12,
        backers: 84,
        type: 'money',
    },
    {
        id: 2,
        title: 'Footpath Clean-up Crew',
        charity: 'Green Earth Initiative',
        location: 'Near the lake',
        goal: 50,
        raised: 35,
        status: 'open',
        daysLeft: 5,
        backers: 35,
        type: 'volunteer',
    },
    {
        id: 3,
        title: 'Winter Clothing Drive',
        charity: 'Homeless Outreach',
        location: 'Community Center',
        goal: 500,
        raised: 230,
        status: 'open',
        daysLeft: 21,
        backers: 32,
        type: 'custom',
        unit: 'clothes',
    },
    {
        id: 4,
        title: 'Peer Tutoring Mentors',
        charity: 'Academic Success Center',
        location: 'Library',
        goal: 20,
        raised: 15,
        status: 'open',
        daysLeft: 10,
        backers: 15,
        type: 'volunteer',
    },
    {
        id: 5,
        title: 'Book Donation Drive',
        charity: 'Library Foundation',
        location: 'Main Library',
        goal: 1000,
        raised: 1000,
        status: 'fulfilled',
        daysLeft: 0,
        backers: 203,
        type: 'custom',
        unit: 'books',
    },
    {
        id: 6,
        title: 'Medical Supplies Fund',
        charity: 'Campus Health Services',
        location: 'Medical Center',
        goal: 4000,
        raised: 890,
        status: 'open',
        daysLeft: 30,
        backers: 19,
        type: 'money',
    },
];

/**
 * BountiesPage - Charity bounty feed view
 */
function BountiesPage() {
    const { isAdmin } = useAuth();
    const [bounties, setBounties] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    useEffect(() => {
        fetchBounties();
    }, []);

    const fetchBounties = async () => {
        const { data, error } = await supabase
            .from('bounties')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setBounties(data);
        } else {
            console.error('Error fetching bounties:', error);
        }
    };
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'open' | 'fulfilled'
    const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'money' | 'volunteer' | 'custom'

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBounty, setEditingBounty] = useState(null);
    const [bountyType, setBountyType] = useState('money');
    const [formData, setFormData] = useState({
        title: '',
        charity: '',
        goal: '',
        unit: '',
        moreInfoLink: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateBounty = async (e) => {
        e.preventDefault();

        const newBounty = {
            title: formData.title,
            charity: formData.charity,
            location: 'Remote/TBD',
            goal: Number(formData.goal) || 0,
            raised: 0,
            status: 'open',
            "daysLeft": 30,
            backers: 0,
            type: bountyType,
            unit: bountyType === 'custom' ? formData.unit : null,
            "moreInfoLink": formData.moreInfoLink || null,
        };

        const { data, error } = await supabase
            .from('bounties')
            .insert([newBounty])
            .select();

        if (!error && data) {
            setBounties([...data, ...bounties]);
            setIsModalOpen(false);
            setFormData({ title: '', charity: '', goal: '', unit: '', moreInfoLink: '' });
            setBountyType('money');
        } else {
            console.error('Error creating bounty:', error);
        }
    };

    const handleEditClick = (bounty) => {
        setEditingBounty(bounty);
        setIsEditModalOpen(true);
    };

    const handleUpdateBounty = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('bounties')
            .update({
                title: editingBounty.title,
                charity: editingBounty.charity,
                goal: editingBounty.goal,
                raised: editingBounty.raised,
                "daysLeft": editingBounty.daysLeft,
                status: editingBounty.status,
                "moreInfoLink": editingBounty.moreInfoLink,
            })
            .eq('id', editingBounty.id)
            .select();

        if (!error && data) {
            setBounties(bounties.map(b => b.id === editingBounty.id ? data[0] : b));
            setIsEditModalOpen(false);
            setEditingBounty(null);
        } else {
            console.error('Error updating bounty:', error);
        }
    };

    const handleDeleteBounty = async (id) => {
        const { error } = await supabase
            .from('bounties')
            .delete()
            .eq('id', id);

        if (!error) {
            setBounties(bounties.filter(b => b.id !== id));
            setIsEditModalOpen(false);
            setEditingBounty(null);
        } else {
            console.error('Error deleting bounty:', error);
        }
    };

    const filteredBounties = bounties.filter(bounty => {
        const matchesStatus = statusFilter === 'all' || bounty.status === statusFilter;
        const matchesType = typeFilter === 'all' || bounty.type === typeFilter;
        return matchesStatus && matchesType;
    });

    const stats = {
        total: bounties.length,
        raised: bounties.filter(b => b.type === 'money').reduce((acc, b) => acc + b.raised, 0),
        volunteers: bounties.filter(b => b.type === 'volunteer').reduce((acc, b) => acc + b.raised, 0),
        items: bounties.filter(b => b.type === 'custom').reduce((acc, b) => acc + b.raised, 0),
    };

    return (
        <div className="h-full overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-zinc-50 mb-2">Bounty Feed</h1>
                    <p className="text-zinc-400">
                        Support campus charities and track transparent fund allocation.
                    </p>
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: 'Total Bounties', value: stats.total, color: 'text-zinc-50' },
                        { label: 'Total Raised', value: `₹${stats.raised.toLocaleString()}`, color: 'text-amber-400' },
                        { label: 'Volunteers Mobilized', value: stats.volunteers.toLocaleString(), color: 'text-indigo-400' },
                        { label: 'Items Collected', value: stats.items.toLocaleString(), color: 'text-emerald-400' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4"
                        >
                            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Toolbar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between mb-6 gap-4"
                >
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search bounties..."
                            className="w-full h-10 pl-10 pr-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4">
                        {/* Status Filter */}
                        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                            {['all', 'open', 'fulfilled'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors',
                                        statusFilter === f
                                            ? 'bg-zinc-800 text-zinc-50'
                                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Type Filter */}
                        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                            {['all', 'money', 'volunteer', 'custom'].map((t) => {
                                let colorHoverClass = 'hover:text-zinc-300';
                                let colorActiveClass = 'bg-zinc-800 text-zinc-50';

                                if (t === 'money') {
                                    colorHoverClass = 'hover:text-amber-400';
                                    colorActiveClass = 'bg-amber-500/20 text-amber-400';
                                } else if (t === 'volunteer') {
                                    colorHoverClass = 'hover:text-indigo-400';
                                    colorActiveClass = 'bg-indigo-500/20 text-indigo-400';
                                } else if (t === 'custom') {
                                    colorHoverClass = 'hover:text-emerald-400';
                                    colorActiveClass = 'bg-emerald-500/20 text-emerald-400';
                                }

                                return (
                                    <button
                                        key={t}
                                        onClick={() => setTypeFilter(t)}
                                        className={cn(
                                            'px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors',
                                            typeFilter === t
                                                ? colorActiveClass
                                                : `text-zinc-500 hover:bg-zinc-800/50 ${colorHoverClass}`
                                        )}
                                    >
                                        {t}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                'p-2 rounded-md transition-colors',
                                viewMode === 'grid' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-2 rounded-md transition-colors',
                                viewMode === 'list' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add bounty - Admin only */}
                    {isAdmin && (
                        <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Bounty
                        </Button>
                    )}
                </motion.div>

                {/* Bounties grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={cn(
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'flex flex-col gap-4'
                    )}
                >
                    {filteredBounties.map((bounty, index) => (
                        <motion.div
                            key={bounty.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                        >
                            <BountyCard
                                title={bounty.title}
                                charity={bounty.charity}
                                location={bounty.location}
                                goal={bounty.goal}
                                raised={bounty.raised}
                                status={bounty.status}
                                daysLeft={bounty.daysLeft}
                                backers={bounty.backers}
                                type={bounty.type}
                                unit={bounty.unit}
                                moreInfoLink={bounty.moreInfoLink}
                                isAdmin={isAdmin}
                                onEdit={() => handleEditClick(bounty)}
                                className={viewMode === 'list' ? 'max-w-none' : ''}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty state */}
                {filteredBounties.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-zinc-500">No bounties found matching your filter.</p>
                    </div>
                )}

                {/* Edit Bounty Modal */}
                {editingBounty && (
                    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                        <form onSubmit={handleUpdateBounty}>
                            <ModalHeader>
                                <ModalTitle>Edit Bounty</ModalTitle>
                            </ModalHeader>
                            <ModalBody className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                                        Bounty Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingBounty.title}
                                        onChange={(e) => setEditingBounty({ ...editingBounty, title: e.target.value })}
                                        className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                                        Group/Entity Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingBounty.charity}
                                        onChange={(e) => setEditingBounty({ ...editingBounty, charity: e.target.value })}
                                        className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                                            Target Goal
                                        </label>
                                        <input
                                            type="number"
                                            value={editingBounty.goal}
                                            onChange={(e) => setEditingBounty({ ...editingBounty, goal: Number(e.target.value) })}
                                            className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                                            Raised Amount
                                        </label>
                                        <input
                                            type="number"
                                            value={editingBounty.raised}
                                            onChange={(e) => setEditingBounty({ ...editingBounty, raised: Number(e.target.value) })}
                                            className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                                            Days Left
                                        </label>
                                        <input
                                            type="number"
                                            value={editingBounty.daysLeft}
                                            onChange={(e) => setEditingBounty({ ...editingBounty, daysLeft: Number(e.target.value) })}
                                            className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={editingBounty.status}
                                            onChange={(e) => setEditingBounty({ ...editingBounty, status: e.target.value })}
                                            className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        >
                                            <option value="open">Open</option>
                                            <option value="fulfilled">Fulfilled</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                                        More Information Link <span className="text-zinc-500 font-normal">(Optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={editingBounty.moreInfoLink || ''}
                                        onChange={(e) => setEditingBounty({ ...editingBounty, moreInfoLink: e.target.value })}
                                        placeholder="e.g. https://example.com/details"
                                        className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <div className="flex w-full items-center justify-between">
                                    {(editingBounty.status === 'fulfilled' || editingBounty.daysLeft <= 0) ? (
                                        <button
                                            type="button"
                                            className="h-10 px-4 py-2 bg-transparent text-red-500 border border-red-500/50 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors"
                                            onClick={() => handleDeleteBounty(editingBounty.id)}
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <div />
                                    )}
                                    <div className="flex items-center gap-3">
                                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="primary">
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </ModalFooter>
                        </form>
                    </Modal>
                )}

                {/* Create Bounty Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <form onSubmit={handleCreateBounty}>
                        <ModalHeader>
                            <ModalTitle>Create New Bounty</ModalTitle>
                        </ModalHeader>
                        <ModalBody className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Bounty Type
                                </label>
                                <select
                                    value={bountyType}
                                    onChange={(e) => setBountyType(e.target.value)}
                                    className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                >
                                    <option value="money">Money Goal</option>
                                    <option value="volunteer">Volunteer Mobilization</option>
                                    <option value="custom">Custom Goal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Bounty Name
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Winter Clothing Drive"
                                    className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Group/Entity Name
                                </label>
                                <input
                                    type="text"
                                    name="charity"
                                    value={formData.charity}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Student Wellness"
                                    className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Target Number (Goal)
                                </label>
                                <input
                                    type="number"
                                    name="goal"
                                    value={formData.goal}
                                    onChange={handleInputChange}
                                    placeholder={bountyType === 'money' ? 'e.g. 5000' : 'e.g. 50'}
                                    className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    required
                                    min="1"
                                />
                            </div>

                            {bountyType === 'custom' && (
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                                        Unit Name
                                    </label>
                                    <input
                                        type="text"
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                        placeholder="e.g. clothes, blankets"
                                        className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    More Information Link <span className="text-zinc-500 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="url"
                                    name="moreInfoLink"
                                    value={formData.moreInfoLink || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g. https://example.com/details"
                                    className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                Create
                            </Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default BountiesPage;
