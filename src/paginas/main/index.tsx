import "./styles.css";

import { useEffect, useState } from 'react'
import Table, { TableProps } from '../../table'
import { supabase } from "../../supabase/database";

export interface SemanaProps {
  ativo: boolean;
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

    async function getFornecedor() {
      const { data, error } = await supabase.from('fornecedor').select();

      if (error) {
        console.log(error);
        return;
      }

      const fornecedores = data.map((fornecedor) => ({
        id: fornecedor.id_fornecedor.toString(),
        cnpj: fornecedor.cnpj,
        email: fornecedor.email ?? null,
        id_endereco: fornecedor.id_endereco,
        id_fornecedor: fornecedor.id_fornecedor,
        nome: fornecedor.nome,
      }));

      setFornecedor(fornecedores);
      
    }

    getFornecedor()

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
