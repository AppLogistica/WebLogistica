import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/database";
import { menssagem } from "../componentes/menssagem";
import { supabase } from "../supabase/database";

// Função para sincronizar a tabela 'local' do Firebase com a tabela 'local' do Supabase
export async function syncLocalSupabase() {
  try {
    // Obter dados da coleção 'local' no Firebase
    const localRef = collection(db, "local");
    const queryLocal = await getDocs(localRef);
    const locaisFirestore = queryLocal.docs.map(doc => ({
      id: doc.id,
      nome: doc.data().nome
    }));

    // Obter dados da tabela 'local' no Supabase
    const { data: locaisSupabase, error: errorSupabase } = await supabase
      .from('local')
      .select('*');
    if (errorSupabase) {
      console.error('Erro ao obter locais do Supabase:', errorSupabase);
      menssagem('Erro ao obter locais do Supabase', true);
      return;
    }

    // Verificar e excluir locais no Supabase que não existem no Firebase
    const idsFirestore = locaisFirestore.map(item => item.id);
    if (locaisSupabase && locaisSupabase.length > 0) {
      for (const registro of locaisSupabase) {
        if (!idsFirestore.includes(registro.id_local)) {
          const { error: deleteError } = await supabase
            .from('local')
            .delete()
            .eq('id_local', registro.id_local);
          if (deleteError) {
            console.error('Erro ao deletar local no Supabase:', deleteError);
            menssagem('Erro ao deletar local no Supabase', true);
          }
        }
      }
    }

    // Upsert dos locais do Firebase para o Supabase
    const promises = locaisFirestore.map(async (item) => {
      const { error } = await supabase
        .from('local')
        .upsert([{
          id_local: item.id,
          nome: item.nome,
        }]);
      if (error) {
        console.error('Erro ao atualizar/inserir local:', error);
        menssagem('Erro ao atualizar/inserir local no Supabase', true);
      }
    });

    await Promise.all(promises);
    // menssagem('Dados de locais sincronizados com sucesso no Supabase!', false);
  } catch (err) {
    // console.error('Erro na sincronização de locais:', err);
    // menssagem('Erro na sincronização de locais', true);
  }
}