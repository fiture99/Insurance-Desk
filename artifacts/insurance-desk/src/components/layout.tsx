import { Link, useLocation } from "wouter";
import { useGetCurrentUser, useLogout, getGetCurrentUserQueryKey, useGetSettings } from "@workspace/api-client-react";
import { LayoutGrid, FileText, Users, ShieldCheck, Settings, LogOut, Loader2, ShieldAlert } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data, isLoading } = useGetCurrentUser();
  const { data: settings } = useGetSettings();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const queryClient = useQueryClient();

  const user = data?.user;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
      }
    });
  };

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutGrid },
    { href: "/requests", label: "Requests", icon: FileText },
    { href: "/members", label: "Members", icon: Users },
  ];

  const adminItems = [
    { href: "/staff", label: "Staff accounts", icon: ShieldCheck },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F6F7F9] font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#1B2A41] text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-serif font-semibold text-lg leading-tight tracking-wide text-white">
              Insurance Desk
            </h1>
          </div>
          <p className="text-sm text-[#9AA2AB] font-mono tracking-wider uppercase pl-10">
            {settings?.facilityName || "AfricMed Clinic"}
          </p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  location === item.href
                    ? "bg-[#2A3F5F] text-white font-medium"
                    : "text-[#9AA2AB] hover:bg-[#2A3F5F] hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          ))}

          {user?.role === "admin" && (
            <>
              <div className="mt-8 mb-2 px-3 text-xs font-bold text-[#55606B] uppercase tracking-wider">
                Admin
              </div>
              {adminItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      location === item.href
                        ? "bg-[#2A3F5F] text-white font-medium"
                        : "text-[#9AA2AB] hover:bg-[#2A3F5F] hover:text-white"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-[#2A3F5F]">
          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#9AA2AB]" />
            </div>
          ) : user ? (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{user.username}</span>
                <span className="text-xs text-[#9AA2AB] capitalize">{user.role}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-[#9AA2AB] hover:text-white hover:bg-[#2A3F5F]"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}