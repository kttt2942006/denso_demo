"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { SHAP } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShapChart() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Khối 1 · Bóc tách nguyên nhân</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={SHAP} layout="vertical" margin={{ top: 4, right: 48, bottom: 4, left: 0 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="feature" width={160} tick={{ fontSize: 12, fill: "#334155" }} axisLine={false} tickLine={false} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={26} isAnimationActive animationDuration={700}>
              {SHAP.map((s) => (
                <Cell key={s.key} fill={s.color} />
              ))}
              <LabelList dataKey="value" position="right" formatter={(v) => `+${v}%`} style={{ fontSize: 13, fontWeight: 700, fill: "#0F172A", fontFamily: "var(--font-mono)" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-auto text-right text-xs text-slate-500">
          Mức đóng góp vào lỗi lệch dung sai (SHAP value, %)
        </div>
      </CardContent>
    </Card>
  );
}
