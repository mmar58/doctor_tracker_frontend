import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    badge?: string;
    trend?: {
        value: string;
        positive?: boolean;
    };
    color?: "sky" | "emerald" | "amber" | "rose" | "violet";
}

const colorStyles = {
    sky: {
        iconBg: "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400",
        borderHover: "hover:border-sky-300 dark:hover:border-sky-800",
        badge: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    },
    emerald: {
        iconBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
        borderHover: "hover:border-emerald-300 dark:hover:border-emerald-800",
        badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    },
    amber: {
        iconBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
        borderHover: "hover:border-amber-300 dark:hover:border-amber-800",
        badge: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    },
    rose: {
        iconBg: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400",
        borderHover: "hover:border-rose-300 dark:hover:border-rose-800",
        badge: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    },
    violet: {
        iconBg: "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400",
        borderHover: "hover:border-violet-300 dark:hover:border-violet-800",
        badge: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    },
};

export function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    badge,
    trend,
    color = "sky",
}: StatsCardProps) {
    const style = colorStyles[color];

    return (
        <div
            className={`p-6 rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-md ${style.borderHover}`}
        >
            <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <div className={`p-2.5 rounded-xl ${style.iconBg}`}>
                    <Icon className="size-5" />
                </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
                {badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                        {badge}
                    </span>
                )}
            </div>

            {(subtitle || trend) && (
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    {subtitle && <span>{subtitle}</span>}
                    {trend && (
                        <span
                            className={`font-medium ${
                                trend.positive ? "text-emerald-600" : "text-rose-600"
                            }`}
                        >
                            {trend.value}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

