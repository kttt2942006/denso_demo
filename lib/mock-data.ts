export const INCIDENT_ID = "INC-2026-1014";
/** Vietnamese decimal format, kept local so mock data has no UI imports. */
const dec = (n: number, d: number) =>
  n.toLocaleString("vi-VN", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });

export const NG_SERIAL = "SN-98214";
export const VIB_LIMIT = 1.5;

export const LOT_SIZE = 1000;
/** 48 serials machined on CNC-03 during the vibration window */
export const QUARANTINE: string[] = Array.from(
  { length: 48 },
  (_, i) => `SN-${98201 + i}`,
);

export const SHAP = [
  {
    feature: "Rung trục chính CNC-03",
    key: "vib",
    value: 68,
    color: "#DC2626",
  },
  { feature: "Độ mòn dao cắt T04", key: "tool", value: 22, color: "#EA580C" },
  { feature: "Nhiệt độ dầu cắt gọt", key: "temp", value: 10, color: "#EAB308" },
];

export type NodeKind =
  | "product"
  | "lot"
  | "order"
  | "machine"
  | "qc"
  | "pallet"
  | "supplier";

export type Field = {
  label: string;
  value: string;
  tone?: "ng" | "warn" | "ok";
};
export type InspectorSection = { title: string; fields: Field[] };

export type LineageNode = {
  id: string;
  kind: NodeKind;
  title: string;
  subtitle: string;
  status: "ok" | "warn" | "ng" | "locked";
  badge?: string;
  sections: InspectorSection[];
};

export type LineageEdge = { source: string; target: string; label: string };

export type Lineage = {
  serial: string;
  part: string;
  isNG: boolean;
  nodes: LineageNode[];
  edges: LineageEdge[];
};

/** CNC-03 vibration/temperature trace around the machining window of a part (08:42:10 – 08:44:30) */
export function machiningTrace(ng: boolean) {
  const pts = [];
  for (let i = 0; i <= 28; i++) {
    const t = 8 * 3600 + 42 * 60 + 10 + i * 5;
    const hh = Math.floor(t / 3600),
      mm = Math.floor(t / 60) % 60,
      ss = t % 60;
    const label = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    const bump = ng ? Math.exp(-((i - 17) ** 2) / 30) * 2.0 : 0;
    const vib =
      0.82 + bump + Math.sin(i * 1.7) * 0.07 + (ng && i === 17 ? 0.03 : 0);
    const temp = (ng ? 58.5 : 55) + i * (ng ? 0.15 : 0.05) + Math.cos(i) * 0.3;
    pts.push({
      t: label,
      vib: Math.round(vib * 100) / 100,
      temp: Math.round(temp * 10) / 10,
    });
  }
  return pts;
}

export function getLineage(serialRaw: string): Lineage {
  const serial = serialRaw.toUpperCase();
  const isNG = serial === NG_SERIAL;
  const suspect = QUARANTINE.includes(serial);
  const deviation = isNG ? 0.025 : suspect ? 0.004 : 0.002;
  const machine = isNG || suspect ? "CNC-03" : "CNC-02";

  const nodes: LineageNode[] = [
    {
      id: "order",
      kind: "order",
      title: "Order_101",
      subtitle: "Lệnh SX · Toyota",
      status: "ok",
      sections: [
        {
          title: "Lệnh sản xuất",
          fields: [
            { label: "Mã lệnh", value: "Order_101" },
            { label: "Khách hàng", value: "Toyota Motor Vietnam" },
            { label: "Sản phẩm", value: "Van tiết lưu T-08" },
            { label: "Số lượng", value: "5.000 cái" },
            { label: "Hạn giao", value: "10/10/2026 13:15 (xe tải)" },
          ],
        },
      ],
    },
    {
      id: "supplier",
      kind: "supplier",
      title: "Nippon Steel",
      subtitle: "Nhà cung cấp",
      status: "ok",
      sections: [
        {
          title: "Nhà cung cấp",
          fields: [
            { label: "Tên", value: "Nippon Steel Corporation" },
            { label: "Mác thép", value: "SUS304 Ø32" },
            { label: "Chứng chỉ", value: "Mill Cert MC-77120 (đạt)" },
          ],
        },
      ],
    },
    {
      id: "lot",
      kind: "lot",
      title: "Lot_A08",
      subtitle: "Lô phôi thép",
      status: "ok",
      sections: [
        {
          title: "Lô phôi",
          fields: [
            { label: "Mã lô", value: "Lot_A08" },
            {
              label: "Quy mô lô",
              value: `${LOT_SIZE.toLocaleString("vi-VN")} phôi`,
            },
            { label: "Ngày nhập kho", value: "08/10/2026" },
            { label: "Kiểm tra đầu vào", value: "Đạt (IQC-2210)", tone: "ok" },
          ],
        },
      ],
    },
    {
      id: "product",
      kind: "product",
      title: serial,
      subtitle: "Van tiết lưu T-08",
      status: isNG ? "ng" : suspect ? "warn" : "ok",
      badge: isNG ? "NG" : suspect ? "NGHI VẤN" : "OK",
      sections: [
        {
          title: "Hộ chiếu sản phẩm",
          fields: [
            { label: "Mã Serial", value: `${serial} (Van Tiết Lưu T-08)` },
            { label: "Thời điểm cấp phôi", value: "10/10/2026 08:30:15" },
            {
              label: "Trạng thái kiểm định",
              value: isNG
                ? "NG (No Good)"
                : suspect
                  ? "Nghi vấn — chờ đo lại"
                  : "OK",
              tone: isNG ? "ng" : suspect ? "warn" : "ok",
            },
          ],
        },
        {
          title: `Thông số gia công máy ${machine}`,
          fields: [
            { label: "Thời gian gá đặt", value: "08:42:10 - 08:44:30" },
            {
              label: "Độ rung trục chính",
              value: isNG
                ? "2,85g (VƯỢT NGƯỠNG!)"
                : suspect
                  ? "2,1g (vượt ngưỡng)"
                  : "0,84g",
              tone: isNG || suspect ? "ng" : "ok",
            },
            { label: "Nhiệt độ dầu cắt", value: isNG ? "62,5°C" : "56,1°C" },
            { label: "Dòng tải Spindle", value: isNG ? "24,2 A" : "21,7 A" },
            {
              label: "Mã dao cắt",
              value: "Dao tiện T04 (Tuổi thọ 94%)",
              tone: isNG || suspect ? "warn" : undefined,
            },
          ],
        },
        {
          title: "Kết quả phòng đo CMM",
          fields: [
            {
              label: "Dung sai đường kính ngoài",
              value: `+${dec(deviation, 3)} mm`,
              tone: deviation > 0.005 ? "ng" : "ok",
            },
            {
              label: "Tiêu chuẩn bản vẽ",
              value: `± 0,005 mm${deviation > 0.005 ? " (Lệch chuẩn)" : ""}`,
            },
          ],
        },
      ],
    },
    {
      id: "machine",
      kind: "machine",
      title: machine,
      subtitle: "Máy gia công CNC",
      status: isNG || suspect ? "ng" : "ok",
      badge: isNG || suspect ? "Bạc đạn rơ!" : undefined,
      sections: [
        {
          title: `Máy ${machine}`,
          fields: [
            { label: "Loại máy", value: "Máy tiện CNC Okuma LB3000" },
            { label: "Thời gian gá đặt", value: "08:42:10 - 08:44:30" },
            {
              label: "Rung đỉnh",
              value: isNG ? "2,85g" : suspect ? "2,1g" : "0,84g",
              tone: isNG || suspect ? "ng" : "ok",
            },
            { label: "Ngưỡng cho phép", value: `${dec(VIB_LIMIT, 1)}g` },
            { label: "Nhiệt độ dầu cắt", value: isNG ? "62,5°C" : "56,1°C" },
            { label: "Dòng tải Spindle", value: isNG ? "24,2 A" : "21,7 A" },
            {
              label: "Dao cắt",
              value: "T04 — tuổi thọ đã dùng 94%",
              tone: "warn",
            },
          ],
        },
      ],
    },
    {
      id: "qc",
      kind: "qc",
      title: "QC_Test",
      subtitle: "Trạm đo CMM",
      status: deviation > 0.005 ? "ng" : "ok",
      badge: deviation > 0.005 ? `Lệch +${dec(deviation, 3)} mm` : undefined,
      sections: [
        {
          title: "Kết quả đo CMM",
          fields: [
            { label: "Thiết bị", value: "CMM Zeiss Contura — Phòng đo 2" },
            { label: "Thời điểm đo", value: "10/10/2026 10:14:10" },
            { label: "Đường kính danh định", value: "Ø 24,000 mm" },
            {
              label: "Đo thực tế",
              value: `Ø ${dec(24 + deviation, 3)} mm`,
              tone: deviation > 0.005 ? "ng" : "ok",
            },
            { label: "Dung sai bản vẽ CAD", value: "± 0,005 mm" },
            {
              label: "Kết luận",
              value: deviation > 0.005 ? "NG — vượt dung sai" : "OK",
              tone: deviation > 0.005 ? "ng" : "ok",
            },
          ],
        },
      ],
    },
    {
      id: "pallet",
      kind: "pallet",
      title: "Pallet_P1",
      subtitle: "Thành phẩm chờ xuất",
      status: isNG || suspect ? "locked" : "ok",
      badge: isNG || suspect ? "Tạm khóa" : undefined,
      sections: [
        {
          title: "Pallet thành phẩm",
          fields: [
            { label: "Mã pallet", value: "Pallet_P1" },
            { label: "Số lượng", value: "200 / 200 cái" },
            { label: "Vị trí", value: "Kho TP — Kệ B-04" },
            {
              label: "Trạng thái",
              value: isNG || suspect ? "Tạm khóa xuất" : "Sẵn sàng xuất",
              tone: isNG || suspect ? "warn" : "ok",
            },
          ],
        },
      ],
    },
  ];

  const edges: LineageEdge[] = [
    { source: "order", target: "lot", label: "QUẢN_LÝ_LÔ" },
    { source: "supplier", target: "lot", label: "CUNG_ỨNG" },
    { source: "lot", target: "product", label: "CẤP_PHÔI_CHO" },
    { source: "product", target: "machine", label: "GIA_CÔNG_TẠI" },
    { source: "product", target: "qc", label: "KIỂM_ĐỊNH_TẠI" },
    { source: "product", target: "pallet", label: "ĐÓNG_GÓI_VÀO" },
  ];

  return { serial, part: "Van tiết lưu T-08", isNG, nodes, edges };
}
