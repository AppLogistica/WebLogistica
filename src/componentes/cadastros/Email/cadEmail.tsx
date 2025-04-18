import React, { useEffect, useState } from 'react';
import './styleEmail.css'
import { collection, onSnapshot, setDoc, doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast'
import db from '../../../firebase/database';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { auth as authAdm }  from "firebase-admin"

import { menssagem } from '../../menssagem';
import { useAuth } from '../../../context/AuthContext';

interface typeemail {
  id: number;
  email: string;
  uid: string;
}

const CadastroEmail = () => {

  const { auth } = useAuth();

  const [email, setEmail] = useState<typeemail[]>([]);
  const [codigo, setCodigo] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [senha, setSenha] = useState('');

  createUserWithEmailAndPassword(auth, novoEmail, senha)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });

  useEffect(() => {

    async function carregaFornecedor() {

      const unsub = onSnapshot(collection(db, "email"), (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data() as typeemail);
        setEmail(data);
      });

      return () => {
        unsub();
      };
    }

    carregaFornecedor();
  }, [])

  const sortedData = [...email].sort((a, b) => a.id - b.id);

  async function handleSubmit() {

    event.preventDefault();

    if (!novoEmail) {
      document.getElementById("email").focus();
      menssagem("O campo email é obrigatório", true);
      return;
    }

    if (!senha) {
      document.getElementById("senha").focus();
      menssagem("O campo senha é obrigatório", true);
      return;
    }

    if (senha.length < 6) {
      document.getElementById("senha").focus();
      menssagem("Informe uma senha com pelo menos 6 digitos", true);
      return;
    }
    let nextCod = 1;

    if (sortedData.length > 0) {
      nextCod = sortedData[sortedData.length - 1].id + 1;
    }

    createUserWithEmailAndPassword(auth, novoEmail, senha)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/email-already-in-use') {

          signInWithEmailAndPassword(auth, novoEmail, senha)
            .then(async (userCredential) => {
              const user = userCredential.user;

              try {
                const docRef = await setDoc(doc(db, "email", novoEmail), {
                  id: nextCod,
                  email: novoEmail,
                  uid: user.uid
                });
                menssagem('Email salvo com sucesso!', false);
                console.log("Document written with ID: ", docRef);

              } catch (e) {
                //console.error("Error adding document: ", e);
                //menssagem(`Erro ao salvar! \n ${novoEmail}`, true);
                return;
              }
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
            });
        }
        console.log(errorCode);
      });

    setCodigo('');
    setNovoEmail('');
    setSenha('');
  };

  const handleTableRowClick = (ema: typeemail) => {
    setSelectedRow(ema.id);
    setCodigo(`${ema.id}`);
    setNovoEmail(ema.email);
  };

  const num = selectedRow;

  const renderTable = () => {

    return (
      <table className='tableForm'>
        <thead className='headTable'>
          <tr>
            <th id='thEmail'>Código</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody className='body'>
          {sortedData.map((email, index) => (
            <tr key={index} onClick={() => handleTableRowClick(email)}
              style={{ backgroundColor: `${email.id}` === codigo ? '#363636' : '' }}>

              <td>{email.id}</td>
              <td>{email.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  async function excluir() {
    event.preventDefault();
    if (codigo) {

      const confirmarExclusao = window.confirm('Tem certeza que deseja excluir este email?');

      if (confirmarExclusao) {

        try {
          await deleteDoc(doc(db, 'email', `${novoEmail}`));

          setCodigo(null);
          setNovoEmail("");
          setSelectedRow(null);
          setSenha('');

          menssagem('Dados excluídos com sucesso!', false);
        } catch (error) {
          //menssagem(`Erro ao salvar! \n ${codigo} ${novoEmail}`, true);
        }
      } else {
        return;
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
          <label htmlFor="email">Email</label>
          <input type="text" id="email" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} />
          <label htmlFor="senha">Senha</label>
          <input type="Password" id='senha' value={senha} onChange={e => setSenha(e.target.value)} />

          <div className='botoesEmail'>
            <button style={{backgroundColor: '#008000', color: 'white',}} type="submit">Cadastrar</button>

            <button
              className='botaonovo'
              type="button" onClick={() => {
                document.getElementById("email").focus();
                setCodigo('');
                setNovoEmail('');
                setSenha('');
              }}  style={{backgroundColor: '#ffff00', color: 'black',}} >Novo</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CadastroEmail;