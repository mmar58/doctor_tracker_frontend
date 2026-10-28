import { PatientsPerDoctorStat } from "@/lib/types";
import { Stethoscope, UserCheck } from "lucide-react";

interface PatientsPerDoctorProps {
    data: PatientsPerDoctorStat[];
    avgPatients: number;
}

export function PatientsPerDoctorChart({ data, avgPatients }: PatientsPerDoctorProps) {
    const maxCount = Math.max(...data.map((d) => d.patientCount), 1);

    return (
        <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-2">
                    <Stethoscope className="size-5 text-sky-600 dark:text-sky-400" />
                    <div>
                        <h3 className="font-semibold text-foreground text-base">Patients per Doctor</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Workload distribution across medical staff
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <span className="text-xs text-muted-foreground">Average</span>
                    <p className="text-sm font-bold text-foreground">{avgPatients} patients / doc</p>
                </div>
            </div>

            <div className="mt-5 space-y-4">
                {data.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        No doctor patient assignments yet.
                    </div>
                ) : (
                    data.map((d) => {
                        const pct = Math.min((d.patientCount / maxCount) * 100, 100);

                        return (
                            <div key={d.doctorId} className="group">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-700 dark:text-sky-300 font-semibold text-[10px]">
                                            {d.doctorName.charAt(0)}
                                        </div>
                                        <span className="font-medium text-foreground">{d.doctorName}</span>
                                        <span className="text-muted-foreground text-[11px] hidden sm:inline">
                                            • {d.hospital}
                                        </span>
                                    </div>
                                    <span className="font-bold text-foreground">
                                        {d.patientCount} <span className="font-normal text-muted-foreground">patients</span>
                                    </span>
                                </div>

                                <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${Math.max(pct, 5)}%` }}
                                        className="h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full group-hover:from-sky-400 group-hover:to-sky-500 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

