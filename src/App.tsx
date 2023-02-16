import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./paginas/Login/index";
import { Main } from "./paginas/main/index";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
