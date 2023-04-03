import React, { useEffect, useState } from 'react';
import './stylesFornec.css'
import { collection, onSnapshot, setDoc, doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'
import db from '../../../firebase/database';
import { FornecedorProps } from '../../../paginas/main';
import { menssagem } from '../../menssagem';



const CadastroFornecedor = () => {
  const [fornecedores, setFornecedores] = useState<FornecedorProps[]>([]);
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {

    async function carregaFornecedor() {

      const unsub = onSnapshot(collection(db, "fornecedor"), (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data() as FornecedorProps);
        setFornecedores(data);
      });

      return () => {
        unsub();
      };
    }

    carregaFornecedor();
  }, [])

  const sortedData = [...fornecedores].sort((a, b) => a.id_fornecedor - b.id_fornecedor);
  let temCNPJ = false;
  let temId = false;
  async function handleSubmit() {
    event.preventDefault();
    if (!codigo) {
      document.getElementById("codigo").focus();
      menssagem("O campo 'Código do Fornecedor' é obrigatório", true);
      return;
    } else if (!nome) {
      document.getElementById("nome").focus();
      menssagem("O campo 'Nome' é obrigatório", true);
      return
    } else if (!cnpj) {
      document.getElementById("cnpj").focus();
      menssagem("O campo 'CNPJ' é obrigatório", true);
      return
    } else if (cnpj) {
      sortedData.map(item => {
        if (item.cnpj === cnpj) {
          temCNPJ = true;
        }
        if (`${item.id_fornecedor}` === codigo) {
          temId = true;
        }
      })
    }

    if (temId) {
      const confirmarUpdate = window.confirm('Esse fornecedor ja existe, continuar irá atualizar o registro. \n Deseja continuar?');

      if (!confirmarUpdate) {
        return;
      }
    } else {
      if (temCNPJ) {
        menssagem("CNPJ já cadastrado", true);
        document.getElementById("cnpj").focus();
        return;
      }
    }

    try {
      const docRef = await setDoc(doc(db, "fornecedor", `${codigo}`), {
        id_fornecdor: codigo,
        id_fornecedor: codigo,
        nome: nome,
        cnpj: cnpj,
        email: email,
        id_endereco: 1
      });
      menssagem('Dados salvos com sucesso!', false)
      console.log("Document written with ID: ", docRef);


    } catch (e) {
      console.error("Error adding document: ", e);
      menssagem(`Erro ao salvar! \n ${codigo} ${nome}`, true)
      return
    }

  };

  const handleTableRowClick = (fornec: FornecedorProps) => {

    setSelectedRow(fornec.id_fornecedor);
    setNome(fornec.nome);
    setCnpj(fornec.cnpj);
    setEmail(fornec.email !== null ? fornec.email : "");
    setCodigo(`${fornec.id_fornecedor}`);
  }

  const num = selectedRow;

  const renderTable = () => {

    return (
      <table className='tableForm'>
        <thead className='headTable'>
          <tr>
            <th id='thFornec'>Código</th>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody className='body'>
          {sortedData.map((fornecedor, index) => (
            <tr key={index} onClick={() => handleTableRowClick(fornecedor)}
              style={{ backgroundColor: `${fornecedor.id_fornecedor}` === codigo ? '#363636' : '' }}>

              <td>{fornecedor.id_fornecedor}</td>
              <td>{fornecedor.nome}</td>
              <td>{fornecedor.cnpj}</td>
              <td>{fornecedor.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  async function excluir() {

    event.preventDefault();
    if (codigo) {

      const confirmarExclusao = window.confirm('Tem certeza que deseja excluir este fornecedor?');

      if (confirmarExclusao) {

        try {
          await deleteDoc(doc(db, 'fornecedor', codigo));
          //   menssagem('Dados salvos com sucesso!', false);
          setCodigo("");
          setNome("");
          setCnpj("");
          setEmail("");
          setSelectedRow(null);
          menssagem('Dados excluidos com sucesso!', false);
        } catch (error) {
          menssagem(`Erro ao salvar! \n ${codigo} ${nome}`, true)
        }
      } else {
        console.log('errou');
        return
      }
    }
  }

  return (
    <>
      <div><Toaster /></div>
      <div className='divForm'>

        {renderTable()}

        <div className='divide'></div>
        <form className='formu' onSubmit={handleSubmit}>
          <label htmlFor="codigo">Código do Fornecedor</label>
          <input type="text" id="codigo" value={codigo} onChange={e => setCodigo(e.target.value)} />
          <label htmlFor="nome">Nome</label>
          <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />

          <label htmlFor="cnpj">CNPJ</label>
          <input type="text" id="cnpj" value={cnpj} onChange={e => setCnpj(e.target.value)} />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />

          <div className='botoes'>
            <button type="submit">Cadastrar</button>
            <button onClick={excluir} style={{ background: '#9c2c2c', color: 'white' }}>Excluir</button>
          </div>

          <button type="button" onClick={() => {
            setNome('');
            setCnpj('');
            setEmail('');
            setCodigo('');
          }}>Novo</button>
        </form>
      </div>
    </>
  );
};

export default CadastroFornecedor;
