import { supabase } from './database';

export async function AtualizarCorSemana(id, cor) {
    try {
        const { error } = await supabase
            .from('semana')
            .update({   
                cor: cor,
            })
            .eq('id', id);

        if (error) {
            throw error;
        }

        console.log("Atualização no Supabase concluída com sucesso AtualizarCorSemana.");
    } catch (error) {
        console.error("Erro ao atualizar Supabase AtualizarCorSemana:", error);
    }
}
