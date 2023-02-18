import { Navigate } from "react-router-dom";
import { AuthProvider, AuthContext, useAuth } from "../../../context/AuthContext";
import {
  Auth,
  UserCredential,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getAuth,
  getIdToken
} from 'firebase/auth'
// @ts-ignore
export const PrivateRoute = ({ children, redirectTo }) => {
  
  const { auth, user } = useAuth();
  
  console.log(auth.currentUser?.getIdToken());

 
  
  const token = auth.currentUser?.getIdToken()
   .catch(() => {
      console.log(token);
   })
  

  const Logado = auth.currentUser;

  return Logado ? children : <Navigate to={redirectTo} />;
};