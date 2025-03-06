import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/database";
import { supabase } from "../supabase/database";
import { menssagem } from "../componentes/menssagem";

export async function syncFornecedorSupabase() {
    try {
        // Obtém fornecedores do Firestore
        const fornecedorRef = collection(db, "fornecedor");
        const queryFornecedor = await getDocs(fornecedorRef);
        const fornecedoresFirestore = queryFornecedor.docs.map(doc => ({
            id_fornecedor: doc.id,
            nome: doc.data().nome,
            cidade: doc.data().cidade
        }));

        // Obtém fornecedores do Supabase
        const { data: fornecedoresSupabase, error: errorFetch } = await supabase
            .from('fornecedor')
            .select('id_fornecedor');

        if (errorFetch) throw errorFetch;

        const idsFirestore = fornecedoresFirestore.map(f => f.id_fornecedor);
        const idsSupabase = fornecedoresSupabase.map(f => f.id_fornecedor);

        // Identifica registros a serem removidos do Supabase
        const fornecedoresParaRemover = fornecedoresSupabase.filter(f => !idsFirestore.includes(f.id_fornecedor));
        for (const fornecedor of fornecedoresParaRemover) {
            await supabase.from('fornecedor').delete().eq('id_fornecedor', fornecedor.id_fornecedor);
        }

        // Insere ou atualiza fornecedores no Supabase
        const { error: errorUpsert } = await supabase.from('fornecedor').upsert(fornecedoresFirestore);
        if (errorUpsert) throw errorUpsert;
    } catch (error) {
        // console.error("Erro ao sincronizar fornecedores:", error);
        // menssagem('Erro na sincronização dos fornecedores!', true);
    }
}
