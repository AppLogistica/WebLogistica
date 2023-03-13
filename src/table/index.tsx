import React, { useEffect, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { doc, getDoc } from "firebase/firestore";
import { Toaster } from 'react-hot-toast'

import "./styles.css";
import { FornecedorProps } from "../paginas/main";
import db from "../firebase/database";
import { menssagem } from "../componentes/menssagem";
import { supabase } from "../supabase/database";
import { async } from "@firebase/util";

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

          const id_semana = `${dataDia}.${id_fornecFormat}`;

          const { error, data } = await supabase.from('semana').select('id_semana').match({ id_semana });

          console.log('dados ', data);

          //se tirar da merda
          const docRef = doc(db, "semana", id_semana);

          if (data.length > 0) {
            console.log(error);

          } else {

            try {

              const [day, month, year] = dia.split('/');
              const novaData = new Date(`${year}-${month}-${day}`);

              const id_semana = `${dataDia}.${id_fornecFormat}`;
              const id = `${dataDia}.${id_fornecFormat}`;
              const id_fornecedor = id_fornec;
              const data_ = novaData;
              const ativo = 'Inativos';
              const inserido_em = new Date();
              const status = ''
              const id_caixa = -1

              setTimeout(() => {
                InsereSemana(id_semana, id, id_fornecedor, id_caixa, inserido_em, ativo, status, data_);
              }, 100);

            } catch (e) {
              console.error("Error adding document: ", e);
              menssagem(`Erro ao salvar! \n ${dataDia}.${id_fornecFormat}`, true)
              return
            }
          }
        }
      })
    });

    //setDadosNovos({});

  }

  async function InsereSemana(id_semana: string, id: string, id_fornecedor: number, id_caixa: number, inserido_em: Date, ativo: string, status: string, data_: Date) {

    const { data, error } = await supabase.from('semana').insert([{ id_semana, id, id_fornecedor, id_caixa, inserido_em, ativo, status, data_ }]);

    if (error) {
      console.log('Erro ao inserir registro:', error.message);
      menssagem(`Erro ao salvar! \n ${data_}.${id_fornecedor} \n ${error.message}`, true)
    } else {
      menssagem('Dados salvos com sucesso!', false);;
    }
  }

  useEffect(() => {

    async function getSemana() {

      console.log('atual',format(semanaAtual, 'dd/MM/yyyy').replaceAll('/', '-').split("-").reverse().join("-"));
      console.log('ultimo',format(addDays(semanaAtual, 8), 'dd/MM/yyyy').replaceAll('/', '-').split("-").reverse().join("-"));
      
      

      const { data, error } = await supabase
        .from('semana')
        .select()
        .gte('data_', format(semanaAtual, 'dd/MM/yyyy').replaceAll('/', '-').split("-").reverse().join("-"))
        .lte('data_', format(addDays(semanaAtual, 7), 'dd/MM/yyyy').replaceAll('/', '-').split("-").reverse().join("-"))

      console.log(data);

      if (error) {
        console.log(error);
        return;
      }

      data.map((sema) => {

        const novaData = `${sema.data_}`.replaceAll('-', '/').split("/").reverse().join("/");

        handleCheckboxChange(sema.id_fornecedor, novaData, true, 0);

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
