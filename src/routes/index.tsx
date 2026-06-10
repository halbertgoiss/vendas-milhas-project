import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plane, Check } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { flowStore, useFlow, formatMiles, parseMiles, type Airline } from "@/lib/flow-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Investir Pontos — Venda suas milhas com segurança" },
      { name: "description", content: "Plataforma para venda de milhas LATAM Pass e Smiles com cotação instantânea." },
    ],
  }),
  component: Page,
});

function Page() {
  const flow = useFlow();
  const navigate = useNavigate();
  const [milesInput, setMilesInput] = useState(flow.miles ? formatMiles(flow.miles) : "");
  const [touched, setTouched] = useState(false);

  const milesNum = parseMiles(milesInput);
  const milesError =
    touched && milesNum > 0
      ? milesNum < 30000
        ? "Mínimo de 30.000 milhas"
        : milesNum > 100000000
          ? "Máximo de 100.000.000 milhas"
          : null
      : null;

  const valid = !!flow.airline && milesNum >= 30000 && milesNum <= 100000000;

  const select = (a: Airline) => flowStore.set({ airline: a });

  const submit = () => {
    if (!valid) return;
    flowStore.set({ miles: milesNum });
    navigate({ to: "/cotacao" });
  };

  return (
    <PageShell step={1}>
      <div className="space-y-7">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-gradient-to-r from-success/15 to-navy/10 border border-success/20 text-navy text-xs font-bold">
            🏆 Cotação atualizada agora mesmo
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Venda suas milhas <span className="text-shimmer">com segurança</span>
          </h1>
          <p className="text-muted-foreground text-base">
            Receba o melhor preço do mercado em minutos
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
            Programa de milhas
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["LATAM Pass", "Smiles"] as Airline[]).map((a) => {
              const active = flow.airline === a;
              return (
                <button
                  key={a}
                  onClick={() => select(a)}
                  className={cn(
                    "group relative p-5 rounded-2xl border-2 transition-all text-left overflow-hidden hover:-translate-y-0.5 active:scale-[0.98]",
                    active
                      ? "bg-gradient-navy border-transparent text-navy-foreground shadow-elegant"
                      : "bg-gradient-card border-border text-navy hover:border-navy/40 hover:shadow-soft",
                  )}
                >
                  {active && (
                    <>
                      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white text-navy flex items-center justify-center shadow-soft">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    </>
                  )}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
                    active ? "bg-white/15" : "bg-secondary group-hover:bg-navy/5",
                  )}>
                    <Plane className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-base">{a}</div>
                  <div className={cn("text-xs mt-0.5", active ? "text-white/70" : "text-muted-foreground")}>
                    Programa {a === "LATAM Pass" ? "LATAM" : "GOL"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
            Quantidade de milhas
          </label>
          <div className={cn(
            "relative flex items-center rounded-xl border-2 bg-card transition-all",
            milesError ? "border-destructive" : "border-border focus-within:border-navy focus-within:shadow-soft",
          )}>
            <span className="ml-3 w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <Plane className="w-4 h-4 text-navy" />
            </span>
            <input
              inputMode="numeric"
              value={milesInput}
              onChange={(e) => setMilesInput(formatMiles(parseMiles(e.target.value)))}
              onBlur={() => setTouched(true)}
              placeholder="Mínimo: 30.000"
              className="flex-1 bg-transparent px-3 py-3.5 outline-none text-base font-medium tabular-nums"
            />
          </div>
          {milesError && <p className="text-destructive text-xs font-medium">{milesError}</p>}
          <p className="text-xs text-muted-foreground">Digite a quantidade que deseja vender</p>
        </div>

        <button
          onClick={submit}
          disabled={!valid}
          className="w-full h-14 rounded-pill bg-gradient-navy text-navy-foreground font-bold text-base transition-all hover:shadow-elegant hover:-translate-y-0.5 active:scale-[0.97] disabled:bg-muted disabled:bg-none disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
        >
          Ver cotação ›
        </button>

      </div>
    </PageShell>
  );
}
