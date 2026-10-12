"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, GitBranch, Pause, Play, RotateCcw, ShieldAlert, Waypoints } from "lucide-react";
import { useSim } from "@/lib/store";
import { INCIDENT_ID, NG_SERIAL } from "@/lib/mock-data";
import { clock, cn } from "@/lib/utils";
import { Button } from "./ui/button";

const steps = [
  { href: "/", match: (p: string) => p === "/" || p === "/overview", label: "Giám sát xưởng", icon: Activity },
  { href: `/lineage/${NG_SERIAL}`, match: (p: string) => p.startsWith("/lineage"), label: "Hộ chiếu số", icon: GitBranch },
  { href: `/incident/${INCIDENT_ID}`, match: (p: string) => p.startsWith("/incident"), label: "Phân tích sự cố", icon: ShieldAlert },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { simTime, incident, running, setRunning, reset } = useSim();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-white">
            <Waypoints className="h-4 w-4" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-navy">TraceGraph AI</span>
            <span className="block text-xs text-slate-500 lg:hidden xl:block">DENSO DMVN · Line #03 CNC Machining</span>
          </span>
        </Link>

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto lg:order-none lg:w-auto">
          {steps.map((s, i) => {
            const active = s.match(pathname);
            return (
              <Link
                key={s.href}
                href={s.href}
                prefetch={true}
                className={cn(
                  "flex h-8 shrink-0 items-center gap-2 rounded-lg px-2 text-xs font-medium transition-colors",
                  active ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-100",
                )}
              >
                <span className={cn("grid h-4 w-4 place-items-center rounded-full text-xs", active ? "bg-white/20" : "bg-slate-200")}>{i + 1}</span>
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-slate-500 xl:inline">Ca 1: 06:00 – 14:00</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs tabular-nums text-navy">{clock(simTime)}</span>
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold",
              incident ? "animate-blink bg-red-50 text-ng-fg" : running ? "bg-green-50 text-ok-fg" : "bg-slate-100 text-slate-500",
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", incident ? "bg-ng" : running ? "bg-ok" : "bg-slate-400")} />
            {incident ? "SỰ CỐ" : running ? "Live" : "Paused"}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setRunning(!running)} aria-label={running ? "Tạm dừng" : "Tiếp tục"} title={running ? "Tạm dừng luồng dữ liệu" : "Tiếp tục"}>
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reset();
              router.push("/");
            }}
            title="Đưa toàn bộ demo về trạng thái ban đầu"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset demo
          </Button>
        </div>
      </div>
    </header>
  );
}
