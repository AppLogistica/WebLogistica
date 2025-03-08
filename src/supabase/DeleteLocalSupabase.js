import { menssagem } from "../componentes/menssagem";
import { supabase } from "../supabase/database";

export async function DeleteLocalSupabase(id) {
  try {
    const {error} = await supabase
      .from('local')
      .delete()
      .eq('id_local', id)
    if (error) {
      throw error;
    }
    console.log("Atualização no Supabase concluída com sucesso.")
  } catch (error) {
    console.error('Exceção na sincronização de caixas:', error);
    menssagem('Exceção na sincronização de caixas DeleteLocalSupabase', true);
  }
}