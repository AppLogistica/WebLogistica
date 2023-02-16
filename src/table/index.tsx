import React, { useEffect, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { collection, onSnapshot, setDoc, doc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'

import "./styles.css";
import { FornecedorProps, SemanaProps } from "../paginas/main/Main";
import db from "../firebase/database";

export interface TableProps {
  fornec: FornecedorProps[];
  semanac: SemanaProps[];
}

interface DadosSemana {
  id_semana: [];
  [key: string]: number[];
}

const Table: React.FC<TableProps> = ({ semanac, fornec }) => {
  const [semanaAtual, setSemanaAtual] = useState(new Date());
  const [dadosSemana, setDadosSemana] = useState<DadosSemana>({ id_semana: [] });
  const [semana, setSemana] = useState<SemanaProps[]>([]);

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

    console.log("Dados da semana:");
    Object.entries(dadosSemana).forEach(([dia, dados]) => {
      console.log(`- ${dia}: ${dados.join(", ")}`);

      dados.map(async item => {
        if (dados.length > 0) {

          let dataDia = dia.replaceAll('/', '')
          console.log(dataDia);
          
          try {
            num++;
            const docRef = await setDoc(doc(db, "semana", `${dataDia}.${item}`), {
              id_semana: num,
              id_fornecedor: item,
              id_caixa: null,
              data:  dia,
              ativo: true,
              inserido_em: format(new Date(), "dd/MM/yyyy"),
              alterado_em: null
            });
            console.log("Document written with ID: ", docRef);
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
    
    async function carregaSemana() {

      const unsub = await onSnapshot(collection(db, "semana"), (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data() as SemanaProps);
        setSemana(data);

        semana.forEach((item) => {
          const { data, id_fornecedor } = item;
          handleCheckboxChange(id_fornecedor, `${data}`, true);
        });
      });
      // retorna uma função de limpeza para cancelar a inscrição

      return () => {
        unsub();
      };
    }

    carregaSemana().then(() => {
      // Executa a função handleCheckboxChange após a conclusão da busca no banco de dados
      semanac.forEach((item) => {
        const { data, id_fornecedor } = item;
        handleCheckboxChange(id_fornecedor, `${data}`, true);
      });
    })
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
