import React, { useEffect, useState } from "react";
import { format as formatFns, addDays, subDays } from "date-fns";
import { collection, onSnapshot, setDoc, doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'

import "./styles.css";
import { FornecedorProps, SemanaProps } from "../paginas/main";
import db from "../firebase/database";
import { menssagem } from "../componentes/menssagem";

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

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
id_semana: string;
pronto: boolean;
status: string;
}

const Table: React.FC<TableProps> = ({ fornec }) => {
  const [semanaAtual, setSemanaAtual] = useState(new Date());
  const [semanaAtualAux, setSemanaAtualAux] = useState(new Date())
  const [dadosSemana, setDadosSemana] = useState<DadosSemana>({});
  const [dadosNovos, setDadosNovos] = useState<DadosSemana>({})
  const [excluir, setExcluir] = useState<DadosSemana>({})
  const [editando, setEditando] = useState(false)
  const semana: string[] = [];
  const [diaFormat, setDiaFormat] = useState(dayjs().locale('pt-br'));
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [pronto, setPronto] = useState([]);
  

  // const navigate = useNavigate();

  const DiasSemana = Array.from({ length: 8 }, (_, i) =>
    addDays(semanaAtual, i)
  );

  const SemanaAnterior = () => {
    setSemanaAtual(subDays(semanaAtual, 8));

  };

  const SemanaSeguinte = () => {
    setSemanaAtual(addDays(semanaAtual, 8));

    console.log(semana.length);
  };

  async function ConfirmaExcluir(auxSemana: string) {

    const docRef = doc(db, "semana", auxSemana);
    const docSnap = await getDoc(docRef);

    if (docSnap.data().ativo !== "Inativos") {
      const resp = window.confirm(`Esse proceso encontra-se ${docSnap.data().ativo.toUpperCase()}, deseja realmente excluir? \n
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
      <thead>
        <tr>
          <th>Código</th>
          <th>Fornecedor</th>
          {DiasSemana.map((day) => (
            <th key={formatFns(day, "dd/MM/yyyy")}>

              <div>
                {dayjs(day).locale('pt-br').format('dddd')}
              </div>
              {formatFns(day, "dd/MM/yyyy")}

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
    //   alert(semanaSel + '  ' + confirma)
  }

  function statusInicial(semanaStatus: string) {

    (async () => {
      const docRef = doc(db, "semana", semanaStatus);
      const docSnap = await getDoc(docRef);

      const idcaixa = docSnap.data().id_caixa;
      const idsemana = docSnap.data().id_semana;
    })

    const a = 'red'
    return a;
  }

  const renderTableBody = () => {
    return (
      <tbody className="topoTabela">
        {fornec.map((fornecedor) => (
          <tr key={fornecedor.id_fornecedor}>
            <td>{fornecedor.id_fornecedor}</td>
            <td>{fornecedor.nome}</td>
            {DiasSemana.map((day) => (
              <td key={formatFns(day, "dd/MM/yyyy")}>
                <div onContextMenu={() => handleContextMenu(event, formatFns(day, "ddMMyyyy") + '.' + `${fornecedor.id_fornecedor}`.padStart(4, ''))}>
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
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  /*                  <div style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: statusInicial(formatFns(day, "ddMMyyyy") + '.' + `${fornecedor.id_fornecedor}`.padStart(4, '')),
                    borderRadius: '50px'
                  }}></div>*/

  async function addSemana() {

    Object.entries(excluir).forEach(([dia, dados]) => {

      if (dados.length > 0) {
        dados.map(async id_fornec => {

          let dataDia = dia.replaceAll('/', '')

          const id_fornecFormat = id_fornec.toString().padStart(4, '0');

          const auxSemana = `${dataDia}.${id_fornecFormat}`;

          const docRef = doc(db, "semana", auxSemana);
          const docSnap = await getDoc(docRef);

          const idcaixa = docSnap.data().id_caixa;
          const idsemana = docSnap.data().id_semana;

          try {

            if (idcaixa) {

              try {
                const docRef = await setDoc(doc(db, "caixa", `${idcaixa}`), {
                  Latitude: null,
                  Longitude: null,
                  id_local: 1,
                  id_status: 1,
                  livre: true,
                  nome: idcaixa

                });
                console.log("Document written with ID: ", docRef);


              } catch (e) {
                console.error("Error adding document: ", e);
                return
              }
            }

            const q = query(collection(db, "historicoStatus"), where("id_HistóricoSemana", "==", idsemana));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (documento) => {
              // doc.data() is never undefined for query doc snapshots
              // alert(documento.id);
              await deleteDoc(doc(db, 'historicoStatus', documento.id));
            });

            await deleteDoc(doc(db, 'semana', auxSemana));

          } catch (error) {
            menssagem(`Erro ao salvar! \n ${dataDia}.${id_fornecFormat}`, true)
          }
        })
      }
    })

    setExcluir({});

    Object.entries(dadosNovos).forEach(([dia, dados]) => {
      if (dados.length > 0) {
        dados.map(async id_fornec => {


          let dataDia = dia.replaceAll('/', '')

          const id_fornecFormat = id_fornec.toString().padStart(4, '0');
          const auxSemana = `${dataDia}.${id_fornecFormat}`;

          const docRef = doc(db, "semana", auxSemana);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {

            try {
              const docRef = await setDoc(doc(db, "semana", `${dataDia}.${id_fornecFormat}`), {
                id_semana: `${dataDia}.${id_fornecFormat}`,
                id_fornecedor: id_fornec,
                id_caixa: null,
                data: dia,
                ativo: 'Inativos',
                inserido_em: formatFns(semanaAtual, "dd/MM/yyyy"),
                status: ''
              });
              console.log("Document written with ID: ", docRef);
              //   menssagem('Dados salvos com sucesso!', false);

            } catch (e) {
              console.error("Error adding document: ", e);
              menssagem(`Erro ao salvar! \n ${dataDia}.${id_fornecFormat}`, true)
              return
            }
          }

        })
      }
    });
    menssagem('Dados salvos com sucesso!', false)
    setDadosNovos({});
    iniciaNovoExcluir();
  }

  async function carregaSemana() {


    const semanaRef = collection(db, "semana");
    const q = query(semanaRef, where('data', '>=', formatFns(semanaAtual, "dd/MM/yyyy")));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

      const { id_fornecedor, data, id_semana, liberado, status } = doc.data();
      handleCheckboxChange(id_fornecedor, `${data}`, true, 0);

      const novoObjeto = {
        id_semana,
        liberado,
        status
      }; 

      pronto.push(novoObjeto);

    });
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

  }, [semanaAtual]);

  return (
    <>
      <div><Toaster /></div>
      <div className="topTable">

        <button onClick={SemanaAnterior}>Semana Anterior</button>

        <span >{formatFns(semanaAtual, "'Semana de' dd/MM/yyyy")}</span>
        <button onClick={SemanaSeguinte}>Próxima Semana</button>
      </div>

      <table>
        {renderTableHeader()}
        {renderTableBody()}
      </table>

      <button className="botaoConfirma" onClick={addSemana} style={{ alignSelf: "flex-start" }}>
        Confirmar
      </button>
    </>
  );
};

export default Table;
