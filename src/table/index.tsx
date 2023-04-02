import React, { useEffect, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { collection, onSnapshot, setDoc, doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'

import "./styles.css";
import { FornecedorProps, SemanaProps } from "../paginas/main";
import db from "../firebase/database";
import { menssagem } from "../componentes/menssagem";

export interface TableProps {
  fornec: FornecedorProps[];
}

interface DadosSemana {
  [key: string]: number[];
}

interface salvos {
  id_semana: string;
}

const Table: React.FC<TableProps> = ({ fornec }) => {
  const [semanaAtual, setSemanaAtual] = useState(new Date());
  const [semanaAtualAux, setSemanaAtualAux] = useState(new Date())
  const [dadosSemana, setDadosSemana] = useState<DadosSemana>({});
  const [dadosNovos, setDadosNovos] = useState<DadosSemana>({})
  const [excluir, setExcluir] = useState<DadosSemana>({})
  const [editando, setEditando] = useState(false)
  const semana: string[] = [];

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
      //alert(`${excluir}`)
      if (!excluir) {
        alert(`${excluir}`)
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
            <th key={format(day, "dd/MM/yyyy")}>
              {format(day, "dd/MM/yyyy")}{" "}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody className="topoTabela">
        {fornec.map((fornecedor) => (
          <tr key={fornecedor.id_fornecedor}>
            <td>{fornecedor.id_fornecedor}</td>
            <td>{fornecedor.nome}</td>
            {DiasSemana.map((day) => (
              <td key={format(day, "dd/MM/yyyy")}>
                <input
                  style={{ color: '#FFFF00' }}
                  type="checkbox"
                  checked={
                    (dadosSemana[format(day, "dd/MM/yyyy")] || []).indexOf(
                      fornecedor.id_fornecedor
                    ) > -1
                  }
                  onChange={(event) =>
                    handleCheckboxChange(
                      fornecedor.id_fornecedor,
                      format(day, "dd/MM/yyyy"),
                      event.target.checked,
                      1
                    )
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  async function addSemana() {

    Object.entries(excluir).forEach(([dia, dados]) => {



      if (dados.length > 0) {
        dados.map(async id_fornec => {

          let dataDia = dia.replaceAll('/', '')

          const id_fornecFormat = id_fornec.toString().padStart(4, '0');

          const auxSemana = `${dataDia}.${id_fornecFormat}`;

          try {
            await deleteDoc(doc(db, 'semana', auxSemana));
            //   menssagem('Dados salvos com sucesso!', false);
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
                inserido_em: format(semanaAtual, "dd/MM/yyyy"),
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
    const q = query(semanaRef, where('data', '>=', format(semanaAtual, "dd/MM/yyyy")));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const { id_fornecedor, data } = doc.data();
      handleCheckboxChange(id_fornecedor, `${data}`, true, 0);

      if (!semana.includes(doc.id)) {
        semana.push(doc.id);
      }

    });
  }

  function iniciaNovoExcluir() {

    for (var i = 1; i < 9; i++) {
      let aux = addDays(semanaAtual, i - 1)

      setDadosNovos((prevState) => ({
        ...prevState,
        [format(aux, "dd/MM/yyyy")]: [...(prevState[format(aux, "dd/MM/yyyy")] || [])]
      }));

      setExcluir((prevState) => ({
        ...prevState,
        [format(aux, "dd/MM/yyyy")]: [...(prevState[format(aux, "dd/MM/yyyy")] || [])]
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

        <span >{format(semanaAtual, "'Semana de' dd/MM/yyyy")}</span>
        <button onClick={SemanaSeguinte}>Próxima Semana</button>
      </div>

      <table>
        {renderTableHeader()}
        {renderTableBody()}
      </table>

      <div className="caixaBotao">
        <button className="botaoConfirma" onClick={addSemana}>
          Confirmar
        </button>
      </div>

    </>
  );
};

export default Table;
