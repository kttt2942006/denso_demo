"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Database, Search, Timer } from "lucide-react";
import { getLineage, INCIDENT_ID } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonClass } from "@/components/ui/button";
import { LineageGraph } from "./lineage-graph";
import { Inspector } from "./inspector";

export function LineageView({ serial }: { serial: string }) {
  const router = useRouter();
  const lineage = useMemo(() => getLineage(serial), [serial]);
  const [selected, setSelected] = useState("product");
  const [query, setQuery] = useState(lineage.serial);
  const [queryMs, setQueryMs] = useState<number | null>(null);

  useEffect(() => {
    setSelected("product");
    setQuery(lineage.serial);
    setQueryMs(Math.round(18 + Math.random() * 9));
  }, [lineage.serial]);

  const node = lineage.nodes.find((n) => n.id === selected) ?? lineage.nodes[0];

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim().toUpperCase();
    if (q) router.push(`/lineage/${encodeURIComponent(q)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold text-navy">Hộ chiếu sản phẩm số</h1>
        <form onSubmit={onSearch} className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tra cứu Serial…"
              className="h-9 w-48 rounded-lg border border-slate-200 bg-white pl-8 pr-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
          <Button type="submit" size="md" variant="teal">
            Tra cứu
          </Button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>
              Mạng lưới đồ thị phả hệ (Interactive Graph View)
            </CardTitle>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Database className="h-3.5 w-3.5 text-teal-600" /> Neo4j ·{" "}
                {lineage.nodes.length} node · {lineage.edges.length} quan hệ
              </span>
              {queryMs !== null && (
                <span className="flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 font-mono font-semibold text-ok-fg">
                  <Timer className="h-3.5 w-3.5" /> {queryMs} ms
                </span>
              )}
            </div>
          </CardHeader>
          <div className="h-[560px]">
            <LineageGraph
              lineage={lineage}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Thuộc tính chi tiết</CardTitle>
            <span className="text-xs text-slate-500">Click node để xem</span>
          </CardHeader>
          <CardContent className=" max-h-[560px] flex-1 overflow-y-auto">
            <Inspector node={node} lineage={lineage} />
          </CardContent>
          <details className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
            <summary className="cursor-pointer font-semibold">
              Truy vấn Cypher
            </summary>
            <pre className="mt-2 overflow-x-auto rounded bg-navy p-2 font-mono text-xs leading-relaxed text-teal-100">
              {`MATCH path = (o:Order)-[:QUẢN_LÝ_LÔ]->(l:Lot)
  -[:CẤP_PHÔI_CHO]->(p:Product {serial: '${lineage.serial}'})
OPTIONAL MATCH (p)-[r]->(x)
RETURN path, r, x`}
            </pre>
          </details>
        </Card>
      </div>

      <div className="flex justify-center">
        <Link
          href={`/incident/${INCIDENT_ID}?serial=${lineage.serial}`}
          className={buttonClass(
            lineage.isNG ? "danger" : "primary",
            "lg",
            "text-base",
          )}
        >
          Phân tích Nguyên nhân và Lan truyền Tác động{" "}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
