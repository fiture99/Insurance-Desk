import { useState, useEffect } from "react";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { data: settings, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [facilityName, setFacilityName] = useState("");

  useEffect(() => {
    if (settings) {
      setFacilityName(settings.facilityName);
    }
  }, [settings]);

  const handleSave = () => {
    if (!facilityName.trim()) return;

    updateSettings(
      { data: { facilityName: facilityName.trim() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
          toast({
            title: "Settings saved",
            description: "The facility name has been updated.",
          });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-card-foreground m-0">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage global configuration for this Insurance Desk instance.</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="facilityName" className="text-base font-semibold">Facility Name</Label>
          <p className="text-sm text-muted-foreground">
            This name appears in the sidebar and on printed reports.
          </p>
          <Input
            id="facilityName"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            className="max-w-md mt-2"
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button onClick={handleSave} disabled={isPending || !facilityName.trim() || facilityName === settings?.facilityName}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}