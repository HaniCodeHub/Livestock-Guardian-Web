import { Link, useNavigate } from "@tanstack/react-router";
import { Shield, LayoutDashboard, ScanLine, PlusCircle, LogOut, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function AppHeader() {
  const { user } = useAuth();
  const nav = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    nav({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-hero text-primary-foreground shadow-elegant">
            <Shield className="h-5 w-5" />
          </span>
          Livestock <span className="text-primary">Guardian</span>
        </Link>
        {user ? (
          <nav className="flex items-center gap-1">
            <Link to="/dashboard"><Button variant="ghost" size="sm"><LayoutDashboard className="mr-1 h-4 w-4" />Herd</Button></Link>
            <Link to="/tools"><Button variant="ghost" size="sm"><Sparkles className="mr-1 h-4 w-4" />Tools</Button></Link>
            <Link to="/scan"><Button variant="ghost" size="sm"><ScanLine className="mr-1 h-4 w-4" />Scan</Button></Link>
            <Link to="/register"><Button size="sm" className="ml-1"><PlusCircle className="mr-1 h-4 w-4" />Register</Button></Link>
            <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out"><LogOut className="h-4 w-4" /></Button>
          </nav>
        ) : (
          <div className="flex gap-2">
            <Link to="/tools"><Button variant="ghost" size="sm"><Sparkles className="mr-1 h-4 w-4" />Tools</Button></Link>
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/login"><Button size="sm">Get started</Button></Link>
          </div>
        )}
      </div>
    </header>
  );
}
