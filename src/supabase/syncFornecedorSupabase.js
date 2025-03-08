import { menssagem } from "../componentes/menssagem";
import { supabase } from "../supabase/database";

export async function AtualizaFornecedorSupabase(id, nome, cidade, ativo) {
  try {
    const { error } = await supabase
      .from('fornecedor')
      .upsert([
        {
          'id_fornecedor': id,
          'nome': nome,
          'cidade': cidade,
          'ativo': ativo
        }
      ])
    if (error) {
      throw error;
    }
    console.log("Sincronização concluída com sucesso AtualizaFornecedorSupabase!");
  } catch (error) {
    console.error('Exceção na sincronização de caixas:', error);
    menssagem('Exceção na sincronização de caixas AtualizaFornecedorSupabase', true);
  }
}
