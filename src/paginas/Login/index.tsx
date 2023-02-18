import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext';

import { menssagem } from '../../componentes/menssagem';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, auth, resetPassword } = useAuth();

  function handleSignInResetPass() {

    signIn(email, password)
      .then((res) => {
        navigate('/main');
      })
      .catch((erro) => {
        const errorCode = erro.code;
        const errorMessage = erro.message;

        if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
          return menssagem('Email ou senha incorretos!', true)
        }
        else if (erro.code === 'auth/invalid-email') {
          return menssagem('Informe um endereço de email válido!', true);
        }
        else if (erro.code === 'auth/user-not-found') {
          return menssagem('Email não encontrado, verifique se há algum erro de digitação!', true)
        } else if (erro.code === 'auth/internal-error') {

          if (!email || !password) {
            console.log(erro.code);
          }

        }

      })
  }

  function redefineSenha() {
    resetPassword(email)
      .then(() => {
        if (!email) {
          return menssagem('aqui', true);
        }
        menssagem('Foi enviado um link para o seu email para redefinir sua senha! Verifique a caixa de spam!', false);
      })
      .catch((erro) => {

        if (erro.code === 'auth/user-not-found') {
          return menssagem('Email não encontrado, verifique se há algum erro de digitação!', true)
        }
      })
  }

  return (
    <>
      <Toaster />
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <div className="user-box">
            <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <label>Senha</label>
          </div>

          <div className="button-form" onClick={() => handleSignInResetPass()}>
            <a id="submit" href="#">
              Entrar
            </a>

            <a id="recover-pass" href="#" onClick={redefineSenha}>
              Redefinir senha
            </a>
          </div>

        </form>
      </div>
    </>
  );
}
