import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/database";
import { menssagem } from "../componentes/menssagem";
import { supabase } from "../supabase/database";

export async function AtualizaCaixaSupabase() {
  try {
    const caixaRef = collection(db, "caixa");
    const queryCaixa = await getDocs(caixaRef);
    const caixasFirestore = queryCaixa.docs.map(doc => ({
      id: doc.id, 
      data: doc.data()
    }));

    const { data: caixasSupabase, error: errorSupabase } = await supabase
      .from('caixa')
      .select('*');
    if (errorSupabase) {
      // console.error('Erro ao obter caixas do Supabase:', errorSupabase);
      // menssagem('Erro ao obter caixas do Supabase', true);
      return;
    }

    const idsFirestore = caixasFirestore.map(item => item.id);
    if (caixasSupabase && caixasSupabase.length > 0) {
      for (const registro of caixasSupabase) {
        // Supondo que o campo id_caixa no Supabase seja armazenado como string
        if (!idsFirestore.includes(String(registro.id_caixa))) {
          const { error: deleteError } = await supabase
            .from('caixa')
            .delete()
            .eq('id_caixa', registro.id_caixa);
          if (deleteError) {
            // console.error('Erro ao deletar caixa no Supabase:', deleteError);
            // menssagem('Erro ao deletar caixa no Supabase', true);
          }
        }
      }
    }

    const promises = caixasFirestore.map(async (item) => {
      const dataCaixa = item.data;
      const { error } = await supabase
        .from('caixa')
        .upsert([{
          id_caixa: item.id,
          nome: `${item.id}`,
          livre: dataCaixa.livre,
          id_status: dataCaixa.id_status,
          id_local: dataCaixa.id_local,
          Latitude: dataCaixa.Latitude,
          Longitude: dataCaixa.Longitude,
          etapa: dataCaixa.etapa,
        }]);
      if (error) {
        // console.error('Erro ao atualizar/inserir caixa:', error);
        // menssagem('Erro ao atualizar/inserir caixa no Supabase', true);
      }
    });

    await Promise.all(promises);
  } catch (err) {
    // console.error('Exceção na sincronização de caixas:', err);
    // menssagem('Exceção na sincronização de caixas', true);
  }
}