"use client";

import Link from "next/link";
import { Radio } from "lucide-react";
import { useSim, type FeedLevel } from "@/lib/store";
import { NG_SERIAL } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const levelClass: Record<FeedLevel, string> = {
  info: "text-slate-600",
  ok: "text-ok-fg",
  alert: "text-warn-fg font-semibold",
  ng: "text-ng-fg font-semibold",
};

export function EdgeFeed() {
  const { feed, incident, triggerIncident } = useSim();
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Radio className="h-3.5 w-3.5 text-teal-600" /> Nhật ký sự kiện nạp biên (Edge Feed)
        </CardTitle>
        <span className="flex items-center gap-1 text-xs text-ok-fg">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-ok" /> streaming
        </span>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <ul className=" h-[248px] space-y-0.5 overflow-y-auto rounded-lg bg-slate-50 p-2 font-mono text-xs">
          {feed.map((e) => {
            const body = (
              <>
                <span className="text-slate-500">[{e.time}]</span> <span className="text-blue-600">[{e.gate}]</span>{" "}
                <span className={levelClass[e.level]}>{e.text}</span>
              </>
            );
            return (
              <li key={e.id} className={cn("animate-slidein rounded px-1.5 py-0.5", e.level === "ng" && "bg-red-50", e.level === "alert" && "bg-amber-50")}>
                {e.level === "ng" ? (
                  <Link href={`/lineage/${NG_SERIAL}`} className="hover:underline">
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
        <div className="rounded-lg border border-dashed border-slate-300 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Demo Simulator</div>
          <Button variant="danger" className="w-full whitespace-nowrap" onClick={triggerIncident} disabled={incident}>
            {incident ? (
              `Sự cố ${NG_SERIAL} đã kích hoạt`
            ) : (
              <>
                <span className="sm:hidden">Kích hoạt sự cố {NG_SERIAL}</span>
                <span className="hidden sm:inline">Kích hoạt Sự cố Thực nghiệm {NG_SERIAL}</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
