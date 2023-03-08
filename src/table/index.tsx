import React, { useEffect, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { collection, onSnapshot, setDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
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
  const [dadosSemana, setDadosSemana] = useState<DadosSemana>({});
  const [dadosNovos, setDadosNovos] = useState<DadosSemana>({})
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
    novo: number
  ) => {
    setDadosSemana((prevState) => ({
      ...prevState,
      [data]: checked
        ? [...(prevState[data] || []), fornecedorId,]
        : prevState[data].filter((id) => id !== fornecedorId),
    }));
    if(novo === 1){
      setDadosNovos((prevState) => ({
        ...prevState,
        [data]: checked
          ? [...(prevState[data] || []), fornecedorId,]
          : prevState[data].filter((id) => id !== fornecedorId),
      }))
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

    console.log(dadosNovos);
    return
    Object.entries(dadosNovos).forEach(([dia, dados]) => {

      dados.map(async id_fornec => {
        if (dados.length > 0) {

          let dataDia = dia.replaceAll('/', '')

          const id_fornecFormat = id_fornec.toString().padStart(4, '0');

          console.log(`${dataDia}.${id_fornecFormat}`);

          const auxSemana = `${dataDia}.${id_fornecFormat}`;

          const tem = semana.filter(item => item === auxSemana);

          const docRef = doc(db, "semana", auxSemana);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {

          } else {

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
              menssagem('Dados salvos com sucesso!', false);

            } catch (e) {
              console.error("Error adding document: ", e);
              menssagem('Erro ao salvar!', true)
              return
            }
          }
        }
      })
    });

  }

  async function carregaSemana() {

    const q = query(collection(db, "semana"));

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

  useEffect(() => {

    carregaSemana();

  }, []);

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
