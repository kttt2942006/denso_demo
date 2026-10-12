"use client";

import { ArrowRight, Clock, Shuffle, TrendingDown } from "lucide-react";
import { useSim } from "@/lib/store";
import { CNC04_LOAD, CNC04_MAX, hours, simulate } from "@/lib/whatif";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DOWNTIMES = [15, 30, 60];

export function WhatIf() {
  const { downtime, reroute, setDowntime, setReroute } = useSim();
  const r = simulate(downtime, reroute);
  const onTime = r.delayWithReroute === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Khối 3 · Mô phỏng kịch bản ứng phó</CardTitle>
        <span className="text-xs text-slate-500">
          Đơn hàng Toyota · cut-off 13:15
        </span>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[1fr_1fr_1.2fr]">
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Clock className="h-3.5 w-3.5 text-teal-600" /> Giả định: dừng
            CNC-03 để thay dao T04 & căn chỉnh bạc đạn
          </label>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {DOWNTIMES.map((d) => (
              <button
                key={d}
                onClick={() => setDowntime(d)}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors",
                  downtime === d
                    ? "bg-white text-navy shadow-sm"
                    : "text-slate-600 hover:text-navy",
                )}
              >
                {d < 60 ? `${d} phút` : "1 giờ"}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={downtime}
            onChange={(e) => setDowntime(+e.target.value)}
            className="h-6 w-full"
            aria-label="Thời gian dừng máy"
          />
          <div className="text-xs text-slate-500">
            Backlog cần bù: <b className="font-mono text-navy">{r.backlog}</b>{" "}
            phôi (gồm đo lại 48 serial & chạy rà máy)
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Shuffle className="h-3.5 w-3.5 text-teal-600" /> Điều hướng phôi
            CNC-03 → CNC-04 (dự phòng)
          </label>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-navy">
              {reroute}%
            </span>
            <span className="text-xs text-slate-500">lưu lượng</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={reroute}
            onChange={(e) => setReroute(+e.target.value)}
            className="h-6 w-full"
            aria-label="Tỷ lệ điều hướng"
          />
          <div className="text-xs text-slate-500">Tải CNC-04</div>
          <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="absolute inset-y-0 left-0 bg-slate-400"
              style={{ width: `${CNC04_LOAD}%` }}
            />
            <div
              className={cn(
                "absolute inset-y-0",
                r.overload ? "bg-ng" : "bg-teal-600",
              )}
              style={{
                left: `${CNC04_LOAD}%`,
                width: `${Math.min(100, r.cnc04Load) - CNC04_LOAD}%`,
              }}
            />
            <div
              className="absolute inset-y-0 w-0.5 bg-ng"
              style={{ left: `${CNC04_MAX}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-xs text-slate-500">
            <span>Hiện tại {CNC04_LOAD}%</span>
            <span
              className={
                r.overload
                  ? "font-bold text-ng-fg"
                  : "font-semibold text-teal-700"
              }
            >
              → {r.cnc04Load}% {r.overload && "(quá tải!)"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Outcome
            label="Không điều hướng"
            value={hours(r.delayNoAction)}
            sub="trễ đơn Toyota"
            tone="ng"
          />
          <ArrowRight className="h-5 w-5 text-slate-300" />
          <Outcome
            label={`Điều hướng ${reroute}%`}
            value={hours(r.delayWithReroute)}
            sub={onTime ? "Đúng tiến độ 100%" : "vẫn trễ"}
            tone={onTime ? "ok" : "warn"}
          />
          <div className="col-span-3 flex items-start gap-2 rounded-lg bg-teal-50 p-2.5 text-xs text-teal-700">
            <TrendingDown className="mt-0.5 h-4 w-4 shrink-0" />
            {r.recommended !== null ? (
              <span>
                <b>Đề xuất tối ưu:</b> điều hướng <b>{r.recommended}%</b> phôi
                sang CNC-04 (tải {CNC04_LOAD}% → {CNC04_LOAD + r.recommended}%)
                để giảm trễ xuống <b>0 giờ</b>.
                {reroute !== r.recommended && (
                  <button
                    onClick={() => setReroute(r.recommended!)}
                    className="ml-1 font-semibold underline underline-offset-2"
                  >
                    Áp dụng
                  </button>
                )}
              </span>
            ) : (
              <span>
                <b>Cảnh báo:</b> CNC-04 không đủ năng lực bù hết; cần thêm ca
                tăng cường hoặc đàm phán dời lịch xe tải.
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Outcome({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "ok" | "warn" | "ng";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 text-center",
        tone === "ok" && "border-green-200 bg-green-50",
        tone === "warn" && "border-amber-200 bg-amber-50",
        tone === "ng" && "border-red-200 bg-red-50",
      )}
    >
      <div className="text-xs text-slate-600">{label}</div>
      <div
        className={cn(
          "font-mono text-2xl font-bold",
          tone === "ok"
            ? "text-ok-fg"
            : tone === "warn"
              ? "text-warn-fg"
              : "text-ng-fg",
        )}
      >
        {value}
      </div>
      <div className="text-xs font-semibold text-slate-600">{sub}</div>
    </div>
  );
}
