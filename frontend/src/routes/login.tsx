import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Livestock Guardian" }, { name: "description", content: "Sign in or create your Livestock Guardian account." }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    nav({ to: "/dashboard" });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-hero text-primary-foreground shadow-elegant">
          <Shield className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl">Welcome to Guardian</h1>
        <p className="mt-1 text-sm text-muted-foreground">Protect your herd in three taps.</p>
      </div>

      <Tabs defaultValue="signin" className="rounded-2xl border bg-card p-6 shadow-soft">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Create account</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <form onSubmit={signIn} className="space-y-4 pt-4">
            <Field label="Email"><Input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} /></Field>
            <Field label="Password"><Input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} /></Field>
            <Button className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={signUp} className="space-y-4 pt-4">
            <Field label="Full name"><Input required value={name} onChange={(e)=>setName(e.target.value)} placeholder="Muhammad Ali" /></Field>
            <Field label="Email"><Input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} /></Field>
            <Field label="Password"><Input type="password" required minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} /></Field>
            <Button className="w-full" disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
