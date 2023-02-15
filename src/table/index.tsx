import React, { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import "./styles.css";
import { FornecedorProps } from "../paginas/main/Main";

export interface TableProps {
  fornec: FornecedorProps[];
}

const Table: React.FC<TableProps> = ({ fornec }) => {
  const [semanaAtual, setSemanaAtual] = useState(new Date());
  const [dadosSemana, setDadosSemana] = useState<{ [key: string]: number[] }>(
    {}
  );


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
            <th key={day.toISOString()}>
              {format(day, "dd/MM/yyyy")}{" "}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
<tbody>
  {fornec.map((fornecedor) => (
    <tr key={fornecedor.id_fornecedor}> {/* adicione a propriedade "key" aqui */}
      <td>{fornecedor.id_fornecedor}</td>
      <td>{fornecedor.nome}</td>
      {DiasSemana.map((day) => (
        <td key={day.toISOString()}>
          <input
            type="checkbox"
            checked={
              (dadosSemana[day.toISOString()] || []).indexOf(
                fornecedor.id_fornecedor
              ) > -1
            }
            onChange={(event) =>
              handleCheckboxChange(
                fornecedor.id_fornecedor,
                day.toISOString(),
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

  return (
    <>
      <div className="topTable">
        <button onClick={SemanaAnterior}>Semana Anterior</button>

        <span>{format(semanaAtual, "'Semana de' dd/MM/yyyy")}</span>
        <button onClick={SemanaSeguinte}>Próxima Semana</button>
      </div>

      <table>
        {renderTableHeader()}
        {renderTableBody()}
        <div className="caixaBotao">
        <button className="botaoConfirma" onClick={() => console.log(dadosSemana)}>
          Confirmar
        </button>
      </div>
      </table>

    </>
  );
};

export default Table;
