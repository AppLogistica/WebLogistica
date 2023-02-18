import "./styles.css";

import { useEffect, useState } from 'react'
import Table, { TableProps } from '../../table'
import { onSnapshot, collection } from "firebase/firestore";
import db from '../../firebase/database';

export interface SemanaProps {
  ativo: boolean;
  alterado_em: Date;
  data: Date;
  id_caixa: null | number;
  id_fornecedor: number;
  id_semana: number;
  inserido_em: Date;
  id: string;
}

export interface FornecedorProps {
  id: string;
  cnpj: string;
  email: string | null;
  id_endereco: number;
  id_fornecedor: number;
  nome: string;
}

export function Main() {

  const [semana, setSemana] = useState<SemanaProps[]>([]);
  const [fornecedor, setFornecedor] = useState<FornecedorProps[]>([]);

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

    function carregaFornecedor() {
      const unsub = onSnapshot(collection(db, "fornecedor"), (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data() as FornecedorProps);
        setFornecedor(data);
        // console.log(data)
      });
      // retorna uma função de limpeza para cancelar a inscrição
      return () => {
        unsub();
      };
    }

    carregaSemana();
    carregaFornecedor();
  }, []);

  const sortedData = [...fornecedor].sort((a, b) => a.id_fornecedor - b.id_fornecedor);
  const sortedsemana = [...semana].sort((a, b) => a.id_semana - b.id_semana);

  return (
    <div className="App">
      <Table
        fornec={sortedData}
      />
    </div>
  )
}
