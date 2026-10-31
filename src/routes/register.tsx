import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — AquaSmart" },
      { name: "description", content: "Create a free AquaSmart account to track and conserve water." },
      { property: "og:title", content: "Create your AquaSmart account" },
      { property: "og:description", content: "Start monitoring and saving water today." },
    ],
  }),
  component: Register,
});

const schema = z
  .object({
    full_name: z.string().trim().min(2, "Enter your name").max(100),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters").regex(/\d/, "Include at least one number"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });
type V = z.infer<typeof schema>;

function Register() {
  const navigate = useNavigate();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: V) => {
    const { data, error } = await supabase.auth.signUp({
      email: v.email,
      password: v.password,
      options: { emailRedirectTo: `${window.location.origin}/monitoring`, data: { full_name: v.full_name } },
    });
    if (error) { toast.error(error.message); return; }
    if (data.session) {
      toast.success("Account created!");
      navigate({ to: "/monitoring" });
    } else setSentTo(v.email);
  };

  if (sentTo)
    return (
      <AuthShell title="Check your inbox" subtitle="One more step to activate your account.">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary p-6 text-center">
          <MailCheck className="h-10 w-10 text-primary" />
          <p>We sent a confirmation link to <strong>{sentTo}</strong>. Click it, then sign in.</p>
          <Button variant="hero" asChild><Link to="/login">Go to login</Link></Button>
        </div>
      </AuthShell>
    );

  const field = (id: keyof V, label: string, type = "text", ac?: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} autoComplete={ac} {...register(id)} />
      {errors[id] && <p className="text-xs text-destructive">{errors[id]?.message}</p>}
    </div>
  );

  return (
    <AuthShell title="Create account" subtitle="Join AquaSmart and start saving water.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {field("full_name", "Full name", "text", "name")}
        {field("email", "Email", "email", "email")}
        {field("password", "Password", "password", "new-password")}
        {field("confirm", "Confirm password", "password", "new-password")}
        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />} Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link>
      </p>
    </AuthShell>
  );
}
