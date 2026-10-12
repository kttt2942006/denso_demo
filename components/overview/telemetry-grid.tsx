"use client";

import { AlertTriangle } from "lucide-react";
import { useSim } from "@/lib/store";
import { VIB_LIMIT } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/sparkline";
import { cn, fmt } from "@/lib/utils";

export function TelemetryGrid() {
  const machines = useSim((s) => s.machines);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Trạng thái trạm máy</CardTitle>
        <span className="text-xs text-slate-500">
          Ngưỡng rung: {fmt(VIB_LIMIT, 1)}g
        </span>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {machines.map((m) => {
          const alarm = m.vib > VIB_LIMIT;
          return (
            <div
              key={m.id}
              className={cn(
                "rounded-lg border p-3 transition-colors",
                alarm
                  ? "animate-ring border-2 border-ng bg-red-50/50"
                  : "border-slate-200",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-navy">
                  {m.id}
                </span>
                {alarm ? (
                  <Badge tone="ng" className="animate-blink">
                    <AlertTriangle className="h-3 w-3" /> CẢNH BÁO
                  </Badge>
                ) : (
                  <Badge tone="ok">Hoạt động</Badge>
                )}
              </div>
              <div className="text-xs uppercase text-slate-500">
                Rung trục chính
              </div>
              <div
                className={cn(
                  "font-mono text-2xl font-bold tabular-nums",
                  alarm ? "animate-blink text-ng-fg" : "text-navy",
                )}
              >
                {fmt(m.vib, 2)}
                <span className="text-sm font-medium text-slate-500">g</span>
              </div>
              <div className="my-2">
                <Sparkline
                  data={m.history}
                  width={160}
                  height={28}
                  color={alarm ? "#DC2626" : "#0D9488"}
                  threshold={VIB_LIMIT}
                  max={3.2}
                />
              </div>
              <dl className="grid grid-cols-3 gap-1 text-xs">
                <Metric
                  label="Dầu"
                  value={`${fmt(m.temp, 1)}°C`}
                  warn={alarm}
                />
                <Metric
                  label="Dòng"
                  value={`${fmt(m.current, 1)}A`}
                  warn={alarm}
                />
                <Metric label="Tải" value={`${m.load}%`} />
              </dl>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="rounded bg-slate-50 px-1.5 py-1">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={cn(
          "font-mono font-semibold tabular-nums",
          warn ? "text-warn-fg" : "text-slate-700",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
