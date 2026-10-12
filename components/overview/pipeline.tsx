"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Boxes, ClipboardCheck, Cog, Truck, Wrench } from "lucide-react";
import { useSim } from "@/lib/store";
import { NG_SERIAL } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, fmt } from "@/lib/utils";

export function Pipeline() {
  const { produced, incident, running } = useSim();
  const ready = produced - 612;

  const stages = [
    { n: 1, title: "Cấp phôi", icon: Boxes, line: "Lot_A08: 500", sub: "phôi còn lại", rate: 118, status: "ok" as const },
    { n: 2, title: "Gia công", icon: Cog, line: "4 máy CNC", sub: incident ? "CNC-03 rung 2,85g" : "CNC-01…04 hoạt động", rate: incident ? 96 : 120, status: incident ? ("warn" as const) : ("ok" as const) },
    { n: 3, title: "Lắp ráp", icon: Wrench, line: "2 trạm siết", sub: "Torque ổn định", rate: 117, status: "ok" as const },
    { n: 4, title: "Đo QC", icon: ClipboardCheck, line: "CMM Phòng đo", sub: incident ? `${NG_SERIAL}: NG` : "50 mẫu / lượt", rate: 115, status: incident ? ("ng" as const) : ("ok" as const) },
    { n: 5, title: "Xuất kho", icon: Truck, line: "Pallet_P01", sub: `Ready: ${fmt(ready)}`, rate: 114, status: "ok" as const },
  ];

  return (
    <Card>
      <CardContent className="overflow-x-auto ">
        <div className="flex min-w-[860px] items-stretch">
          {stages.map((s, i) => (
            <div key={s.n} className="flex flex-1 items-center">
              <StageCard {...s} />
              {i < stages.length - 1 && <FlowArrow active={running} alert={incident && i === 1} />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type StageProps = { n: number; title: string; icon: typeof Boxes; line: string; sub: string; rate: number; status: "ok" | "warn" | "ng" };

function StageCard({ n, title, icon: Icon, line, sub, rate, status }: StageProps) {
  const isNgStage = status === "ng";
  const body = (
    <div
      className={cn(
        "relative h-full w-full rounded-lg border bg-white p-3 transition-all",
        status === "ok" && "border-slate-200",
        status === "warn" && "border-amber-300 bg-amber-50/50",
        status === "ng" && "animate-ring border-red-300 bg-red-50/50 hover:bg-red-50",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-navy">
          <Icon className="h-3.5 w-3.5 text-teal-600" />
          {n}. {title}
        </span>
        {status === "ok" ? (
          <Badge tone="ok">OK</Badge>
        ) : (
          <Badge tone={status} className={status === "ng" ? "animate-blink" : undefined}>
            <AlertTriangle className="h-3 w-3" /> {status === "ng" ? "NG" : "!"}
          </Badge>
        )}
      </div>
      <div className="text-sm font-semibold text-slate-800">{line}</div>
      <div className={cn("text-xs", status === "ok" ? "text-slate-500" : status === "ng" ? "font-semibold text-ng-fg" : "font-semibold text-warn-fg")}>{sub}</div>
      <div className="mt-2 font-mono text-xs tabular-nums text-slate-500">{rate} pcs/h</div>
      {isNgStage && <div className="mt-1 text-xs font-semibold text-ng-fg underline underline-offset-2">Xem hộ chiếu số →</div>}
    </div>
  );
  return isNgStage ? (
    <Link href={`/lineage/${NG_SERIAL}`} prefetch={true} className="block h-full w-full">
      {body}
    </Link>
  ) : (
    body
  );
}

function FlowArrow({ active, alert }: { active: boolean; alert: boolean }) {
  return (
    <div className="relative mx-1 flex h-6 w-10 shrink-0 items-center">
      <div className={cn("h-0.5 w-full", alert ? "bg-amber-300" : "bg-slate-200")} />
      <ArrowRight className={cn("absolute -right-1 h-4 w-4", alert ? "text-warn-fg" : "text-slate-300")} />
      {active &&
        [0, 0.6, 1.2].map((d) => (
          <span
            key={d}
            className={cn("absolute h-1.5 w-1.5 -translate-x-1/2 rounded-full animate-flow", alert ? "bg-warn" : "bg-teal-600")}
            style={{ animationDelay: `${d}s` }}
          />
        ))}
    </div>
  );
}
