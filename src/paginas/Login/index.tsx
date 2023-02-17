import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import './styles.css';
import toast, { Toaster } from 'react-hot-toast'
import { AuthContext } from '../../routes/context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ user, setUser ] = useState();

  useEffect(() => {
    /* if (!loading && localStorage.getItem("token") !== null) {
       navigate("/main");
     }*/

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid } = user;
       console.log(uid);
       
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);


  async function handleLogin() {

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const userr = userCredential.user;
        
        navigate('/main');
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (!email) {

          return toast.error('Preencha o campo e-mail', { duration: 3000 })
        }

        if (!password) {
          return toast.error('Preencha o campo senha', { duration: 3000 })
        }

        if (errorCode == 'auth/invalid-email') {

          return toast.error('E-mail inválido', { duration: 3000 })

        }

        if (errorCode === 'auth/wrong-password') {

          return toast.error('Senha inválida', { duration: 3000 })
        }

        if (errorCode === 'auth/user-not-found') {

          return toast('E-mail não cadastrado');
        }

        return toast('Não foi possível acessar')

      });

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

          <div className="button-form" onClick={handleLogin}>
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
