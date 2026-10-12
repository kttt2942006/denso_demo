"use client";

import Link from "next/link";
import { AlertOctagon, ArrowRight } from "lucide-react";
import { useSim } from "@/lib/store";
import { NG_SERIAL } from "@/lib/mock-data";

export function AlertBanner() {
  const incident = useSim((s) => s.incident);
  if (!incident) return null;
  return (
    <Link
      href={`/lineage/${NG_SERIAL}`}
      prefetch={true}
      className="flex animate-slidein cursor-pointer items-center gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-ng-fg transition-all hover:bg-red-100 active:scale-[0.99] active:bg-red-200"
    >
      <AlertOctagon className="h-5 w-5 shrink-0 animate-blink" />
      <span className="flex-1">
        <b>Isolation Forest phát hiện bất thường:</b> CNC-03 rung 2,85g (ngưỡng 1,5g) · CMM gắn cờ NG cho <b className="font-mono">{NG_SERIAL}</b> (+0,025 mm)
      </span>
      <span className="flex shrink-0 items-center gap-1 font-semibold">
        Truy vết phả hệ <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
