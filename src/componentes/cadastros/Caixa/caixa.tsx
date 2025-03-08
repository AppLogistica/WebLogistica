import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, setDoc, doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'
import db from '../../../firebase/database';
import { menssagem } from '../../menssagem';
import { AtualizaCaixaSupabase } from "../../../supabase/syncCaixaSupabase";
import { DeleteCaixaSupabase } from '../../../supabase/DeleteCaixaSupabase';

interface propCaixa {
  id: string;
  nome: number;
  id_local: number;
  id_status: number;
  Latitude: number;
  Longitude: number;
  livre: boolean;
}

//import { auth as adminAuth } from "firebase-admin"
const CadCaixa = () => {
  const [caixas, setCaixas] = useState<propCaixa[]>([]);
  const [nome, setNome] = useState('');
  const [livre, setLivre] = useState(true);
  const [codigo, setCodigo] = useState('');
  const [selectedOption, setSelectedOption] = useState('Sim');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {
    async function carregaCaixa() {
      const unsub = onSnapshot(collection(db, "caixa"), (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data() as propCaixa);
        setCaixas(data);
      });
      return () => {
        unsub();
      };
    }

    carregaCaixa();
  }, [])

  const sortedData = [...caixas].sort((a, b) => a.nome - b.nome);

  async function handleSubmit() {
    event.preventDefault();
    if (!nome) {
      document.getElementById("codigo").focus();
      menssagem("O campo 'Caixa' é obrigatório", true);
      return;
    }

    const semanaRef = collection(db, "semana");
    const q = query(semanaRef, where("status", "!=", ""));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      let count = 0;
      if (selectedOption === 'sim') {
        querySnapshot.forEach(async (documento) => {
          if (`${documento.data().id_caixa}` === codigo) {
            count = 1;
            window.confirm(`
              Essa caixa está em uso no processo ${documento.data().id_semana}?\n
              Fornecedor: ${`${documento.data().id_fornecedor}`.padStart(2, '0')}
              Data: ${documento.data().data}
              Finalize esse processo no app primeiro ou exclua na aba inicio do web`);
          }
        });

        if (count === 0) {
          salvaCaixa();
        }

      } else {
        salvaCaixa();
      }
    } else {
      salvaCaixa();
    }
  };

  async function salvaCaixa() {
    let Nnome = parseInt(nome);
    try {
      const docRef = await setDoc(doc(db, "caixa", `${Nnome}`), {
        Latitude: null,
        Longitude: null,
        id_local: 1,
        id_status: 1,
        livre: selectedOption.toLocaleLowerCase() === "sim" ? true : false,
        nome: Nnome
      });
      
      // Atualiza Supabase
      await AtualizaCaixaSupabase(
        docRef,
        livre,
        Nnome,
      );
      
    } catch (e) {
      // console.error("Error adding document: ", e);
      // menssagem(`Erro ao salvar! \n ${codigo} ${nome}`, true);
      return;
    }
  }

  const handleTableRowClick = (cai: propCaixa) => {
    setSelectedRow(cai.nome);
    setNome(`${cai.nome}`);
    setLivre(cai.livre)
    setSelectedOption(cai.livre ? "Sim" : "Não");
    setCodigo(`${cai.nome}`);
  }

  const num = selectedRow;

  const renderTable = () => {
    return (
      <table className='tableForm'>
        <thead className='headTable'>
          <tr>
            <th>Caixa</th>
            <th>Livre</th>
          </tr>
        </thead>
        <tbody className='body'>
          {sortedData.map((caixa, index) => (
            <tr key={index} onClick={() => handleTableRowClick(caixa)}
              style={{ backgroundColor: `${caixa.nome}` === codigo ? '#363636' : '' }}>
              <td>{`${caixa.nome}`.padStart(2, "0")}</td>
              <td>{caixa.livre ? "Sim" : "Não"}</td>
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
          console.log(codigo);

          await deleteDoc(doc(db, 'caixa', codigo));
          //   menssagem('Dados salvos com sucesso!', false);
          setCodigo("");
          setNome("");
          setLivre(true);
          setSelectedRow(null);
          
          // Atualiza Supabase
          await DeleteCaixaSupabase(
            codigo
          );
          
        } catch (error) {
          menssagem(`Erro ao salvar! \n ${codigo} ${nome}`, true);
        }
      } else {
        console.log('errou');
        return;
      }
    }
  }

  function ComboBox() {
    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    }

    return (
      <select value={selectedOption} onChange={handleOptionChange} style={{ width: "89%", height: "30px", alignSelf: "center" }}>
        <option value="sim">Sim</option>
        <option value="Não">Não</option>
      </select>
    );
  }

  return (
    <>
      <div><Toaster /></div>
      <div className='divForm'>
        {renderTable()}
        <div className='divide'></div>
        <form className='formu' onSubmit={handleSubmit}>
          <label htmlFor="nome">Caixa</label>
          <input type="number" id="nome" value={nome} onChange={e => setNome(e.target.value)} />

          <label htmlFor="livre">Livre</label>
          <ComboBox />

          <div className='botoesFornec'>
            <button style={{backgroundColor: '#008000', color: 'white',}} type="submit">Cadastrar</button>
            <button onClick={excluir} style={{ background: '#9c2c2c', color: 'white' }}>Excluir</button>
          </div>

          <button className='botoesEmail'
            type="button" onClick={() => {
              document.getElementById("nome").focus();
              setNome('');
              setLivre(true);
              setCodigo('');
            }} style={{backgroundColor: '#ffff00', color: 'black',}}>Novo</button>
        </form>
      </div>
    </>
  );
};

export default CadCaixa;