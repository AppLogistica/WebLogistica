import { menssagem } from "../componentes/menssagem";
import { supabase } from "../supabase/database";

export async function DeleteHistoricoSupabase(id) {
  try {
    const {error} = await supabase
      .from('historicoStatus')
      .delete()
      .eq('id', id)
    if (error) {
      throw error;
    }
    console.log("Atualização no Supabase concluída com sucesso.")
  } catch (error) {
    console.error('Exceção na sincronização de caixas:', error);
    menssagem('Exceção na sincronização de caixas DeleteHistoricoSupabase', true);
  }
}