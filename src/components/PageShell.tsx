import { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock, Plane, Sparkles, BarChart3, Zap, CheckCircle2 } from "lucide-react";
import { Stepper } from "./Stepper";

interface Props {
  step: number;
  back?: string | (() => void);
  children: ReactNode;
}

export function PageShell({ step, back, children }: Props) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Desktop side panel */}
      <aside className="hidden lg:flex lg:w-1/2 bg-gradient-hero text-navy-foreground p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-success/10 blur-3xl" />
        <Plane className="absolute -right-10 top-1/3 w-[420px] h-[420px] text-white/[0.04] -rotate-12 pointer-events-none" strokeWidth={1} />

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-bold">
            <span className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <Plane className="w-5 h-5" />
            </span>
            Investir Pontos
          </Link>
          <div className="mt-12 space-y-4 max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> A melhor cotação do mercado
            </span>
            <h2 className="text-4xl font-bold leading-tight">
              Transforme suas milhas em <span className="text-white">dinheiro</span> de verdade.
            </h2>
            <p className="text-lg text-white/70">
              Rápido, seguro e transparente. Receba em até 3 dias úteis.
            </p>
          </div>

          <ul className="mt-10 space-y-4 max-w-md">
            {[
              { Icon: BarChart3, text: "Análise de Mercado em Tempo Real" },
              { Icon: Zap, text: "Cotação Instantânea e Gratuita" },
              { Icon: CheckCircle2, text: "Dados Precisos para sua Decisão" },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </span>
                <span className="text-white/90 font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-white/5 backdrop-blur border border-white/10 text-sm text-white/80">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Mais de 50 milhões de milhas analisadas este mês
          </div>
        </div>
      </aside>

      {/* Main column */}
      <main className="flex-1 flex flex-col w-full lg:max-w-[600px] lg:mx-auto">
        <div className="bg-gradient-navy text-navy-foreground py-4 px-4 lg:hidden flex items-center justify-center shadow-soft">
          <span className="font-bold text-lg flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </span>
            Investir Pontos
          </span>
        </div>
        <Stepper current={step} />
        <div className="flex-1 px-4 py-6 lg:px-10 lg:py-10 animate-fade-in">
          {back && (
            <button
              onClick={() => (typeof back === "string" ? navigate({ to: back }) : back())}
              className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy transition-all hover:-translate-x-0.5"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          )}
          {children}
        </div>
        <footer className="px-4 py-5 lg:px-10 text-center text-xs text-muted-foreground border-t border-border/60">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Conexão segura · SSL 256 bits
          </span>
        </footer>
      </main>
    </div>
  );
}

