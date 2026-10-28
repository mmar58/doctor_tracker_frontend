"use client";

import { useState } from "react";
import { DateBasedStat } from "@/lib/types";
import { Calendar, TrendingUp } from "lucide-react";

interface TimelineChartProps {
    data: DateBasedStat[];
    title?: string;
    subtitle?: string;
    days: number;
    onDaysChange?: (days: number) => void;
}

export function TimelineChart({
    data,
    title = "Patient Consultations Timeline",
    subtitle = "Daily activity and admissions over time",
    days,
    onDaysChange,
}: TimelineChartProps) {
    const [activeMetric, setActiveMetric] = useState<"total" | "admitted" | "outpatient">("total");
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Compute maximum value for scaling
    const maxVal = Math.max(...data.map((d) => d[activeMetric]), 5);

    const totalInPeriod = data.reduce((acc, curr) => acc + curr[activeMetric], 0);

    const metricLabels = {
        total: { label: "Total Patients", color: "bg-sky-500", stroke: "#0ea5e9" },
        admitted: { label: "Admitted", color: "bg-rose-500", stroke: "#f43f5e" },
        outpatient: { label: "Outpatient", color: "bg-emerald-500", stroke: "#10b981" },
    };

    // Chart dimensions
    const height = 180;
    const paddingBottom = 24;
    const usableHeight = height - paddingBottom;

    return (
        <div className="p-6 rounded-2xl border border-border bg-card">
            {/* Header with Title and Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
                <div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="size-5 text-sky-600 dark:text-sky-400" />
                        <h3 className="font-semibold text-foreground text-base">{title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Metric Selector */}
                    <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/40 text-xs">
                        {(["total", "admitted", "outpatient"] as const).map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setActiveMetric(m)}
                                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                                    activeMetric === m
                                        ? "bg-background text-foreground shadow-xs"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {/* Day Range Selector */}
                    {onDaysChange && (
                        <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/40 text-xs">
                            {[7, 14, 30].map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => onDaysChange(d)}
                                    className={`px-2 py-1 rounded-md font-medium transition-colors ${
                                        days === d
                                            ? "bg-sky-600 text-white"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {d}d
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Metric Summary */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${metricLabels[activeMetric].color}`} />
                    <span className="text-sm font-medium text-foreground">
                        {metricLabels[activeMetric].label}:
                    </span>
                    <span className="text-lg font-bold text-foreground">{totalInPeriod}</span>
                    <span className="text-xs text-muted-foreground">in selected window</span>
                </div>

                {hoveredIndex !== null && data[hoveredIndex] && (
                    <div className="text-xs px-2.5 py-1 rounded-md bg-muted font-medium text-foreground animate-in fade-in">
                        {data[hoveredIndex].date}:{" "}
                        <span className="font-bold">{data[hoveredIndex][activeMetric]}</span> (
                        {data[hoveredIndex].admitted} admitted, {data[hoveredIndex].outpatient}{" "}
                        outpatient)
                    </div>
                )}
            </div>

            {/* SVG Visual Bars */}
            <div className="mt-6 w-full">
                <div className="relative h-48 w-full flex items-end gap-1 sm:gap-1.5 pt-4">
                    {data.map((item, index) => {
                        const val = item[activeMetric];
                        const barHeightPercent = Math.max((val / maxVal) * 100, 3);
                        const isHovered = hoveredIndex === index;

                        return (
                            <div
                                key={item.date}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="group relative flex-1 h-full flex flex-col justify-end items-center cursor-pointer"
                            >
                                {/* Tooltip on hover */}
                                {isHovered && (
                                    <div className="absolute -top-10 z-20 pointer-events-none px-2 py-1 rounded bg-black/80 text-white text-[11px] whitespace-nowrap shadow-lg">
                                        <p className="font-semibold">
                                            {item.date}: {val}
                                        </p>
                                    </div>
                                )}

                                {/* Bar */}
                                <div
                                    style={{ height: `${barHeightPercent}%` }}
                                    className={`w-full rounded-t-sm transition-all duration-200 ${
                                        activeMetric === "total"
                                            ? isHovered
                                                ? "bg-sky-400"
                                                : "bg-sky-500/80"
                                            : activeMetric === "admitted"
                                            ? isHovered
                                                ? "bg-rose-400"
                                                : "bg-rose-500/80"
                                            : isHovered
                                            ? "bg-emerald-400"
                                            : "bg-emerald-500/80"
                                    }`}
                                />

                                {/* Date Label (shows every few days for clarity) */}
                                {(data.length <= 14 || index % Math.ceil(data.length / 7) === 0) && (
                                    <span className="text-[10px] text-muted-foreground mt-2 truncate max-w-full">
                                        {item.date.slice(5)}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

