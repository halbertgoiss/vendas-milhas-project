import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plane, Calendar, Clock, TrendingUp, Inbox } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useHistory } from "@/lib/history";
import { formatBRL, formatMiles } from "@/lib/flow-store";

export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [{ title: "Histórico — Investir Pontos" }] }),
  component: Page,
});

function Page() {
  const items = useHistory();
  const navigate = useNavigate();

  return (
    <PageShell step={4} back="/confirmacao">
      <div className="space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-secondary border border-border text-navy text-[10px] font-bold uppercase tracking-wide">
            Suas operações
          </span>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Histórico de vendas</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Acompanhe todas as suas solicitações
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-gradient-card rounded-2xl border border-border shadow-soft p-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-secondary flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">Nenhuma operação ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Suas vendas aparecerão aqui após o envio.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="bg-gradient-card rounded-2xl border border-border shadow-soft p-5 space-y-3 hover:shadow-elegant transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center">
                      <Plane className="w-4 h-4 text-navy" />
                    </span>
                    <div>
                      <div className="font-bold text-navy text-sm">{it.airline}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(it.date).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-pill bg-success/10 text-success text-[10px] font-bold uppercase tracking-wide">
                    Em análise
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                  <Cell label="Quantidade" value={`${formatMiles(it.miles)} milhas`} />
                  <Cell
                    label="Valor"
                    value={<span className="text-success font-bold">{formatBRL(it.total)}</span>}
                    icon={TrendingUp}
                  />
                  <Cell label="Prazo" value={`${it.days} dias`} icon={Clock} />
                  <Cell
                    label="Solicitado em"
                    value={new Date(it.date).toLocaleDateString("pt-BR")}
                    icon={Calendar}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate({ to: "/" })}
          className="w-full h-14 rounded-pill border-2 border-navy/20 text-navy font-semibold transition-all hover:bg-navy hover:text-navy-foreground hover:border-navy active:scale-[0.97]"
        >
          Nova operação ›
        </button>
      </div>
    </PageShell>
  );
}

function Cell({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </div>
      <div className="text-sm font-semibold text-foreground mt-0.5">{value}</div>
    </div>
  );
}
