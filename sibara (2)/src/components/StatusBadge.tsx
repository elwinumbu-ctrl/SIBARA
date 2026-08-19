import { StatusRegulasi } from "@/lib/types";

const LABEL: Record<StatusRegulasi, string> = {
  berlaku: "Berlaku",
  ditinjau: "Ditinjau",
  dicabut: "Dicabut",
};

const STYLE: Record<StatusRegulasi, string> = {
  berlaku: "bg-status-berlaku/10 text-status-berlaku",
  ditinjau: "bg-status-ditinjau/10 text-status-ditinjau",
  dicabut: "bg-status-dicabut/10 text-status-dicabut",
};

export default function StatusBadge({ status }: { status: StatusRegulasi }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLE[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {LABEL[status]}
    </span>
  );
}
