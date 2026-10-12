import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function IncidentLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-3 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
        <span className="text-sm font-medium">Đang tải Trung tâm phân tích sự cố...</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-[280px] bg-slate-50/50" />
        <Card className="h-[280px] bg-slate-50/50" />
      </div>
      <Card className="h-[200px] bg-slate-50/50" />
      <Card className="h-[200px] bg-slate-50/50" />
    </div>
  );
}
