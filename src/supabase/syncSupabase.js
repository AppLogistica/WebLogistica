import { collection, getDocs, query, where } from "firebase/firestore";
import moment from 'moment';
import { subDays } from 'date-fns';
import db from "../firebase/database";
import { menssagem } from "../componentes/menssagem";
import { supabase } from "../supabase/database";

export async function AtualizaSupabase() {

    const { data: semanaDel, error } = await supabase
      .from('semana')
      .delete()
      .gte('data_', moment(subDays(new Date('1900-01-01'), 5)).format('YYYY-MM-DD'));

    const semanaRef = query(collection(db, "semana"));
    const querysemana = await getDocs(semanaRef);

    querysemana.docs.map(async (item) => {

      const { data: Datasemana, error } = await supabase
        .from('semana')
        .upsert([{
          id_semana: item.data().id_semana,
          id_caixa: item.data().id_caixa,
          inserido_em: moment(item.data().inserido_em, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          id: item.id,
          ativo: item.data().ativo,
          status: item.data().status,
          cor: item.data().cor,
          data_: moment(item.data().data, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          id_fornecedor: item.data().id_fornecedor
        }]);

      const historicoRef = query(collection(db, "historicoStatus"), where("id_HistóricoSemana", "==", item.data().id_semana));
      const queryHistorico = await getDocs(historicoRef);

      queryHistorico.docs.map(async (item) => {
        const { data: DataHistorico, error } = await supabase
          .from('historicoStatus')
          .upsert([{
            id: item.id,
            id_HistóricoSemana: item.data().id_HistóricoSemana,
            id_caixa: item.data().id_caixa,
            status: item.data().status,
            local: item.data().local,
            data: moment(item.data().data, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            hora: item.data().hora
          }]);
      });
    });

    const caixaRef = collection(db, "caixa");
    const querycaixa = await getDocs(caixaRef);

    querycaixa.docs.map(async (item) => {
      const { data: DataCaixa, error } = await supabase
        .from('caixa')
        .upsert([{
          id_caixa: item.id,
          nome: `${item.id}`,
          livre: item.data().livre,
          id_status: item.data().id_status,
          id_local: item.data().id_local,
          Latitude: item.data().Latitude,
          Longitude: item.data().Longitude,
          etapa: item.data().etapa
        }]);
    });

    const fornecedorRef = collection(db, "fornecedor");
    const queryfornecedor = await getDocs(fornecedorRef);

    queryfornecedor.docs.map(async (item) => {
      const { data: Datafornecedor, error } = await supabase
        .from('fornecedor')
        .upsert([{
          id_fornecedor: item.id,
          nome: item.data().nome,
          cidade: item.data().cidade
        }]);
    });

    const etapaRef = collection(db, "ordemProceso");
    const etapafornecedor = await getDocs(etapaRef);

    etapafornecedor.docs.map(async (item) => {
      const { data: Datafornecedor, error } = await supabase
        .from('oredemProcesso')
        .upsert([{
          id: item.id,
          id_local: item.data().id_local,
          id_status: item.data().id_status,
          nomeLocal: item.data().nomeLocal,
          nomeStatus: item.data().nomeStatus
        }]);
    });
}