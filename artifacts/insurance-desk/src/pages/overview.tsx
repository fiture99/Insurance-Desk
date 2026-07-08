import { useGetDashboardSummary } from "@workspace/api-client-react";
import { FileText, CheckCircle2, Users, UserMinus, Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const STAGE_COLOR: Record<string, { bg: string, text: string }> = {
  Received: { bg: "#FDF5E8", text: "#E3993A" },
  Reviewed: { bg: "#EBF3F8", text: "#3D7EA6" },
  Actioned: { bg: "#E4F3F1", text: "#0E7A77" },
  Confirmed: { bg: "#F0F1F3", text: "#55606B" },
};

export default function Overview() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-card-foreground m-0">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time status of member requests and coverage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#FDF5E8] flex items-center justify-center text-[#E3993A]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-card-foreground">{summary.openRequests}</div>
            <div className="text-sm font-medium text-muted-foreground">Open requests</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#F0F1F3] flex items-center justify-center text-[#55606B]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-card-foreground">{summary.confirmedRequests}</div>
            <div className="text-sm font-medium text-muted-foreground">Confirmed today</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#E4F3F1] flex items-center justify-center text-[#0E7A77]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-card-foreground">{summary.activeMembers}</div>
            <div className="text-sm font-medium text-muted-foreground">Active members</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#FBEBEA] flex items-center justify-center text-[#C1483F]">
            <UserMinus className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-card-foreground">{summary.deactivatedMembers}</div>
            <div className="text-sm font-medium text-muted-foreground">Deactivated members</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-[#FAFAFA]">
          <h2 className="font-semibold text-card-foreground m-0">In-progress requests</h2>
          <Link href="/requests" className="text-sm font-medium text-secondary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {summary.inProgress.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm italic">
            No requests currently in progress.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {summary.inProgress.map((req) => (
              <div key={req.id} className="p-4 px-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-card-foreground">{req.memberName}</span>
                    <span className="text-xs font-mono font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded">{req.policyNo}</span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="font-medium text-card-foreground">{req.type}</span>
                    <span>•</span>
                    <span>{req.insurer}</span>
                  </div>
                </div>
                <div 
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                  style={{ backgroundColor: STAGE_COLOR[req.stage]?.bg, color: STAGE_COLOR[req.stage]?.text }}
                >
                  {req.stage}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}