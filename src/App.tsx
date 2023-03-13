import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./paginas/Login/index";
import { Main } from "./paginas/main/index";
import { PrivateRoute } from "./routes/privados/privado";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/main"
            element={
              <PrivateRoute redirectTo={'/'}>
                <Main />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
