import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Loader2, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHero, Section } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AquaSmart" },
      { name: "description", content: "Get in touch about the AquaSmart AI water management project." },
      { property: "og:title", content: "Contact AquaSmart" },
      { property: "og:description", content: "Send a message to the AquaSmart project team." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(3, "Subject is too short").max(150),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000),
});
type V = z.infer<typeof schema>;

function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: V) => {
    const { error } = await supabase.from("contact_messages").insert(v);
    if (error) return toast.error("Couldn't send message. Please try again.");
    toast.success("Message sent! We'll get back to you soon.");
    reset();
  };

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk water" subtitle="Questions about the project, a demo request or feedback — we'd love to hear from you." />
      <Section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Name" id="name" err={errors.name?.message}><Input id="name" {...register("name")} /></F>
            <F label="Email" id="email" err={errors.email?.message}><Input id="email" type="email" {...register("email")} /></F>
          </div>
          <F label="Subject" id="subject" err={errors.subject?.message}><Input id="subject" {...register("subject")} /></F>
          <F label="Message" id="message" err={errors.message?.message}><Textarea id="message" rows={6} {...register("message")} /></F>
          <Button type="submit" variant="hero" size="xl" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />} Send message
          </Button>
        </form>
        <div className="space-y-4 rounded-3xl bg-gradient-deep p-7 text-deep-foreground shadow-elegant">
          <h2 className="text-xl font-bold">Project information</h2>
          <p className="text-sm opacity-80">AI-Based Water Resource Management and Conservation — Engineering Environmental Studies project.</p>
          <div className="flex gap-3 text-sm"><GraduationCap className="h-5 w-5 text-primary-glow" /> Department of Engineering</div>
          <div className="flex gap-3 text-sm"><Mail className="h-5 w-5 text-primary-glow" /> Messages are stored securely</div>
          <div className="flex gap-3 text-sm"><MapPin className="h-5 w-5 text-primary-glow" /> India</div>
        </div>
      </Section>
    </>
  );
}

function F({ label, id, err, children }: { label: string; id: string; err?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}
