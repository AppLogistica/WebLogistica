import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext';
import { useSession } from '../../context/SessionContext';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();


  function handleSignInClick() {

    signIn(email, password)
    .then((res) => {
      navigate('/main');
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

          <div className="button-form" onClick={handleSignInClick}>
            <a id="submit" href="#">
              Entrar
            </a>

            <a id="recover-pass" href="#">
              Recuperar senha
            </a>
          </div>

        </form>
      </div>
    </>
  );
}
