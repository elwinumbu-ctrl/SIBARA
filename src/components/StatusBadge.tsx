import { StatusRegulasi } from "@/lib/types";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const LABEL: Record<StatusRegulasi, string> = {
  berlaku: "Berlaku",
  ditinjau: "Ditinjau",
  dicabut: "Dicabut",
};

const STYLE: Record<StatusRegulasi, string> = {
  berlaku: "bg-status-berlaku-bg text-status-berlaku",
  ditinjau: "bg-status-ditinjau-bg text-status-ditinjau",
  dicabut: "bg-status-dicabut-bg text-status-dicabut",
};

const ICON: Record<StatusRegulasi, React.ReactNode> = {
  berlaku: <CheckCircle2 size={12} strokeWidth={2.4} />,
  ditinjau: <Clock size={12} strokeWidth={2.4} />,
  dicabut: <XCircle size={12} strokeWidth={2.4} />,
};

export default function StatusBadge({
  status,
  size = "md",
}: {
  status: StatusRegulasi;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold shrink-0 ${STYLE[status]} ${
        size === "sm" ? "px-2 py-0.5 text-[10.5px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      {ICON[status]}
      {LABEL[status]}
    </span>
  );
}
