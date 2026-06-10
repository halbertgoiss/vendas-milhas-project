import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MessageCircle, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/proximos-passos")({
  head: () => ({ meta: [{ title: "Próximos passos — Investir Pontos" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  return (
    <PageShell step={2} back="/cotacao">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-success/10 border border-success/20 text-success text-xs font-bold uppercase tracking-wide">
            ✓ Cotação aprovada
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Próximos passos</h1>
          <p className="text-muted-foreground">
            Escolha como deseja prosseguir com sua venda
          </p>
        </div>

        <div className="relative bg-gradient-card rounded-2xl p-6 shadow-soft border border-border overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-success/10 blur-3xl" />
          <div className="relative space-y-4">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow animate-pulse-ring">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg">Atendimento via WhatsApp</h2>
                  <span className="px-2 py-0.5 rounded-pill bg-success/15 text-success text-[10px] font-bold uppercase">Recomendado</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Tire dúvidas e receba suporte personalizado
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> Online agora · 8h às 23h
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noreferrer"
              className="block w-full h-14 rounded-pill bg-gradient-accent text-white font-bold leading-[3.5rem] text-center hover:shadow-glow hover:-translate-y-0.5 transition-all active:scale-[0.97]"
            >
              💬 Falar com Atendente
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">ou siga sozinho</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={() => navigate({ to: "/acesso" })}
          className="group w-full p-5 rounded-2xl border-2 border-navy/15 bg-card text-navy font-semibold transition-all hover:border-navy hover:shadow-soft hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-4 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold">Seguir para Cadastro</div>
            <div className="text-xs text-muted-foreground font-normal">Cadastre-se e envie suas milhas</div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </PageShell>
  );
}
