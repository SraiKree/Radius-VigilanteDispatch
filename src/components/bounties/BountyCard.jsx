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
                    colorClass: 'text-command',
                    bgClass: 'bg-command/20 border border-command/30'
                };
            case 'custom':
                return {
                    icon: Heart,
                    colorClass: 'text-foreground',
                    bgClass: 'bg-surface border border-border'
                };
            case 'money':
            default:
                return {
                    icon: Heart,
                    colorClass: 'text-ledger',
                    bgClass: 'bg-ledger/20 border border-ledger/30'
                };
        }
    };

    const displayConfig = getDisplayConfig();
    const IconComponent = displayConfig.icon;
    const progressDisplay = getProgressDisplay();

    return (
        <Card
            variant="elevated"
            className={cn('overflow-hidden bg-surface border-border hover:border-ledger/50 transition-colors shadow-none rounded-sm', className)}
            {...props}
        >
            <CardContent className="p-0">
                {/* Header with status */}
                <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-zinc-950/20">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-sm flex items-center justify-center", displayConfig.bgClass)}>
                            <IconComponent className={cn("w-5 h-5", displayConfig.colorClass)} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground tracking-tight">{title}</h4>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">{charity}</p>
                        </div>
                    </div>
                    <Badge variant={status === 'fulfilled' ? 'fulfilled' : 'open'}>
                        {status === 'fulfilled' ? 'Fulfilled' : 'Open'}
                    </Badge>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-mono text-xs">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{location}</span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">
                                {progressDisplay.raised}
                            </span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">
                                {progressDisplay.goal}
                            </span>
                        </div>
                        <ProgressBar
                            value={raised}
                            max={goal}
                            variant="bounty"
                        />
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                            {progress.toFixed(1)}% complete
                        </p>
                    </div>

                    {/* Footer stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{daysLeft} days left</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                                <Users className="w-3.5 h-3.5" />
                                <span>{backers} backers</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {(moreInfoLink || isAdmin) && (
                        <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-border">
                            {moreInfoLink && (
                                <a
                                    href={moreInfoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium text-ledger hover:text-ledger/80 transition-colors px-3 py-1.5 bg-ledger/10 hover:bg-ledger/20 border border-ledger/20 rounded-sm"
                                >
                                    More Information
                                </a>
                            )}
                            {isAdmin && (
                                <button
                                    onClick={onEdit}
                                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 bg-surface border border-border hover:bg-muted/30 rounded-sm"
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
