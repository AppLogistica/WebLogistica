import React, { useEffect, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import {doc, getDoc} from "firebase/firestore";
import  { Toaster } from 'react-hot-toast'

import "./styles.css";
import { FornecedorProps } from "../paginas/main";
import db from "../firebase/database";
import { menssagem } from "../componentes/menssagem";
import { supabase } from "../supabase/database";

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

    if (novo === 1) {
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

    //return
    Object.entries(dadosNovos).forEach(([dia, dados]) => {

      dados.map(async id_fornec => {
        if (dados.length > 0) {

          let dataDia = dia.replaceAll('/', '')

          const id_fornecFormat = id_fornec.toString().padStart(4, '0');

          console.log(`${dataDia}.${id_fornecFormat}`);

          const id_semana = `${dataDia}.${id_fornecFormat}`;

          const { error } = await supabase.from('semana').select('*').match({id_semana});

          const docRef = doc(db, "semana", id_semana);

          if (error) {
            console.log(error);
            
          } else {

            try {

              const id_semana = `${dataDia}.${id_fornecFormat}`;
              const id = `${dataDia}.${id_fornecFormat}`;
              const id_fornecedor = id_fornec;
              const data_ = dia;
              const ativo = 'Inativos';
              const inserido_em = format(semanaAtual, "dd/MM/yyyy");
              const status = ''
              const id_caixa = -1

              const { data, error } = await supabase.from('semana').insert([{ id_semana, id, id_fornecedor, id_caixa, inserido_em, ativo, status, data_ }]);

              if (error) {
                console.log('Erro ao inserir registro:', error.message);
              } else {
                console.log('Registro inserido com sucesso:', data);
              }

              menssagem('Dados salvos com sucesso!', false);

            } catch (e) {
              console.error("Error adding document: ", e);
              menssagem(`Erro ao salvar! \n ${dataDia}.${id_fornecFormat}`, true)
              return
            }
          }
        }
      })
    });

    setDadosNovos({});

  }

  useEffect(() => {

    async function getSemana() {

      const { data, error } = await supabase.from('semana').select();

      if (error) {
        console.log(error);
        return;
      }

      data.map((sema) => {
        handleCheckboxChange(sema.id_fornecedor, `${sema.data_}`, true, 0);
        if (!semana.includes(sema.id)) {
          semana.push(sema.id);
        }
      })

      const sem = data.map((semanal) => ({
        ativo: semanal.ativo,
        id_caixa: semanal.id_caixa ?? null,
        id_fornecedor: semanal.id_fornecedor,
        id_semana: semanal.id_semana,
        inserido_em: semanal.inserido_em,
        id: semanal.id,
        data: semanal.data_
      }));
    }

    getSemana();

    // carregaSemana();

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
