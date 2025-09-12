import Login from "./pages/Login.tsx";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./lib/ProtectedRoute.tsx";
import Home from "./pages/Home.tsx";
import Display from "./pages/Display.tsx";

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<Display />} />
      <Route path="/:id" element={<Display />} />
      <Route element={<ProtectedRoute />}>
        <Route path="home" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
