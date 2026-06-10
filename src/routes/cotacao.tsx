import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Zap, Calendar, Clock, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { flowStore, useFlow, calcTotal, formatBRL, formatMiles, type Days } from "@/lib/flow-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cotacao")({
  head: () => ({ meta: [{ title: "Cotação — Investir Pontos" }] }),
  component: Page,
});

const opts: { d: Days; name: string; icon: any; badge: string; badgeColor: string }[] = [
  { d: 3, name: "3 dias", icon: Zap, badge: "Mais rápido", badgeColor: "bg-orange-100 text-orange-700" },
  { d: 7, name: "7 dias", icon: Calendar, badge: "Recomendado", badgeColor: "bg-blue-100 text-blue-700" },
  { d: 30, name: "30 dias", icon: Clock, badge: "Melhor preço", badgeColor: "bg-green-100 text-green-700" },
];

function useAnimatedNumber(value: number, duration = 400) {
  const [n, setN] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(from + (value - from) * p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return n;
}

function Page() {
  const flow = useFlow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!flow.airline || !flow.miles) navigate({ to: "/" });
  }, [flow.airline, flow.miles, navigate]);

  const total = flow.airline && flow.miles ? calcTotal(flow.airline, flow.miles, flow.days) : 0;
  const animated = useAnimatedNumber(total);
  if (!flow.airline || !flow.miles) return null;
  const rate = total / (flow.miles / 1000);

  return (
    <PageShell step={2} back="/">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded-pill bg-secondary text-xs font-semibold text-navy border border-navy/10">
            ✈️ {flow.airline}
          </span>
          <span className="px-3 py-1.5 rounded-pill bg-secondary text-xs font-semibold text-navy border border-navy/10">
            {formatMiles(flow.miles)} milhas
          </span>
        </div>

        <div className="relative bg-gradient-hero text-navy-foreground rounded-2xl p-7 shadow-elegant overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-success/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-white/80 text-sm font-medium">
              <TrendingUp className="w-4 h-4" /> Valor estimado da venda
            </div>
            <div className="mt-3 text-5xl font-bold tabular-nums tracking-tight">
              {formatBRL(animated)}
            </div>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-white/10 backdrop-blur border border-white/20 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              {formatBRL(rate)} por 1.000 milhas
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-3">
            Prazo de pagamento
          </h2>
          <div className="space-y-2.5">
            {opts.map(({ d, name, icon: Icon, badge, badgeColor }) => {
              const active = flow.days === d;
              const t = calcTotal(flow.airline!, flow.miles!, d);
              const r = t / (flow.miles! / 1000);
              return (
                <button
                  key={d}
                  onClick={() => flowStore.set({ days: d })}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-all duration-200 text-left",
                    active
                      ? "bg-gradient-navy border-transparent text-navy-foreground shadow-elegant scale-[1.02]"
                      : "bg-gradient-card border-border text-navy hover:border-navy/40 hover:shadow-soft hover:-translate-y-0.5",
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    active ? "border-white bg-white" : "border-muted-foreground/40",
                  )}>
                    {active && <div className="w-2 h-2 rounded-full bg-navy" />}
                  </div>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    active ? "bg-white/15" : "bg-secondary",
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{name}</span>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-pill font-bold uppercase tracking-wide", active ? "bg-white/20 text-white" : badgeColor)}>
                        {badge}
                      </span>
                    </div>
                    <div className={cn("text-xs mt-1 tabular-nums", active ? "text-white/80" : "text-muted-foreground")}>
                      {formatBRL(r)}/mil · Total <span className="font-semibold">{formatBRL(t)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => navigate({ to: "/proximos-passos" })}
          className="w-full h-14 rounded-pill bg-gradient-navy text-navy-foreground font-bold transition-all hover:shadow-elegant hover:-translate-y-0.5 active:scale-[0.97]"
        >
          Quero vender minhas milhas ›
        </button>
        <p className="text-xs text-muted-foreground text-center">
          * Valores sujeitos a confirmação após análise
        </p>
      </div>
    </PageShell>
  );
}
