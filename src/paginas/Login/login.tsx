import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import './styles.css';
import toast, {Toaster} from 'react-hot-toast'

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    // fazer a validação de login
    // redirecionar para a página principal se a validação for bem-sucedida

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        navigate('/main');
        
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorMessage: ' + errorMessage);
        console.log('errorCode: ' + errorCode);
        
        
        if (!email){
          return toast.error('Preencha o campo e-mail', {duration: 3000})
        }

        if (!password){
          return toast.error('Preencha o campo senha', {duration: 3000})
        }

        if (errorCode == 'auth/invalid-email') {

         return toast.error('E-mail inválido', {duration: 3000})
        
        }

        if(errorCode === 'auth/wrong-password'){

          return toast.error('Senha inválida', {duration: 3000})
        }

        if (errorCode === 'auth/user-not-found') {
         
          return toast('E-mail não cadastrado');
        }

        return toast('Não foi possível acessar')
        
      });

   // console.log(email);
   // console.log(password);

  }

  return (
    <body>
      <div><Toaster/></div>
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
    </body>
  );
}
