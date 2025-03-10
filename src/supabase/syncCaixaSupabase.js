import { menssagem } from "../componentes/menssagem";
import { supabase } from "../supabase/database";

export async function AtualizaCaixaSupabase(id, livre, nome) {
  try {
    const { error } = await supabase
      .from('caixa')
      .upsert([
        {
          'id_caixa': id,
          'livre': livre,
          'nome': nome,
          'Latitude': null,
          'Longitude': null,
          'id_local': 1,
          'id_status': 1,
        }
      ])
    
    if (error) {
      throw error;
    }
    console.log("Sincronização concluída com sucesso!");
  } catch (error) {
    console.error('Exceção na sincronização de caixas:', error);
    // menssagem('Exceção na sincronização de caixas AtualizaCaixaSupabase', true);
  }
}
