import "./styles.css";

import { useEffect, useState } from 'react'
import Table, { TableProps } from '../../table'
import { collection, onSnapshot, where, query, getDocs } from "firebase/firestore";
import db from '../../firebase/database';
import { format, addDays, subDays } from "date-fns";
import CadastroFornecedor from "../../componentes/cadastros/Fornecedor/CadFornec";

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

  const [fornecedor, setFornecedor] = useState<FornecedorProps[]>([]);

  useEffect(() => {

    async function carregaFornecedor() {

      const unsub = onSnapshot(collection(db, "fornecedor"), (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data() as FornecedorProps);
        setFornecedor(data);
      });

      return () => {
        unsub();
      };
    }

    carregaFornecedor();
  }, []);

  const sortedData = [...fornecedor].sort((a, b) => a.id_fornecedor - b.id_fornecedor);

  return (
    <div className="App">
      <Table
        fornec={sortedData}
      />
    </div>
  )
}

//<CadastroFornecedor />
/*
 <Table
        fornec={sortedData}
      />
      */