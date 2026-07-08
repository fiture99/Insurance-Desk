import { Check } from "lucide-react";
import { RequestStage } from "@workspace/api-client-react";

const STAGES: RequestStage[] = ["Received", "Reviewed", "Actioned", "Confirmed"];

const STAGE_COLOR: Record<string, string> = {
  Received: "#E3993A",
  Reviewed: "#3D7EA6",
  Actioned: "#0E7A77",
  Confirmed: "#55606B",
};

export function StageRail({ stage, compact }: { stage: RequestStage; compact?: boolean }) {
  const idx = STAGES.indexOf(stage);

  if (compact) {
    return (
      <div className="flex gap-1 items-center">
        {STAGES.map((s, i) => (
          <div
            key={s}
            title={s}
            className="w-2 h-2 rounded-full"
            style={{ background: i <= idx ? STAGE_COLOR[stage] : "#E3E6EA" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center w-full">
      {STAGES.map((s, i) => (
        <div key={s} className="flex-1 flex items-center group relative">
          <div className="flex flex-col items-center min-w-[74px] z-10">
            <div
              className={`w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 text-[11px] font-bold transition-colors ${
                i <= idx ? "text-white" : "text-[#9AA2AB]"
              }`}
              style={{
                background: i <= idx ? STAGE_COLOR[s] : "#fff",
                borderColor: i <= idx ? STAGE_COLOR[s] : "#D7DBE0",
              }}
            >
              {i < idx ? <Check className="w-[13px] h-[13px]" /> : i + 1}
            </div>
            <span
              className={`mt-1.5 text-[11px] font-mono tracking-[0.2px] transition-colors ${
                i <= idx ? "text-[#1B2A41]" : "text-[#9AA2AB]"
              }`}
            >
              {s}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <div
              className="absolute left-1/2 right-[-50%] top-[11px] h-[2px] -translate-y-1/2 -z-10 transition-colors"
              style={{ background: i < idx ? STAGE_COLOR[s] : "#E3E6EA" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
