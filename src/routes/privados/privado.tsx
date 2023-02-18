import { getAuth, onAuthStateChanged, setPersistence } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSession } from "../../context/SessionContext";

// @ts-ignore
export const PrivateRoute = ({ children, redirectTo }) => {
  
  let token: string = '';

  const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {

    user.getIdTokenResult().then(item => {
     token = item.token;

      
    })
    
    const uid = user.uid;
    // ...
  } else {
    
  }
});


  return JSON.parse(sessionStorage.getItem(`firebase:authUser:${auth.app.options.apiKey}:[DEFAULT]`)) ? children : <Navigate to={redirectTo} />;
};

