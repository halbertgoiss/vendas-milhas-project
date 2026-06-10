import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { flowStore } from "@/lib/flow-store";
import { isValidEmail, hasMalicious } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/acesso")({
  head: () => ({ meta: [{ title: "Acesso — Investir Pontos" }] }),
  component: Page,
});

type Tab = "login" | "register";

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++;
  return s; // 0..3
}

function Field({
  label, type = "text", value, onChange, error, max, icon: Icon, toggle,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  error?: string | null; max?: number; icon?: any; toggle?: boolean;
}) {
  const [show, setShow] = useState(false);
  const inputType = toggle ? (show ? "text" : "password") : type;
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-muted-foreground tracking-wide">{label}</label>
      <div className={cn(
        "flex items-center rounded-xl border-2 bg-card transition-all",
        error ? "border-destructive" : "border-border focus-within:border-navy focus-within:shadow-soft",
      )}>
        {Icon && <Icon className="w-5 h-5 ml-3 text-muted-foreground" />}
        <input
          type={inputType}
          value={value}
          maxLength={max}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent px-3 py-3 outline-none text-base min-w-0"
        />
        {toggle && (
          <button type="button" onClick={() => setShow(!show)} className="p-3 text-muted-foreground">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}

function Page() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailError = submitted && (!isValidEmail(email) || hasMalicious(email)) ? "Email inválido" : null;
  const pwdError = submitted && pwd.length < 8 ? "Mínimo de 8 caracteres" : null;
  const pwd2Error = submitted && tab === "register" && pwd !== pwd2 ? "Senhas não coincidem" : null;
  const s = strength(pwd);

  const submit = () => {
    setSubmitted(true);
    if (!isValidEmail(email) || hasMalicious(email) || pwd.length < 8) return;
    if (tab === "register" && pwd !== pwd2) return;
    flowStore.set({ email });
    navigate({ to: "/dados" });
  };

  return (
    <PageShell step={3} back="/proximos-passos">
      <div className="space-y-5">
        <div className="grid grid-cols-2 p-1 rounded-pill bg-secondary border border-border">
          {(["login", "register"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSubmitted(false); }}
              className={cn(
                "h-11 rounded-pill text-sm font-bold transition-all",
                tab === t ? "bg-gradient-navy text-navy-foreground shadow-soft" : "text-muted-foreground hover:text-navy",
              )}
            >
              {t === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tab === "login" ? "Acesse sua conta" : "Criar sua conta"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {tab === "login" ? "Entre para continuar sua venda" : "Cadastre-se para vender suas milhas"}
          </p>
        </div>

        <Field label="EMAIL" type="email" icon={Mail} max={100} value={email} onChange={setEmail} error={emailError} />
        <Field label="SENHA" toggle icon={Lock} max={30} value={pwd} onChange={setPwd} error={pwdError} />

        {tab === "register" && pwd && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i < s
                      ? s === 1 ? "bg-destructive" : s === 2 ? "bg-orange-400" : "bg-success"
                      : "bg-border",
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Força: {s === 0 ? "muito fraca" : s === 1 ? "fraca" : s === 2 ? "média" : "forte"}
            </p>
          </div>
        )}

        {tab === "register" && (
          <Field label="CONFIRMAR SENHA" toggle icon={Lock} max={30} value={pwd2} onChange={setPwd2} error={pwd2Error} />
        )}

        {tab === "login" && (
          <button
            onClick={() => alert("Em breve")}
            className="text-sm text-navy font-medium hover:underline"
          >
            Esqueci minha senha
          </button>
        )}

        <button
          onClick={submit}
          className="w-full h-14 rounded-pill bg-gradient-navy text-navy-foreground font-bold transition-all hover:shadow-elegant hover:-translate-y-0.5 active:scale-[0.97]"
        >
          {tab === "login" ? "Entrar" : "Criar conta"} ›
        </button>

        {tab === "login" && (
          <>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground">ou</span><div className="flex-1 h-px bg-border" />
            </div>
            <button
              onClick={() => setTab("register")}
              className="w-full h-14 rounded-pill border-2 border-navy text-navy font-semibold hover:bg-navy hover:text-navy-foreground transition-all"
            >
              Criar conta grátis
            </button>
          </>
        )}

        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Dados protegidos com criptografia SSL
        </p>
      </div>
    </PageShell>
  );
}
