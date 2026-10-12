import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { INCIDENT_ID, NG_SERIAL } from "@/lib/mock-data";
import { ShapChart } from "@/components/incident/shap-chart";
import { QuarantinePanel } from "@/components/incident/quarantine-panel";
import { WhatIf } from "@/components/incident/what-if";
import { RoleCards } from "@/components/incident/role-cards";

type Props = { params: { id: string }; searchParams: { serial?: string } };

export default function IncidentPage({ params, searchParams }: Props) {
  const serial = searchParams.serial ?? NG_SERIAL;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/lineage/${serial}`} className="flex items-center gap-1 py-1.5 text-sm text-slate-500 hover:text-navy">
          <ArrowLeft className="h-4 w-4" /> Hộ chiếu số
        </Link>
        <h1 className="text-lg font-bold text-navy">
          Báo cáo phân tích sự cố: <span className="font-mono text-ng-fg">{decodeURIComponent(params.id)}</span>
        </h1>
        <span className="text-sm text-slate-500">
          Sản phẩm <span className="font-mono font-semibold text-navy">{serial}</span> · Khâu Gia công CNC · Phát hiện lúc{" "}
          <span className="font-mono">10:14:10</span> · RCA <span className="font-mono">1,8 s</span>
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ShapChart />
        <QuarantinePanel />
      </div>
      <WhatIf />
      <RoleCards />
    </div>
  );
}
