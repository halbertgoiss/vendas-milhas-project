import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageShell } from "@/components/PageShell";
import { flowStore, useFlow, calcTotal, formatBRL, formatMiles } from "@/lib/flow-store";

export const Route = createFileRoute("/confirmacao")({
  head: () => ({ meta: [{ title: "Confirmação — Investir Pontos" }] }),
  component: Page,
});

function Page() {
  const flow = useFlow();
  const navigate = useNavigate();

  useEffect(() => {
    if (!flow.airline || !flow.miles) navigate({ to: "/" });
  }, []);

  if (!flow.airline || !flow.miles) return null;
  const total = calcTotal(flow.airline, flow.miles, flow.days);
  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <PageShell step={4}>
      <div className="space-y-7 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-success/10 blur-2xl" />
          </div>
          <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-accent flex items-center justify-center animate-scale-in shadow-glow">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline className="draw-check" points="4 12 10 18 20 6" />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-success/10 text-success text-xs font-bold uppercase tracking-wide">
            ✓ Sucesso
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Operação recebida!</h1>
          <p className="text-muted-foreground">
            Seus dados estão sendo analisados e logo entraremos em contato.
          </p>
        </div>

        <div className="bg-gradient-card rounded-2xl border border-border shadow-soft p-6 text-left space-y-4">
          <h2 className="font-bold flex items-center gap-2 text-navy">
            <span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">📄</span>
            Detalhes da Venda
          </h2>
          <div className="space-y-2.5">
            <Row label="Companhia" value={flow.airline} />
            <Row label="Quantidade negociada" value={`${formatMiles(flow.miles)} milhas`} />
            <Row label="Valor de venda" value={<span className="text-success font-bold text-base">{formatBRL(total)}</span>} />
            <Row label="Prazo de pagamento" value={`${flow.days} dias`} />
            <Row label="Data da solicitação" value={today} />
          </div>
        </div>

        <a
          href="https://wa.me/5544984041673"
          target="_blank"
          rel="noreferrer"
          className="block w-full h-14 leading-[3.5rem] rounded-pill bg-gradient-accent text-white font-bold hover:shadow-glow hover:-translate-y-0.5 transition-all active:scale-[0.97]"
        >
          💬 Falar com Atendente via WhatsApp
        </a>
        <p className="text-xs text-muted-foreground -mt-3">
          Disponível de segunda a sexta, das 8h às 18h
        </p>

        <button
          onClick={() => navigate({ to: "/historico" })}
          className="w-full h-14 rounded-pill bg-gradient-navy text-navy-foreground font-bold transition-all hover:shadow-elegant hover:-translate-y-0.5 active:scale-[0.97]"
        >
          Ver histórico de vendas ›
        </button>
        <button
          onClick={() => { flowStore.reset(); navigate({ to: "/" }); }}
          className="w-full h-14 rounded-pill border-2 border-navy/20 text-navy font-semibold transition-all hover:bg-navy hover:text-navy-foreground hover:border-navy active:scale-[0.97]"
        >
          Voltar ao Início ›
        </button>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-border/60 last:border-0 pb-2.5 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
