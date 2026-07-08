import { useState, useMemo } from "react";
import { 
  useListRequests, 
  useCreateRequest, 
  useAdvanceRequest,
  useGetCurrentUser,
  useListMembers,
  getListRequestsQueryKey,
  InsurerRequest,
  RequestType,
  RequestStage
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, X, Search, AlertCircle, Loader2, Lock, FileText, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StageRail } from "@/components/stage-rail";

type RequestForm = {
  type: RequestType;
  policyNo: string;
  memberName: string;
  insurer: string;
  notes: string;
};

const REQUEST_TYPES: RequestType[] = ["Add dependent", "Remove dependent", "Update details", "Reinstate"];

export default function Requests() {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<InsurerRequest | null>(null);

  const { data: userResponse } = useGetCurrentUser();
  const canEdit = !!userResponse?.user;

  const { data: requests = [], isLoading } = useListRequests();

  return (
    <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex flex-col flex-1 ${selectedRequest ? "hidden lg:flex max-w-[45%]" : ""}`}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-card-foreground m-0">Requests</h1>
            <p className="text-muted-foreground text-sm mt-1">Inbox of member changes from insurers.</p>
          </div>
          {canEdit && (
            <Button onClick={() => setShowAdd(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Log request
            </Button>
          )}
        </div>

        {!canEdit && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mb-4">
            <Lock className="w-4 h-4" /> View only — sign in to log or advance requests.
          </div>
        )}

        <div className="flex-1 bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          {isLoading ? (
            <div className="p-8 flex justify-center flex-1 items-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm italic flex-1 flex items-center justify-center">
              No requests logged.
            </div>
          ) : (
            <div className="divide-y divide-border overflow-y-auto flex-1">
              {requests.map((r) => (
                <div 
                  key={r.id} 
                  className={`p-4 px-5 cursor-pointer transition-colors ${selectedRequest?.id === r.id ? "bg-[#EBF3F8] border-l-2 border-l-secondary" : "hover:bg-[#FAFAFA] border-l-2 border-l-transparent"}`}
                  onClick={() => setSelectedRequest(r)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-card-foreground">{r.memberName}</div>
                      <div className="text-[12px] font-mono text-secondary font-medium mt-0.5">{r.policyNo}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[12.5px] text-muted-foreground font-medium">{r.type}</span>
                    <StageRail stage={r.stage} compact />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div className="flex-1 bg-white border border-border rounded-xl shadow-sm flex flex-col overflow-hidden relative min-h-[500px]">
          <div className="p-5 border-b border-border bg-[#FAFAFA] flex justify-between items-center sticky top-0 z-10">
            <div>
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">Request {selectedRequest.id}</div>
              <h2 className="font-serif text-xl font-semibold m-0">{selectedRequest.type}</h2>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedRequest(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 pb-32">
            <div className="mb-10 p-6 bg-[#FDFDFD] border border-border rounded-xl shadow-sm">
              <StageRail stage={selectedRequest.stage} />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date received</div>
                  <div className="text-sm font-medium">{new Date(selectedRequest.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Policy number</div>
                  <div className="text-sm font-mono font-semibold text-secondary">{selectedRequest.policyNo}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Member name</div>
                  <div className="text-sm font-medium">{selectedRequest.memberName}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Insurer</div>
                  <div className="text-sm font-medium">{selectedRequest.insurer}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Notes</div>
                <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg italic">
                  {selectedRequest.notes || "No notes provided."}
                </p>
              </div>
            </div>
          </div>

          {canEdit && (
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
              <AdvanceControls request={selectedRequest} />
            </div>
          )}
        </div>
      )}

      {showAdd && <RequestModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AdvanceControls({ request }: { request: InsurerRequest }) {
  const { mutate: advanceRequest, isPending } = useAdvanceRequest();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const STAGES: RequestStage[] = ["Received", "Reviewed", "Actioned", "Confirmed"];
  const currentIdx = STAGES.indexOf(request.stage);
  const nextStage = STAGES[currentIdx + 1];

  const handleAdvance = () => {
    if (!nextStage) return;
    advanceRequest(
      { id: request.id, data: { stage: nextStage } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListRequestsQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["/api/members"] }); // Members status auto-updates
          queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
          toast({ title: "Stage advanced", description: `Request moved to ${nextStage}.` });
        }
      }
    );
  };

  if (!nextStage) {
    return (
      <div className="text-center text-sm font-medium text-muted-foreground p-2">
        This request is fully confirmed.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Current stage: <strong className="text-card-foreground">{request.stage}</strong>
      </div>
      <Button onClick={handleAdvance} disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Advance to {nextStage}
      </Button>
    </div>
  );
}

function RequestModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<RequestForm>({
    type: "Remove dependent",
    policyNo: "",
    memberName: "",
    insurer: "",
    notes: ""
  });
  const [err, setErr] = useState("");

  const { data: members = [] } = useListMembers();
  const { mutate: createRequest, isPending } = useCreateRequest();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Autocomplete matching
  const matchingMember = useMemo(() => {
    if (form.policyNo.length > 3) {
      return members.find(m => m.policyNo.toLowerCase() === form.policyNo.toLowerCase());
    }
    return null;
  }, [form.policyNo, members]);

  // Validation warning
  const policyWarning = useMemo(() => {
    if (!form.policyNo || form.policyNo.length < 3) return null;
    if (form.type === "Add dependent" && matchingMember) return "A member with this policy number already exists.";
    if (form.type !== "Add dependent" && !matchingMember && form.policyNo.length > 5) return "This policy number doesn't match an existing member.";
    return null;
  }, [form.policyNo, form.type, matchingMember]);

  const handleAutocomplete = () => {
    if (matchingMember) {
      setForm(f => ({
        ...f,
        memberName: matchingMember.name,
        insurer: matchingMember.insurer
      }));
    }
  };

  const submit = () => {
    setErr("");
    if (!form.policyNo.trim()) return setErr("Policy number is required.");
    if (!form.memberName.trim()) return setErr("Member name is required.");
    if (!form.insurer.trim()) return setErr("Insurer is required.");

    createRequest(
      { data: form },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListRequestsQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
          toast({ title: "Request logged", description: "The request has been added to the inbox." });
          onClose();
        },
        onError: (error: any) => setErr(error?.response?.data?.error || "Failed to log request.")
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-[#1B2A41]/45 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 flex justify-between items-center border-b border-border bg-[#FAFAFA]">
          <h2 className="font-serif text-xl font-semibold m-0">Log incoming request</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-1.5 flex-1">
            <Label>Request type</Label>
            <select 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={form.type} 
              onChange={(e) => setForm({ ...form, type: e.target.value as RequestType })}
            >
              {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-1.5 relative">
            <Label>Policy number</Label>
            <div className="flex gap-2">
              <Input 
                value={form.policyNo} 
                onChange={(e) => setForm({ ...form, policyNo: e.target.value })} 
                className="font-mono flex-1"
                placeholder="e.g. POL-12345"
              />
              {(form.type === "Remove dependent" || form.type === "Update details" || form.type === "Reinstate") && matchingMember && (
                <Button variant="secondary" onClick={handleAutocomplete} type="button" className="shrink-0 text-xs">
                  Autofill
                </Button>
              )}
            </div>
            {policyWarning && <p className="text-xs text-[#E3993A] font-medium mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {policyWarning}</p>}
          </div>

          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <Label>Member name</Label>
              <Input 
                value={form.memberName} 
                onChange={(e) => setForm({ ...form, memberName: e.target.value })} 
                placeholder="e.g. Lamin Manneh" 
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <Label>Insurer</Label>
              <Input 
                value={form.insurer} 
                onChange={(e) => setForm({ ...form, insurer: e.target.value })} 
                placeholder="e.g. Sunu Assurances" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes & Reason</Label>
            <Textarea 
              value={form.notes} 
              onChange={(e) => setForm({ ...form, notes: e.target.value })} 
              placeholder="Record any details from the email or letter..." 
              className="min-h-[100px] resize-none"
            />
          </div>

          {err && (
            <div className="flex items-center gap-2 text-[12.5px] font-semibold text-destructive mt-2 p-2 bg-destructive/10 rounded">
              <AlertCircle className="w-3.5 h-3.5" /> {err}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-[#FAFAFA]">
          <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button onClick={submit} disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Log request
          </Button>
        </div>
      </div>
    </div>
  );
}