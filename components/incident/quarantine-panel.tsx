"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Download, Loader2, Lock, RefreshCw } from "lucide-react";
import { useSim } from "@/lib/store";
import { LOT_SIZE, NG_SERIAL, QUARANTINE } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, fmt } from "@/lib/utils";

export function QuarantinePanel() {
  const { erpSynced, syncErp } = useSim();
  const [syncing, setSyncing] = useState(false);
  const saved = LOT_SIZE - QUARANTINE.length;
  const savedPct = (saved / LOT_SIZE) * 100;

  const exportCsv = () => {
    const rows = [
      "serial,machine,window,status",
      ...QUARANTINE.map(
        (s) => `${s},CNC-03,08:31-09:05,${s === NG_SERIAL ? "NG" : "SUSPECT"}`,
      ),
    ];
    const url = URL.createObjectURL(
      new Blob([rows.join("\n")], { type: "text/csv" }),
    );
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "quarantine_INC-2026-1014.csv",
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const onSync = () => {
    setSyncing(true);
    setTimeout(() => {
      syncErp();
      setSyncing(false);
    }, 900);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Khối 2 · Lan truyền tác động & danh sách cách ly</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="grid grid-cols-2 gap-2 text-center">
          <Stat
            value={QUARANTINE.length}
            label="Serial nghi vấn cần cách ly"
            tone="text-ng-fg"
          />
          <Stat value={saved} label="Sản phẩm an toàn" tone="text-ok-fg" />
        </div>
        <div>
          <div className="flex h-3 overflow-hidden rounded-full">
            <div className="bg-ng" style={{ width: `${100 - savedPct}%` }} />
            <div className="bg-ok/80" style={{ width: `${savedPct}%` }} />
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Giảm <b className="text-ok-fg">{fmt(savedPct, 1)}%</b> phế phẩm loại
            oan so với cách ly cả lô Lot_A08
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          {QUARANTINE.length} Serial cùng mẻ gia công lúc CNC-03 bị rung (08:31
          – 09:05)
        </div>
        <div className=" grid max-h-[148px] grid-cols-3 gap-1.5 overflow-y-auto rounded-lg bg-slate-50 p-2 sm:grid-cols-4 xl:grid-cols-6">
          {QUARANTINE.map((s) => (
            <Link
              key={s}
              href={`/lineage/${s}`}
              className={cn(
                "flex items-center justify-center gap-1 rounded border bg-white px-1 py-1 font-mono text-xs transition-colors hover:border-blue-400",
                s === NG_SERIAL
                  ? "border-red-300 font-bold text-ng-fg"
                  : "border-slate-200 text-slate-700",
                erpSynced && "bg-slate-100",
              )}
            >
              {erpSynced && <Lock className="h-2.5 w-2.5 text-warn-fg" />}
              {s}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2">
          <Button
            variant={erpSynced ? "outline" : "teal"}
            className={cn(
              "flex-1 whitespace-nowrap",
              erpSynced && "disabled:opacity-100",
            )}
            onClick={onSync}
            disabled={erpSynced || syncing}
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : erpSynced ? (
              <CheckCircle2 className="h-4 w-4 text-ok-fg" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {erpSynced
              ? "Đã đồng bộ lệnh khóa lên ERP/WMS"
              : "Đồng bộ lệnh khóa lên ERP/WMS"}
          </Button>
          <Button
            variant="outline"
            className="whitespace-nowrap"
            onClick={exportCsv}
          >
            <Download className="h-4 w-4" /> Xuất danh sách (CSV)
          </Button>
          {erpSynced && <Badge tone="warn">48 mã đã khóa</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-2">
      <div className={cn("font-mono text-2xl font-bold tabular-nums", tone)}>
        {fmt(value)}
      </div>
      <div className="text-xs leading-tight text-slate-500">{label}</div>
    </div>
  );
}
