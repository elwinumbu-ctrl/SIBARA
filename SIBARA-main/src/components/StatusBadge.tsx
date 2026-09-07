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

const HEX: Record<StatusRegulasi, string> = {
  berlaku: "#22C55E",
  ditinjau: "#F59E0B",
  dicabut: "#EF4444",
};

const ICON: Record<StatusRegulasi, React.ReactNode> = {
  berlaku: <CheckCircle2 size={12} strokeWidth={2.4} />,
  ditinjau: <Clock size={12} strokeWidth={2.4} />,
  dicabut: <XCircle size={12} strokeWidth={2.4} />,
};

export default function StatusBadge({
  status,
  size = "md",
  /** Use on a dark/navy surface (glass cards, dark tables) so the badge
   * reads as a soft tinted chip instead of a light pastel block. */
  dark = false,
}: {
  status: StatusRegulasi;
  size?: "sm" | "md";
  dark?: boolean;
}) {
  const hex = HEX[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold shrink-0 ${
        dark ? "" : STYLE[status]
      } ${size === "sm" ? "px-2 py-0.5 text-[10.5px]" : "px-2.5 py-1 text-xs"}`}
      style={dark ? { backgroundColor: `${hex}1F`, color: hex, border: `1px solid ${hex}33` } : undefined}
    >
      {ICON[status]}
      {LABEL[status]}
    </span>
  );
}
