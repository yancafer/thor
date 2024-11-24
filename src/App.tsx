import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomePage from './pages/HomePage';
import ProtectedRoute from "./components/ProtectedRoute";
import Register from './pages/register';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/homepage" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path="/createprocess" element={<ProtectedRoute><Register /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
