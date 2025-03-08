import { menssagem } from "../componentes/menssagem";
import { supabase } from "../supabase/database";

export async function AtualizaLocalSupabase(id, nome) {
  try {
    const { error } = await supabase
      .from('local')
      .upsert([
        {
          'id_local': id,
          'nome': nome
        }
      ])
    
    if (error) {
      throw error;
    }
    console.log("Sincronização concluída com sucesso!");
  } catch (error) {
    console.error('Exceção na sincronização de caixas:', error);
    menssagem('Exceção na sincronização de caixas AtualizaCaixaSupabase', true);
  }
}
