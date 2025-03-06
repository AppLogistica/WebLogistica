import React, { useEffect, useState } from 'react';
import './styleLocal.css'
import { collection, onSnapshot, setDoc, doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'
import db from '../../../firebase/database';
import { menssagem } from '../../menssagem';
import { syncLocalSupabase } from '../../../supabase/syncLocalSupabase';

interface propLocal {
  id: string;
  nome: string;
}

//import { auth as adminAuth } from "firebase-admin"
const CadLocal = () => {
  const [local, setLocal] = useState<propLocal[]>([]);
  const [nome, setNome] = useState('');
  const [livre, setLivre] = useState(true);
  const [codigo, setCodigo] = useState('');
  const [selectedOption, setSelectedOption] = useState('Sim');

  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {

    async function carregaFornecedor() {

      const unsub = onSnapshot(collection(db, "local"), (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data() as propLocal);
        setLocal(data);
      });

      return () => {
        unsub();
      };
    }

    carregaFornecedor();
  }, [])

  const sortedData = [...local].sort((a, b) => parseInt(a.id) - parseInt(b.id));
  let temCNPJ = false;
  let temId = false;
  async function handleSubmit() {
    event.preventDefault();
    if (!nome) {
      document.getElementById("codigo").focus();
      menssagem("O campo 'Caixa' é obrigatório", true);
      return;
    }

    console.log(selectedOption);

    try {
      const docRef = await setDoc(doc(db, "local", codigo), {
        nome: nome,
        id: codigo
      });
      menssagem('Dados salvos com sucesso!', false)
      console.log("Document written with ID: ", docRef);

      await syncLocalSupabase();

    } catch (e) {
      console.error("Error adding document: ", e);
      //menssagem(`Erro ao salvar! \n ${codigo} ${nome}`, true)
      return
    }
  };

  const handleTableRowClick = (loc: propLocal) => {

    setSelectedRow(parseInt(loc.id));
    setNome(loc.nome.toUpperCase());
    setCodigo(loc.id)
  }

  const num = selectedRow;

  const renderTable = () => {

    return (
      <table className='tableForm'>
        <thead className='headTable'>
          <tr>
            <th>Código</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody className='body'>
          {sortedData.map((local, index) => (
            <tr key={index} onClick={() => handleTableRowClick(local)}
              style={{ backgroundColor: `${local.id}` === codigo ? '#363636' : '' }}>

              <td>{local.id}</td>
              <td>{`${local.nome}`.padStart(2, "0")}</td>

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
          await deleteDoc(doc(db, 'local', codigo));
          //   menssagem('Dados salvos com sucesso!', false);
          setCodigo("");
          setNome("");
          setLivre(true);

          setSelectedRow(null);
          menssagem('Dados excluidos com sucesso!', false);

          await syncLocalSupabase();

        } catch (error) {
          //menssagem(`Erro ao salvar! \n ${codigo} ${nome}`, true)
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
          <label htmlFor="nome">Código</label>
          <input type="text" id="nome" value={codigo} onChange={e => setCodigo(e.target.value)} />

          <label htmlFor="cnpj">Nome</label>
          <input type="text" id="nome" value={nome.toUpperCase()} onChange={e => setNome(e.target.value)} />

          <div className='botoesFornec'>
            <button type="submit">Cadastrar</button>
            <button onClick={excluir} style={{ background: '#9c2c2c', color: 'white' }}>Excluir</button>
          </div>

          <button className='botoesEmail'
            type="button" onClick={() => {
              document.getElementById("nome").focus();
              console.log(local);
              
              setNome('');
              setCodigo('');
            }}>Novo</button>
        </form>
      </div>
    </>
  );
};

export default CadLocal;