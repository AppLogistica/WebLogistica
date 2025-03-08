import { supabase } from "./database";

export async function InsertSemanaSupabase(id, id_caixa, inserido_em, id_semana, ativo, status, cor, data_, id_fornecedor) {
    try {
        const { error } = await supabase
            .from('semana')
            .insert([
                {
                    id,
                    id_caixa,
                    inserido_em,
                    id_semana,
                    ativo,
                    status,
                    cor,
                    data_,
                    id_fornecedor
                }
            ]);

        if (error) {
            throw error;
        }

        console.log("Inserção no Supabase concluída com sucesso.");
        
    } catch (error) {
        console.error("Erro ao inserir no Supabase (InsertSemanaSupabase):", error);
    }
}
