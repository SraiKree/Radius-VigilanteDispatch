import { cn } from '../../lib/cn';
import { Card, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Heart, MapPin, Clock, Users } from 'lucide-react';

/**
 * BountyCard - Charity bounty item card
 * Displays bounty info with status and progress
 */
function BountyCard({
    title,
    charity,
    location,
    goal,
    raised,
    status = 'open',
    daysLeft,
    backers,
    type = 'money',
    unit = '',
    className,
    moreInfoLink,
    isAdmin,
    onEdit,
    ...props
}) {
    const progress = Math.min(100, (raised / goal) * 100);

    const getProgressDisplay = () => {
        if (type === 'volunteer') {
            return {
                raised: `${raised.toLocaleString()} volunteers`,
                goal: `of ${goal.toLocaleString()} needed`
            };
        }
        if (type === 'custom') {
            return {
                raised: `${raised.toLocaleString()} ${unit}`,
                goal: `of ${goal.toLocaleString()} ${unit}`
            };
        }
        return {
            raised: `₹${raised.toLocaleString()} raised`,
            goal: `of ₹${goal.toLocaleString()}`
        };
    };

    const getDisplayConfig = () => {
        switch (type) {
            case 'volunteer':
                return {
                    icon: Users,
                    colorClass: 'text-indigo-400',
                    bgClass: 'bg-indigo-500/20'
                };
            case 'custom':
                return {
                    icon: Heart,
                    colorClass: 'text-emerald-400',
                    bgClass: 'bg-emerald-500/20'
                };
            case 'money':
            default:
                return {
                    icon: Heart,
                    colorClass: 'text-amber-400',
                    bgClass: 'bg-amber-500/20'
                };
        }
    };

    const displayConfig = getDisplayConfig();
    const IconComponent = displayConfig.icon;
    const progressDisplay = getProgressDisplay();

    return (
        <Card
            variant="elevated"
            className={cn('overflow-hidden hover:border-zinc-700 transition-colors', className)}
            {...props}
        >
            <CardContent className="p-0">
                {/* Header with status */}
                <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", displayConfig.bgClass)}>
                            <IconComponent className={cn("w-5 h-5", displayConfig.colorClass)} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-50">{title}</h4>
                            <p className="text-xs text-zinc-500">{charity}</p>
                        </div>
                    </div>
                    <Badge variant={status === 'fulfilled' ? 'fulfilled' : 'open'}>
                        {status === 'fulfilled' ? 'Fulfilled' : 'Open'}
                    </Badge>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-zinc-300">
                                {progressDisplay.raised}
                            </span>
                            <span className="text-sm text-zinc-500">
                                {progressDisplay.goal}
                            </span>
                        </div>
                        <ProgressBar
                            value={raised}
                            max={goal}
                            variant="bounty"
                        />
                        <p className="text-xs text-zinc-500 mt-1 font-mono">
                            {progress.toFixed(1)}% complete
                        </p>
                    </div>

                    {/* Footer stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{daysLeft} days left</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <Users className="w-3.5 h-3.5" />
                                <span>{backers} backers</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {(moreInfoLink || isAdmin) && (
                        <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-zinc-800/50">
                            {moreInfoLink && (
                                <a
                                    href={moreInfoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 rounded-md"
                                >
                                    More Information
                                </a>
                            )}
                            {isAdmin && (
                                <button
                                    onClick={onEdit}
                                    className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md"
                                >
                                    Edit card
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export { BountyCard };
