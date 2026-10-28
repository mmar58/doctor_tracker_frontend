import { StatusDistribution } from "@/lib/types";
import { Activity } from "lucide-react";

interface StatusBreakdownProps {
    data: StatusDistribution[];
    title?: string;
}

const statusMeta: Record<
    string,
    { label: string; color: string; bg: string; text: string }
> = {
    "very-ill": {
        label: "Very Ill",
        color: "bg-rose-500",
        bg: "bg-rose-50 dark:bg-rose-950/50",
        text: "text-rose-700 dark:text-rose-400",
    },
    ill: {
        label: "Ill",
        color: "bg-amber-500",
        bg: "bg-amber-50 dark:bg-amber-950/50",
        text: "text-amber-700 dark:text-amber-400",
    },
    stable: {
        label: "Stable",
        color: "bg-sky-500",
        bg: "bg-sky-50 dark:bg-sky-950/50",
        text: "text-sky-700 dark:text-sky-400",
    },
    good: {
        label: "Good",
        color: "bg-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-950/50",
        text: "text-emerald-700 dark:text-emerald-400",
    },
};

export function StatusDistributionWidget({
    data,
    title = "Health Status Distribution",
}: StatusBreakdownProps) {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    const orderedStatuses = ["very-ill", "ill", "stable", "good"] as const;

    const dataMap = new Map<string, number>();
    data.forEach((d) => dataMap.set(d.status, d.count));

    return (
        <div className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Activity className="size-5 text-sky-600 dark:text-sky-400" />
                    <h3 className="font-semibold text-foreground text-base">{title}</h3>
                </div>
                <p className="text-xs text-muted-foreground">Patient health conditions breakdown</p>
            </div>

            {/* Segmented Horizontal Bar */}
            <div className="my-6">
                <div className="h-4 w-full rounded-full overflow-hidden flex bg-muted/60 p-0.5 gap-0.5">
                    {total === 0 ? (
                        <div className="w-full h-full bg-muted rounded-full" />
                    ) : (
                        orderedStatuses.map((st) => {
                            const count = dataMap.get(st) ?? 0;
                            const pct = (count / total) * 100;
                            if (pct === 0) return null;
                            const meta = statusMeta[st];
                            return (
                                <div
                                    key={st}
                                    style={{ width: `${pct}%` }}
                                    title={`${meta.label}: ${count} (${pct.toFixed(1)}%)`}
                                    className={`${meta.color} transition-all duration-300 first:rounded-l-full last:rounded-r-full`}
                                />
                            );
                        })
                    )}
                </div>
            </div>

            {/* Legend Cards */}
            <div className="grid grid-cols-2 gap-2.5">
                {orderedStatuses.map((st) => {
                    const count = dataMap.get(st) ?? 0;
                    const pct = total > 0 ? ((count / total) * 100).toFixed(0) : "0";
                    const meta = statusMeta[st];

                    return (
                        <div
                            key={st}
                            className={`p-3 rounded-xl border border-border/80 ${meta.bg} flex items-center justify-between`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`size-2.5 rounded-full ${meta.color}`} />
                                <span className={`text-xs font-semibold ${meta.text}`}>
                                    {meta.label}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-foreground">{count}</span>
                                <span className="text-[10px] text-muted-foreground ml-1">({pct}%)</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

