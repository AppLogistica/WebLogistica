import React, { useState } from "react";
import "./Table.css";

type Supplier = {
  id: number;
  name: string;
};

type DateColumn = {
  date: Date;
  checked: boolean;
};

type TableProps = {
  suppliers: Supplier[];
  dates: DateColumn[];
};

const Table: React.FC<TableProps> = ({ suppliers, dates }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const prevWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  const nextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "numeric" });
  };

  return (
    <div>
      <div className="table-header">
        <button onClick={prevWeek}>Anterior</button>
        <h2>Semana de {formatDate(currentWeek)}</h2>
        <button onClick={nextWeek}>Próxima</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Código do Fornecedor</th>
            <th>Nome do Fornecedor</th>
            {dates.map((date) => (
              <th key={date.date.toISOString()}>{formatDate(date.date)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.id}</td>
              <td>{supplier.name}</td>
              {dates.map((date) => (
                <td key={date.date.toISOString()}>
                  <input type="checkbox" checked={date.checked} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
