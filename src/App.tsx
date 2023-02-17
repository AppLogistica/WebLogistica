import { BrowserRouter , Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./paginas/Login/index";
import { Main } from "./paginas/main/index";
import { PrivateRoute } from "./routes/privados/privado";

function App() {

  
return (
<BrowserRouter>
  <Routes>
    <Route
      path="/main"
      element={
        <PrivateRoute redirectTo="/">
          <Main />
        </PrivateRoute>
      }
    />
    <Route path="/" element={<Login />} />
  </Routes>
</BrowserRouter>

  );
}

export default App;

/*
<BrowserRouter>
  <Routes>
    <Route
      path="/home"
      element={
        <PrivateRoute redirectTo="/">
          <Home />
        </PrivateRoute>
      }
    />
    <Route path="/" element={<Login />} />
  </Routes>
</BrowserRouter>*/