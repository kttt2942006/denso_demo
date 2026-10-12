import { Database, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function LineageLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-3 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
        <span className="text-sm font-medium">Đang tải Hộ chiếu số & Đồ thị phả hệ...</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <Card className="flex h-[560px] flex-col items-center justify-center bg-slate-50/50">
          <Database className="h-8 w-8 text-teal-600/40 animate-bounce" />
          <span className="mt-2 text-xs font-medium text-slate-400">Đang khởi tạo cấu trúc đồ thị Neo4j...</span>
        </Card>
        <Card className="h-[560px] bg-slate-50/50" />
      </div>
    </div>
  );
}
