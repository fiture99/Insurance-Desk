import { useState } from "react";
import { 
  useListStaff, 
  useCreateStaff, 
  useDeleteStaff, 
  useGetCurrentUser,
  getListStaffQueryKey,
  StaffRole
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, X, Trash2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Redirect } from "wouter";

export default function StaffAccounts() {
  const [showAdd, setShowAdd] = useState(false);
  
  const { data: userResponse, isLoading: isUserLoading } = useGetCurrentUser();
  const { data: staff = [], isLoading: isStaffLoading } = useListStaff({
    query: { enabled: userResponse?.user?.role === "admin" }
  });
  
  const { mutate: deleteStaff } = useDeleteStaff();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (isUserLoading) return null;
  if (userResponse?.user?.role !== "admin") return <Redirect to="/" />;

  const handleDelete = (id: number, username: string) => {
    if (userResponse?.user?.id === id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!window.confirm(`Delete staff account for @${username}?`)) return;
    
    deleteStaff(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListStaffQueryKey() });
          toast({ title: "Account deleted", description: `@${username} has been removed.` });
        }
      }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-card-foreground m-0 flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-primary" />
            Staff Accounts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage system access for Insurance Desk personnel.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add account
        </Button>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[1.5fr_1fr_1.5fr_80px] p-3 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border bg-[#FAFAFA]">
              <div>Username</div>
              <div>Role</div>
              <div>Created</div>
              <div></div>
            </div>

            {isStaffLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : staff.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm italic">
                No staff accounts found.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {staff.map((u) => (
                  <div key={u.id} className="grid grid-cols-[1.5fr_1fr_1.5fr_80px] p-3 px-5 items-center text-sm hover:bg-[#FAFAFA] transition-colors">
                    <div className="font-semibold text-card-foreground flex items-center gap-2">
                      @{u.username}
                      {userResponse?.user?.id === u.id && <span className="bg-secondary/10 text-secondary text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">You</span>}
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-[0.2px] capitalize ${u.role === 'admin' ? 'bg-[#FDF5E8] text-[#E3993A]' : 'bg-muted text-muted-foreground'}`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-[13px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-end">
                      {userResponse?.user?.id !== u.id && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(u.id, u.username)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdd && <StaffModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function StaffModal({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");
  const [err, setErr] = useState("");

  const { mutate: createStaff, isPending } = useCreateStaff();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const submit = () => {
    setErr("");
    if (username.length < 3) return setErr("Username must be at least 3 characters.");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");

    createStaff(
      { data: { username: username.trim(), password, role } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListStaffQueryKey() });
          toast({ title: "Account created", description: `@${username} can now log in.` });
          onClose();
        },
        onError: (error: any) => setErr(error?.response?.data?.error || "Failed to create account.")
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-[#1B2A41]/45 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-lg overflow-hidden flex flex-col">
        <div className="p-5 flex justify-between items-center border-b border-border bg-[#FAFAFA]">
          <h2 className="font-serif text-xl font-semibold m-0">Add staff account</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Username</Label>
            <Input 
              value={username} 
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} 
              placeholder="e.g. fatou" 
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input 
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Min. 6 characters" 
            />
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <select 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={role} 
              onChange={(e) => setRole(e.target.value as StaffRole)}
            >
              <option value="staff">Staff (manage members & requests)</option>
              <option value="admin">Admin (full access + settings & accounts)</option>
            </select>
          </div>

          {err && (
            <div className="flex items-center gap-2 text-[12.5px] font-semibold text-destructive mt-2 p-2 bg-destructive/10 rounded">
              <AlertCircle className="w-3.5 h-3.5" /> {err}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-[#FAFAFA]">
          <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button onClick={submit} disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Create account
          </Button>
        </div>
      </div>
    </div>
  );
}