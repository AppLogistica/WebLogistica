import React, { useEffect, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { collection, addDoc, onSnapshot, query, where, orderBy, limit, limitToLast } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'

import "./styles.css";
import { FornecedorProps, SemanaProps } from "../paginas/main/Main";
import db from "../firebase/database";

export interface TableProps {
  fornec: FornecedorProps[];
}

const Table: React.FC<TableProps> = ({ fornec }) => {
  const [semanaAtual, setSemanaAtual] = useState(new Date());
  const [dadosSemana, setDadosSemana] = useState<{ [key: string]: number[] }>(
    {}
  );
  const [semana, setSemana] = useState<SemanaProps[]>([]);
  const [count, setCount] = useState(0)

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
    checked: boolean
  ) => {
    setDadosSemana((prevState) => ({
      ...prevState,
      [data]: checked
        ? [...(prevState[data] || []), fornecedorId]
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

    console.log("Dados da semana:");
    Object.entries(dadosSemana).forEach(([diaSemana, dados]) => {
      console.log(`- ${diaSemana}: ${dados.join(", ")}`);

      dados.map(async item => {
        if (dados.length > 0) {
          try {
            num++;
            const docRef = await addDoc(collection(db, "semana"), {
              id_semana: num,
              id_fornecedor: item,
              id_caixa: null,
              data: diaSemana,
              inserido_em: format(new Date(), "dd/MM/yyyy"),
              alterado_em: null
            });
            console.log("Document written with ID: ", docRef.id);
            toast.success('Dados salvos com sucesso!', { duration: 3000 })

          } catch (e) {
            console.error("Error adding document: ", e);
            toast.error('Erro ao salvar dados!', { duration: 3000 })
          }
        }
      })
    });
  }

  useEffect(() => {
    function carregaSemana() {

      const unsub = onSnapshot(collection(db, "semana"), (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data() as SemanaProps);
        setSemana(data);
      });
      // retorna uma função de limpeza para cancelar a inscrição

      return () => {
        unsub();
      };
    }

    carregaSemana();
  }, [])



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
