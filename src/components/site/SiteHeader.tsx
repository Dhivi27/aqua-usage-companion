import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Droplets, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const main = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/solutions", label: "Solutions" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/contact", label: "Contact" },
] as const;

export const toolLinks = [
  { to: "/monitoring", label: "Water Monitoring" },
  { to: "/leakage", label: "Leakage Detection" },
  { to: "/prediction", label: "AI Prediction" },
  { to: "/tips", label: "Conservation Tips" },
  { to: "/reports", label: "Reports" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
        <Droplets className="h-5 w-5" />
      </span>
      <span className="font-display text-xl font-bold">
        Aqua<span className="text-gradient">Smart</span>
      </span>
    </Link>
  );
}

const linkCls =
  "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary";
const activeCls = "text-primary bg-secondary";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {main.map((l) => (
            <Link key={l.to} to={l.to} className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: l.to === "/" }}>
              {l.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className={`${linkCls} inline-flex items-center gap-1`}>
              Tools <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {toolLinks.map((l) => (
                <DropdownMenuItem key={l.to} asChild>
                  <Link to={l.to}>{l.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Button variant="glass" size="sm" onClick={handleSignOut}>
              <LogOut /> Sign out
            </Button>
          ) : (
            <Button variant="hero" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 overflow-y-auto">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-6 flex flex-col gap-1">
              {[...main, ...toolLinks].map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: l.to === "/" }}>
                  {l.label}
                </Link>
              ))}
              <div className="mt-4">
                {user ? (
                  <Button variant="glass" className="w-full" onClick={() => { setOpen(false); handleSignOut(); }}>
                    <LogOut /> Sign out
                  </Button>
                ) : (
                  <Button variant="hero" className="w-full" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
