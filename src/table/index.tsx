import React, { useEffect, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { collection, onSnapshot, setDoc, doc, getDoc, getDocs } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

import "./styles.css";
import { FornecedorProps, SemanaProps } from "../paginas/main";
import db from "../firebase/database";
import { menssagem } from "../componentes/menssagem";

export interface TableProps {
  fornec: FornecedorProps[];
}

interface DadosSemana {
  id_semana: [];
  [key: string]: number[];
}

const Table: React.FC<TableProps> = ({ fornec }) => {
  const [semanaAtual, setSemanaAtual] = useState(new Date());
  const [dadosSemana, setDadosSemana] = useState<DadosSemana>({ id_semana: [] });
  const [semana, setSemana] = useState<SemanaProps[]>([]);
  const navigate = useNavigate();

  const DiasSemana = Array.from({ length: 8 }, (_, i) =>
    addDays(semanaAtual, i)
  );

  const SemanaAnterior = () => {
    setSemanaAtual(subDays(semanaAtual, 8));
  };

  const SemanaSeguinte = () => {
    setSemanaAtual(addDays(semanaAtual, 8));
  };

  const handleCheckboxChange = (
    fornecedorId: number,
    data: string,
    checked: boolean,
  ) => {
    setDadosSemana((prevState) => ({
      ...prevState,
      [data]: checked
        ? [...(prevState[data] || []), fornecedorId,]
        : prevState[data].filter((id) => id !== fornecedorId),
    }));
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
                      event.target.checked
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
    let num: number = semana.length;
    let salvou: boolean = true;

    Object.entries(dadosSemana).forEach(([dia, dados]) => {

      dados.map(async id_fornec => {
        if (dados.length > 0) {

          let dataDia = dia.replaceAll('/', '')

          const id_fornecFormat = id_fornec.toString().padStart(4, '0');

          try {
            num++;
            const docRef = await setDoc(doc(db, "semana", `${dataDia}.${id_fornecFormat}`), {
              id_semana: `${dataDia}.${id_fornecFormat}`,
              id_fornecedor: id_fornec,
              id_caixa: null,
              data: dia,
              ativo: 'Inativos',
              inserido_em: format(new Date(), "dd/MM/yyyy"),
              status: ''
            });
            console.log("Document written with ID: ", docRef);
            salvou = true;

          } catch (e) {
            console.error("Error adding document: ", e);
            toast.error('Erro ao salvar dados!', { duration: 3000 })
            salvou = false;
            return
          }
        }
      })
    });

    if (salvou) {
      menssagem('Dados salvos com sucesso!', false);
    }
  }

  useEffect(() => {

    async function carregaSemana() {

      const querySnapshot = await getDocs(collection(db, "semana"));
      querySnapshot.forEach((doc) => {

        handleCheckboxChange(doc.data().id_fornecedor, `${doc.data().data}`, true);

        setSemana((semana) => [...semana, doc.data() as SemanaProps]);

      });

    }

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
