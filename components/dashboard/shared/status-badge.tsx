interface StatusBadgeProps {
    status: "very-ill" | "ill" | "stable" | "good" | string;
    admit?: boolean;
    className?: string;
}

const statusConfig: Record<
    string,
    { label: string; bg: string; text: string; dot: string }
> = {
    "very-ill": {
        label: "Very Ill",
        bg: "bg-rose-50 dark:bg-rose-950/60",
        text: "text-rose-700 dark:text-rose-400",
        dot: "bg-rose-500",
    },
    ill: {
        label: "Ill",
        bg: "bg-amber-50 dark:bg-amber-950/60",
        text: "text-amber-700 dark:text-amber-400",
        dot: "bg-amber-500",
    },
    stable: {
        label: "Stable",
        bg: "bg-sky-50 dark:bg-sky-950/60",
        text: "text-sky-700 dark:text-sky-400",
        dot: "bg-sky-500",
    },
    good: {
        label: "Good",
        bg: "bg-emerald-50 dark:bg-emerald-950/60",
        text: "text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
    },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        label: status,
        bg: "bg-muted",
        text: "text-foreground",
        dot: "bg-muted-foreground",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}
        >
            <span className={`size-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

export function AdmitBadge({ admit }: { admit: boolean }) {
    if (admit) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                Admitted
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
            Outpatient
        </span>
    );
}

