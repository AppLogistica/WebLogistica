import React, { useEffect, useState } from 'react';
import './stylesFornec.css'
import { collection, onSnapshot, setDoc, doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'
import db from '../../../firebase/database';
import { FornecedorProps } from '../../../paginas/main';
import { menssagem } from '../../menssagem';
//import { auth as adminAuth } from "firebase-admin"
const CadastroFornecedor = () => {
  const [fornecedores, setFornecedores] = useState<FornecedorProps[]>([]);
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cidade, setCidade] = useState('');
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
    } 

    if (temId) {
      const confirmarUpdate = window.confirm('Esse fornecedor ja existe, continuar irá atualizar o registro. \n Deseja continuar?');

      if (!confirmarUpdate) {
        return;
      }
    }

    try {
      const docRef = await setDoc(doc(db, "fornecedor", `${codigo}`), {
        id_fornecedor: codigo,
        nome: nome.toUpperCase(),
        cidade: cidade.toUpperCase()
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
    // setCnpj(fornec.cnpj);
    // setEmail(fornec.email !== null ? fornec.email : "");
    setCodigo(`${fornec.id_fornecedor}`);
 
    setCidade(fornec.cidade !== undefined ? fornec.cidade : "")
  }

  const num = selectedRow;

  const renderTable = () => {

    return (
      <table className='tableForm'>
        <thead className='headTable'>
          <tr>
            <th id='thFornec'>Código</th>
            <th>Nome</th>
            <th>Cidade</th>
          </tr>
        </thead>
        <tbody className='body'>
          {sortedData.map((fornecedor, index) => (
            <tr key={index} onClick={() => handleTableRowClick(fornecedor)}
              style={{ backgroundColor: `${fornecedor.id_fornecedor}` === codigo ? '#363636' : '' }}>

              <td>{fornecedor.id_fornecedor}</td>
              <td>{fornecedor.nome}</td>
              <td>{fornecedor.cidade}</td>
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
          setCidade("");
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
          <label htmlFor="codigo">Código</label>
          <input type="number" id="codigo" value={codigo} onChange={e => setCodigo(e.target.value)} />
          <label htmlFor="nome">Nome</label>
          <input type="text" id="nome" value={nome.toUpperCase()} onChange={e => setNome(e.target.value)} />

          <label htmlFor="cnpj">Cidade</label>
          <input type="text" id="cnpj" value={cidade.toUpperCase()} onChange={e => setCidade(e.target.value)} />

          <div className='botoesFornec'>
            <button type="submit">Cadastrar</button>
            <button onClick={excluir} style={{ background: '#9c2c2c', color: 'white' }}>Excluir</button>
          </div>

          <button className='botoesEmail'
            type="button" onClick={() => {
              document.getElementById("codigo").focus();
              setNome('');
              setCnpj('');
              setEmail('');
              setCodigo('');
              setCidade('');
            }}>Novo</button>
        </form>
      </div>
    </>
  );
};

export default CadastroFornecedor;
