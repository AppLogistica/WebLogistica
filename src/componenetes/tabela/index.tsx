import React, { useState } from "react";
import styled from 'styled-components';

const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  padding: 8px;
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const TableInput = styled.input`
  border: none;
  border-bottom: 1px solid #ddd;
  width: 100%;
`;

const Table: React.FC = () => {
  const [tableData, setTableData] = useState<any[]>([]);

  const handleAddRow = () => {
    setTableData((prevTableData) => [
      ...prevTableData,
      { recibo1: "", fornecedor1: "", recibo2: "", fornecedor2: "" },
    ]);
  };

  const handleRecibo1Change = (index: number, event: any) => {
    const newTableData = [...tableData];
    newTableData[index].recibo1 = event.target.value;
    setTableData(newTableData);
  };

  const handleRecibo2Change = (index: number, event: any) => {
    const newTableData = [...tableData];
    newTableData[index].recibo2 = event.target.value;
    setTableData(newTableData);
  };

  const handleFornecedor1Change = (index: number, event: any) => {
    const newTableData = [...tableData];
    newTableData[index].fornecedor1 = event.target.value;
    setTableData(newTableData);
  };

  const handleFornecedor2Change = (index: number, event: any) => {
    const newTableData = [...tableData];
    newTableData[index].fornecedor2 = event.target.value;
    setTableData(newTableData);
  };

  return (
    <>
      <TableWrapper>
        <thead>
          <tr>
            <TableHeader colSpan={2}>Segunda-Feira</TableHeader>
            <TableHeader colSpan={2}>Terça-Feira</TableHeader>
            <TableHeader colSpan={2}>Quarta-Feira</TableHeader>
            <TableHeader colSpan={2}>Quinta-Feira</TableHeader>
            <TableHeader colSpan={2}>Sexta-Feira</TableHeader>
            <TableHeader colSpan={2}>Sábado</TableHeader>
            <TableHeader colSpan={2}>Domingo</TableHeader>
          </tr>
          <tr>
            <TableHeader>Recibo</TableHeader>
            <TableHeader>Fornecedor</TableHeader>
            <TableHeader>Recibo</TableHeader>
            <TableHeader>Fornecedor</TableHeader>
            <TableHeader>Recibo</TableHeader>
            <TableHeader>Fornecedor</TableHeader>
            <TableHeader>Recibo</TableHeader>
            <TableHeader>Fornecedor</TableHeader>
            <TableHeader>Recibo</TableHeader>
            <TableHeader>Fornecedor</TableHeader>
            <TableHeader>Recibo</TableHeader>
            <TableHeader>Fornecedor</TableHeader>
            <TableHeader>Recibo</TableHeader>
            <TableHeader>Fornecedor</TableHeader>
          </tr>
          </thead>
        <tbody>
          {tableData.map((rowData, index) => (
            <tr key={index}>
              <TableData>
                <TableInput
                  type="text"
                  value={rowData.recibo1}
                  onChange={(e) => handleRecibo1Change(index, e)}
                />
              </TableData>
              <TableData>
                <TableInput
                  type="text"
                  value={rowData.fornecedor1}
                  onChange={(e) => handleFornecedor1Change(index, e)}
                />
              </TableData>
              <TableData>
                <TableInput
                  type="text"
                  value={rowData.recibo2}
                  onChange={(e) => handleRecibo2Change(index, e)}
                />
              </TableData>
              <TableData>
                <TableInput
                  type="text"
                  value={rowData.fornecedor2}
                  onChange={(e) => handleFornecedor2Change(index, e)}
                />
              </TableData>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      <button onClick={handleAddRow}>Adicionar linha</button>
    </>
  );
};

export default Table;
