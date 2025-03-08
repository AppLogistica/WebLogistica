import React, { useEffect, useState } from "react";
import { format as formatFns, addDays, subDays, startOfWeek } from "date-fns";
import { collection, onSnapshot, setDoc, doc, getDoc, getDocs, query, where, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'

import "./styles.css";
import { FornecedorProps, SemanaProps } from "../paginas/main";
import db from "../firebase/database";
import { menssagem } from "../componentes/menssagem";
import { AtualizarCorSemana } from "../supabase/AtualizarCorSemana";
import { DeleteHistoricoSupabase } from "../supabase/DeleteHistoricoSupabase";
import { DeleteSemanaSupabase } from "../supabase/DeleteSemanaSupabase";
import { InsertSemanaSupabase } from "../supabase/InsertSemanaSupabase";

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { firestore } from "firebase-admin";
import moment from 'moment';
import { supabase } from "../supabase/database";
import { AtualizaCaixaSupabase } from "../supabase/syncCaixaSupabase";


export interface TableProps {
  fornec: FornecedorProps[];
}

interface DadosSemana {
  [key: string]: number[];
}

interface salvos {
  id_semana: string;
}

interface semanaProps {
  ativo: string;
  data: string;
  id_caixa: number;
  id_fornecedor: number;
  id_semana: string;
  inserido_em: string;
  status: string;
  cor: string;
  id: string;
  DataTime: Timestamp
}

const Table: React.FC<TableProps> = ({ fornec }) => {

  const [semanaAtualAux, setSemanaAtualAux] = useState(new Date());
  const [datateste, setDatateste] = useState(new Date());
  const [semanaAtual, setSemanaAtual] = useState(new Date( dayjs(datateste, 'DD/MM/YYYY').locale('pt-br').startOf('week').add(1, 'day').toDate()));
  const [dadosSemana, setDadosSemana] = useState<DadosSemana>({});
  const [dadosNovos, setDadosNovos] = useState<DadosSemana>({})
  const [excluir, setExcluir] = useState<DadosSemana>({})
  const [editando, setEditando] = useState(false)
  const semana: string[] = [];
  const [diaFormat, setDiaFormat] = useState(dayjs().locale('pt-br'));
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [pronto, setPronto] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');

  const [NovaSemana, setNovaSemana] = useState<semanaProps[]>([])

  const DiasSemana = Array.from({ length: 5 }, (_, i) =>
    addDays(startOfWeek(semanaAtual), i + 1)
  );

  const SemanaAnterior = () => {
    setSemanaAtual(subDays(semanaAtual, 7));
  };

  const SemanaSeguinte = () => {
    setSemanaAtual(addDays(semanaAtual, 7));
  };

  async function ConfirmaExcluir(auxSemana: string) {

    const docRef = doc(db, "semana", auxSemana);
    const docSnap = await getDoc(docRef);

    if (docSnap.data().ativo !== "Inativos") {
      const resp = window.confirm(`
        Esse proceso encontra-se ${docSnap.data().ativo.toUpperCase()}, deseja realmente excluir? \n
        Excluir esse item irá excluir todos os procesos ligados a ele! \n
        A exclusão só será executada quando for confirmado as alterações através do botão "verde" (confirmar)`);
      if (!resp) {
        window.location.reload();
      }
    }
  }

  const handleCheckboxChange = (
    fornecedorId: number,
    data: string,
    checked: boolean,
    clique: number
  ) => {

    //alert(fornecedorId)
    
    setDadosSemana((prevState) => ({
      ...prevState,
      [data]: checked
        ? [...(prevState[data] || []), fornecedorId,]
        : prevState[data].filter((id) => id !== fornecedorId),
    }));

    if (clique === 1) {

      setDadosNovos((prevState) => ({
        ...prevState,
        [data]: checked
          ? [...(prevState[data] || []), fornecedorId,]
          : prevState[data].filter((id) => id !== fornecedorId),
      }))
    }

    if (clique === 1) {

      let dataDia = data.replaceAll('/', '')

      const id_fornecFormat = fornecedorId.toString().padStart(4, '0');

      const auxSemana = `${dataDia}.${id_fornecFormat}`;

      if (!checked) {

        console.log(ConfirmaExcluir(auxSemana))

      }

      setExcluir((prevState) => ({
        ...prevState,
        [data]: checked
          ? prevState[data].filter((id) => id !== fornecedorId)
          : [...(prevState[data] || []), fornecedorId,]
      }));
    }

  };

  const renderTableHeader = () => {
    return (

    <thead style={{ position: "sticky", top: '50px', backgroundColor: "#242424", color: "white", }}>
      <tr>
        <th>Código</th>
        <th>Fornecedor</th>
        {DiasSemana.map((day) => (
          <th key={dayjs(day).format('DD/MM/YYYY')} >
            <div>
              {dayjs(day).locale('pt-br').format('dddd')}
            </div>
            {dayjs(day).format('DD/MM/YYYY')}
          </th>
        ))}
      </tr>
    </thead>   
    );
  };


  const [semanaSel, setSemanaSel] = useState('');

  function handleContextMenu(event, semanaDay: string) {
    event.preventDefault();
    setShowMenu(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setSemanaSel(semanaDay);
  }

  function hideMenu() {
    setShowMenu(false);
  }

  async function inicial(confirma: boolean) {

    let novaCor = '';

    if (confirma) {
      novaCor = '#7fdec7';
    } else {
      novaCor = 'gray'
    }

    const docRef = doc(db, "semana", semanaSel);
    const docSnap = await getDoc(docRef);


    const corAtual = docSnap.data().cor;

    if (corAtual === 'gray' || corAtual == '#7fdec7') {
      try {
        const docRef = await updateDoc(doc(db, "semana", semanaSel), {
          cor: novaCor
        });

        // Atualiza Supabase
        await AtualizarCorSemana(semanaSel, novaCor);

      } catch (e) {
        console.error("Error adding document: ", e);
        return
      }
    }
  }

  const renderTableBody = () => {
    return (
      <tbody className="topoTabela" >
        {fornec
          .filter((fornecedor) =>
            fornecedor.nome.toLowerCase().includes(filtroFornecedor.toLowerCase())
          )
          .map((fornecedor) => (
            <tr key={fornecedor.id_fornecedor} >
              <td >{fornecedor.id_fornecedor}</td>
              <td>{fornecedor.nome}</td>
              {DiasSemana.map((day) => (
              <td key={formatFns(day, "dd/MM/yyyy")}>
                <div
                  style={{
                    backgroundColor:
                      NovaSemana.find(
                        item => item.id_semana.substring(0, 13) === formatFns(day, "ddMMyyyy") + '.' + `${fornecedor.id_fornecedor}`.padStart(4, '0'))?.cor,
                    borderRadius: '5px'
                  }}
                >

                  <div onContextMenu={() => handleContextMenu(event, formatFns(day, "ddMMyyyy") + '.' + `${fornecedor.id_fornecedor}`.padStart(4, '0'))}>
                    {showMenu && (
                      <div
                        style={{
                          position: 'absolute',
                          left: `${menuPosition.x}px`,
                          top: `${menuPosition.y}px`,
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          padding: '0.5rem',
                        }}
                        onClick={hideMenu}
                      >
                        <ul style={{ cursor: 'pointer' }}>
                          <li style={{ color: 'black' }} onClick={() => inicial(true)}>Confirma</li>
                          <li style={{ color: 'black' }} onClick={() => inicial(false)}>Cancelar</li>
                        </ul>
                      </div>
                    )}
                    <input
                      type="checkbox"
                      checked={
                        (dadosSemana[formatFns(day, "dd/MM/yyyy")] || []).indexOf(
                          fornecedor.id_fornecedor
                        ) > -1
                      }
                      onChange={(event) =>
                        handleCheckboxChange(
                          fornecedor.id_fornecedor,
                          formatFns(day, "dd/MM/yyyy"),
                          event.target.checked,
                          1
                        )
                      }
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                    </div>
                  </div>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  async function addSemana() {
    // Processa as exclusões
    Object.entries(excluir).forEach(([dia, dados]) => {
      if (dados.length > 0) {
        dados.map(async id_fornec => {
          let dataDia = dia.replaceAll('/', '');
          const id_fornecFormat = id_fornec.toString().padStart(4, '0');
          const auxSemana = `${dataDia}.${id_fornecFormat}`;
          const docRef = doc(db, "semana", auxSemana);
          const docSnap = await getDoc(docRef);
          const idcaixa = docSnap.data()?.id_caixa;
          const idsemana = docSnap.data()?.id_semana;
  
          try {
            if (idcaixa) {
              await setDoc(doc(db, "caixa", `${idcaixa}`), {
                Latitude: null,
                Longitude: null,
                id_local: 1,
                id_status: 1,
                livre: true,
                nome: idcaixa
              });

              // Atualiza Supabase
              await AtualizaCaixaSupabase(idcaixa, true, idcaixa)
            }
  
            const q = query(collection(db, "historicoStatus"), where("id_HistóricoSemana", "==", idsemana));
            const querySnapshot = await getDocs(q);
            querySnapshot.docs.forEach(async (documento) => {
              await deleteDoc(doc(db, 'historicoStatus', documento.id));

              // Atualiza Supabase
              await DeleteHistoricoSupabase(documento.id)
            });
  
            await deleteDoc(doc(db, 'semana', auxSemana));

            // Atualizar Supabase
            await DeleteSemanaSupabase(auxSemana);

          } catch (error) {
            //menssagem(`Erro ao salvar! \n ${dataDia}.${id_fornecFormat}`, true);
          }
        });
      }
    });
  
    // Processa as adições
    Object.entries(dadosNovos).forEach(([dia, dados]) => {
      if (dados.length > 0) {
        dados.map(async id_fornec => {
          let dataDia = dia.replaceAll('/', '');
          const id_fornecFormat = id_fornec.toString().padStart(4, '0');
          const auxSemana = `${dataDia}.${id_fornecFormat}`;
          const docRef = doc(db, "semana", auxSemana);
          const docSnap = await getDoc(docRef);
          const dataFormatada = moment(dia, 'DD/MM/YYYY').format('YYYY-MM-DD');
          const dataTemp = new Date(dataFormatada + 'T03:00:00.000Z');
  
          if (!docSnap.exists()) {
            try {
              await setDoc(doc(db, "semana", `${dataDia}.${id_fornecFormat}`), {
                id_semana: `${dataDia}.${id_fornecFormat}`,
                id_fornecedor: id_fornec,
                id_caixa: null,
                data: dia,
                ativo: 'Inativos',
                inserido_em: formatFns(new Date(), "dd/MM/yyyy"),
                status: '',
                cor: 'gray',
                DataTime: dataTemp
              });

              // Atualiza Supabase
              await InsertSemanaSupabase(
                `${dataDia}.${id_fornecFormat}`,
                 null,
                 formatFns(new Date(), "dd/MM/yyyy"),
                 `${dataDia}.${id_fornecFormat}`,
                 'Inativos',
                 '',
                 'gray',
                 dia,
                 id_fornec
              );
            } catch (e) {
              //console.error("Error adding document: ", e);
              //menssagem(`Erro ao salvar! \n ${dataDia}.${id_fornecFormat}`, true);
            }
          }
        });
      }
    });
  
    menssagem('Dados salvos com sucesso!', false);
    setDadosNovos({});
    iniciaNovoExcluir();
  }

  async function carregaSemana() {

    const semanaRef = collection(db, "semana");
    const q = query(semanaRef, where('DataTime', '>=', subDays(semanaAtual, 5)));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

      const { id_fornecedor, data } = doc.data();
      handleCheckboxChange(id_fornecedor, `${data}`, true, 0);

    });
  }

  function NovoCarregasemana() {

    const q = query(collection(db, "semana"), where("DataTime", ">=", subDays(semanaAtual, 5)));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => {

        return {
          id: doc.id,
          ...doc.data()
        }
      }) as SemanaProps[];

      setNovaSemana(data);
    });

    return () => {
      unsub();
    };
  }

  function iniciaNovoExcluir() {

    for (var i = 1; i < 9; i++) {
      let aux = addDays(semanaAtual, i - 1)

      setDadosNovos((prevState) => ({
        ...prevState,
        [formatFns(aux, "dd/MM/yyyy")]: [...(prevState[formatFns(aux, "dd/MM/yyyy")] || [])]
      }));

      setExcluir((prevState) => ({
        ...prevState,
        [formatFns(aux, "dd/MM/yyyy")]: [...(prevState[formatFns(aux, "dd/MM/yyyy")] || [])]
      }));
    }
  }

  useEffect(() => {

    carregaSemana();
    iniciaNovoExcluir();
    NovoCarregasemana();

  }, [semanaAtual]);


  async function AtualizaSupabase() {

    const { data: semanaDel, error } = await supabase
      .from('semana')
      .delete()
      .gte('data_', moment(subDays(new Date('1900-01-01'), 5)).format('YYYY-MM-DD'))

    const semanaRef = query(collection(db, "semana")/*, where("DataTime", ">=", subDays(semanaAtual, 5))*/);
    //  const semanaRef = collection(db, "semana");
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

        }])

      const historicoRef = query(collection(db, "historicoStatus"), where("id_HistóricoSemana", "==", item.data().id_semana));

      //const historicoRef = collection(db, "historicoStatus");
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

          }])
      })

    })
    menssagem('Dados Sincronizados!', false)
  }

  return (
    <>
      <div><Toaster /></div>
      <div className="topTable" >
        <button onClick={SemanaAnterior}  style={{width:200, backgroundColor: '#FFA500', color: 'white',  border: '2px solid #FFFFFF',}}><b>SEMANA ANTERIOR</b></button>

        <button onClick={SemanaSeguinte} style={{width:200, backgroundColor: '#FFA500', color: 'white',  border: '2px solid #FFFFFF',}}><b>PRÓXIMA SEMANA</b></button>
        
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20 }}>
        <h4 style={{ marginRight: 30 }}>Legenda:</h4>
        <div style={{ height: '15px', width: '15px', borderRadius: 50, backgroundColor: 'gray' }}></div>
        <h5 style={{ marginLeft: 5 }}>Não confirmado</h5>
        <div style={{ height: '15px', width: '15px', borderRadius: 50, backgroundColor: '#7fdec7', marginLeft: 20 }}></div>
        <h5 style={{ marginLeft: 5 }}>Confirmado</h5>
        <div style={{ height: '15px', width: '15px', borderRadius: 50, backgroundColor: '#4444fa', marginLeft: 20 }}></div>
        <h5 style={{ marginLeft: 5 }}>Caminhão X VAZIA</h5>
        <div style={{ height: '15px', width: '15px', borderRadius: 50, backgroundColor: '#e8e829', marginLeft: 20 }}></div>
        <h5 style={{ marginLeft: 5 }}>Fornecedor X VAZIA</h5>
        <div style={{ height: '15px', width: '15px', borderRadius: 50, backgroundColor: '#209b20', marginLeft: 20 }}></div>
        <h5 style={{ marginLeft: 5 }}>Fornecedor X CHEIA</h5>
        <div style={{ height: '15px', width: '15px', borderRadius: 50, backgroundColor: '#FF5733', marginLeft: 20 }}></div>
        <h5 style={{ marginLeft: 5 }}>Caminhão X CHEIA</h5>
        <div style={{ height: '15px', width: '15px', borderRadius: 50, backgroundColor: '#b97a56', marginLeft: 20 }}></div>
        <h5 style={{ marginLeft: 5 }}>Fabrica X CHEIA</h5>
        <div style={{ height: '15px', width: '15px', borderRadius: 50, backgroundColor: '#f39c12', marginLeft: 20 }}></div>
        <h5 style={{ marginLeft: 5 }}>Descarregado</h5>
      </div>


      <div style={{position: 'sticky', top:-20 , marginBottom: -75, backgroundColor: '#242424', border: '20px solid #242424',}}>

      <input
          type="text"
          placeholder="PESQUISAR FORNECEDOR..."
          value={filtroFornecedor}
          onChange={(e) => setFiltroFornecedor(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '3px solid #685da4', width: '22%', height: '40px',fontStyle: 'italic', fontWeight: 'bold', }}
        />
      </div>

      
   
      {/* <button style={{ width: 160, position: "sticky", top:3, left: '85%', backgroundColor: '#008080', color: 'white',  border: '2px solid #FFFFFF',}} onClick={AtualizaSupabase}>Sincronizar</button> */}

      
      <button style={{ width:200, position: "sticky", top: 3, left: '100%',  backgroundColor: '#008000', color: 'white',  border: '2px solid #FFFFFF',}}  className="botaoConfirma" onClick={addSemana} > <b> CONFIRMAR</b> </button> 


      <table>
        {renderTableHeader()}
        {renderTableBody()}
      </table>

     

      
    </>
  );
};


export default Table;

