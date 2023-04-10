import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SessionProvider } from "./context/SessionContext";
import { Login } from "./paginas/Login/index";
import { Main } from "./paginas/main/index";
import { PrivateRoute } from "./routes/privados/privado";
import CadastroFornecedor from "./componentes/cadastros/Fornecedor/CadFornec";
import CadastroEmail from "./componentes/cadastros/Email/cadEmail";
import { Menu } from "./componentes/menu/Menu";
import CadCaixa from "./componentes/cadastros/Caixa/caixa";
import CadLocal from "./componentes/cadastros/Local/local";

function App() {

  return (

    <div style={{ backgroundColor: "#242424" }}>
      <SessionProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/main"
                element={
                  <PrivateRoute redirectTo={'/'}>
                    <Menu />
                    <Main />
                  </PrivateRoute>
                }
              />

              <Route
                path="/fornecedores"
                element={
                  <PrivateRoute redirectTo={'/'}>
                    <Menu />
                    <CadastroFornecedor />
                  </PrivateRoute>
                }
              />

              <Route
                path="/email"
                element={
                  <PrivateRoute redirectTo={'/'}>
                    <Menu />
                    <CadastroEmail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/caixa"
                element={
                  <PrivateRoute redirectTo={'/'}>
                    <Menu />
                    <CadCaixa />
                  </PrivateRoute>
                }
              />

              <Route
                path="/local"
                element={
                  <PrivateRoute redirectTo={'/'}>
                    <Menu />
                    <CadLocal />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SessionProvider>
    </div>
  );
}

export default App;
//       