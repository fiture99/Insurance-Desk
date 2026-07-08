import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin, getGetCurrentUserQueryKey, useGetCurrentUser } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, ShieldAlert, Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const queryClient = useQueryClient();
  const { mutate: login, isPending } = useLogin();
  const { data: userResponse } = useGetCurrentUser();

  // If already logged in, redirect
  if (userResponse?.user) {
    setLocation("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    login(
      { data: { username: username.trim(), password } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
          setLocation("/");
        },
        onError: () => {
          setErrorMsg("Incorrect username or password.");
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex bg-[#F6F7F9]">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-border p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-card-foreground">Staff sign-in</h1>
            <p className="text-sm text-muted-foreground mt-2">Sign in with your Insurance Desk credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrorMsg(""); }}
                placeholder="e.g. fatou"
                className="bg-white"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                  placeholder="••••••••"
                  className="bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-sm text-destructive font-medium p-3 bg-destructive/10 rounded-md">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </div>
            )}

            <Button type="submit" className="w-full font-medium" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign in
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-[#1B2A41] items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
         <div className="relative z-10 max-w-md text-center">
            <h2 className="text-3xl font-serif text-white font-medium mb-4">Precision matters.</h2>
            <p className="text-[#9AA2AB] text-lg">Manage member requests and policies securely and efficiently.</p>
         </div>
      </div>
    </div>
  );
}