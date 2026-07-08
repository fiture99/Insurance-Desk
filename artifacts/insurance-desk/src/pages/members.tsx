import { useState } from "react";
import { 
  useListMembers, 
  useCreateMember, 
  useUpdateMember, 
  useDeleteMember,
  useGetCurrentUser,
  getListMembersQueryKey,
  Member,
  RelationshipType,
  MemberStatus
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Search, UserPlus, Pencil, Trash2, X, AlertCircle, Save, Plus, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type MemberForm = {
  policyNo: string;
  name: string;
  insurer: string;
  employer: string;
  relationship: RelationshipType;
  status: MemberStatus;
  phone: string;
  dob: string;
};

export default function Members() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const { data: userResponse } = useGetCurrentUser();
  const canEdit = !!userResponse?.user;

  // Simple debounce for search
  useState(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  });

  const { data: members = [], isLoading } = useListMembers({ search: debouncedQuery });
  const { mutate: deleteMember } = useDeleteMember();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (member: Member) => {
    if (!window.confirm(`Remove ${member.name} from the members list?`)) return;
    deleteMember(
      { policyNo: member.policyNo },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });
          toast({ title: "Member removed", description: `${member.name} was removed.` });
        }
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-card-foreground m-0">Members</h1>
          <p className="text-muted-foreground text-sm mt-1">Principals and dependents covered under insurance policies.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Policy no, name, insurer…" 
              className="pl-9 bg-white"
            />
          </div>
          {canEdit && (
            <Button onClick={() => setShowAdd(true)} className="gap-2">
              <UserPlus className="w-4 h-4" /> Add member
            </Button>
          )}
        </div>
      </div>

      {!canEdit && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <Lock className="w-4 h-4" /> View only — sign in to add or edit members.
        </div>
      )}

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_1fr_0.8fr_80px] p-3 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border bg-[#FAFAFA]">
              <div>Name</div>
              <div>Policy no.</div>
              <div>Insurer</div>
              <div>Employer</div>
              <div>Relationship</div>
              <div>Status</div>
              <div></div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Empty */}
            {!isLoading && members.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm italic">
                No members match your search.
              </div>
            )}

            {/* List */}
            <div className="divide-y divide-border">
              {members.map((m) => (
                <div key={m.id} className="grid grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr_1fr_0.8fr_80px] p-3 px-5 items-center text-sm hover:bg-[#FAFAFA] transition-colors">
                  <div>
                    <div className="font-semibold text-card-foreground">{m.name}</div>
                    {m.phone && <div className="text-[11.5px] text-muted-foreground mt-0.5">{m.phone}</div>}
                    {m.dob && <div className="text-[11.5px] text-muted-foreground">DOB: {m.dob}</div>}
                  </div>
                  <div className="font-mono text-[12px] font-semibold text-secondary">{m.policyNo}</div>
                  <div className="text-[12.5px] text-card-foreground">{m.insurer}</div>
                  <div className="text-[12.5px] text-card-foreground">{m.employer}</div>
                  <div className="text-[12.5px] text-muted-foreground">{m.relationship}</div>
                  <div>
                    <span 
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-[0.2px] ${
                        m.status === "Active" ? "bg-[#E4F3F1] text-[#0E7A77]" : "bg-[#FBEBEA] text-[#C1483F]"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  {canEdit ? (
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-secondary hover:text-secondary hover:bg-secondary/10" onClick={() => setEditingMember(m)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(m)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : <div />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <MemberModal 
          onClose={() => setShowAdd(false)} 
        />
      )}
      {editingMember && (
        <MemberModal 
          initial={editingMember} 
          onClose={() => setEditingMember(null)} 
        />
      )}
    </div>
  );
}

function MemberModal({ initial, onClose }: { initial?: Member, onClose: () => void }) {
  const isEdit = !!initial;
  const [form, setForm] = useState<MemberForm>({
    policyNo: initial?.policyNo ?? "",
    name: initial?.name ?? "",
    insurer: initial?.insurer ?? "",
    employer: initial?.employer ?? "",
    relationship: initial?.relationship ?? "Dependent",
    status: initial?.status ?? "Active",
    phone: initial?.phone ?? "",
    dob: initial?.dob ?? "",
  });
  const [err, setErr] = useState("");

  const { mutate: createMember, isPending: isCreating } = useCreateMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const isPending = isCreating || isUpdating;

  const submit = () => {
    setErr("");
    if (!form.policyNo.trim()) return setErr("Policy number is required.");
    if (!form.name.trim()) return setErr("Name is required.");
    if (!form.insurer.trim()) return setErr("Insurer is required.");
    if (!form.employer.trim()) return setErr("Employer is required.");

    if (isEdit) {
      updateMember(
        { policyNo: form.policyNo, data: { ...form } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });
            toast({ title: "Member updated", description: "Changes saved successfully." });
            onClose();
          },
          onError: (error: any) => setErr(error?.response?.data?.error || "Failed to update member.")
        }
      );
    } else {
      createMember(
        { data: form },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });
            toast({ title: "Member added", description: "New member created successfully." });
            onClose();
          },
          onError: (error: any) => setErr(error?.response?.data?.error || "Failed to add member.")
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1B2A41]/45 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 flex justify-between items-center border-b border-border bg-[#FAFAFA]">
          <h2 className="font-serif text-xl font-semibold m-0">{isEdit ? "Edit member" : "Add member"}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-1.5">
            <Label>Policy number</Label>
            <Input 
              value={form.policyNo} 
              onChange={(e) => setForm({ ...form, policyNo: e.target.value })} 
              className={`font-mono ${isEdit ? "bg-muted text-muted-foreground" : ""}`}
              placeholder="e.g. GNPC/2025/B"
              readOnly={isEdit}
            />
            {isEdit && <span className="text-[11px] text-muted-foreground">Policy number cannot be changed after creation.</span>}
          </div>

          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              placeholder="e.g. Sarjo Badjie" 
              autoFocus={!isEdit}
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <Label>Insurer</Label>
              <Input 
                value={form.insurer} 
                onChange={(e) => setForm({ ...form, insurer: e.target.value })} 
                placeholder="e.g. Sunshine Insurance" 
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <Label>Employer</Label>
              <Input 
                value={form.employer} 
                onChange={(e) => setForm({ ...form, employer: e.target.value })} 
                placeholder="e.g. GNPC" 
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <Label>Relationship</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={form.relationship} 
                onChange={(e) => setForm({ ...form, relationship: e.target.value as RelationshipType })}
              >
                <option value="Principal">Principal</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Dependent">Dependent</option>
              </select>
            </div>
            <div className="space-y-1.5 flex-1">
              <Label>Status</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={form.status} 
                onChange={(e) => setForm({ ...form, status: e.target.value as MemberStatus })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <Label>Phone number</Label>
              <Input 
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                placeholder="+220 999 0000" 
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <Label>Date of birth</Label>
              <Input 
                type="date"
                value={form.dob} 
                onChange={(e) => setForm({ ...form, dob: e.target.value })} 
              />
            </div>
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
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : isEdit ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isEdit ? "Save changes" : "Add member"}
          </Button>
        </div>
      </div>
    </div>
  );
}