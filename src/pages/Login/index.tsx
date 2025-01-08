import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import dirjuspLogo from "../../assets/dirjusp.png";
import DOMPurify from "dompurify";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ field: string; message: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const validateInputs = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError({ field: "email", message: "Por favor, insira um e-mail válido." });
      toast.error("E-mail inválido. Por favor, corrija e tente novamente.");
      return false;
    }
    if (password.trim().length === 0) {
      setError({ field: "password", message: "A senha não pode estar vazia." });
      toast.error("Senha vazia. Por favor, preencha e tente novamente.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsLoading(true);
    setError(null);

    try {
      const sanitizedEmail = DOMPurify.sanitize(email);

      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, sanitizedEmail, password);

      toast.success("Login bem-sucedido!");
      navigate("/homepage");
    } catch (err: any) {
      console.error("Erro de autenticação:", err);
      toast.error("Falha ao fazer login. Verifique suas credenciais.");
      setError({ field: "general", message: "Credenciais inválidas." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nav-login">
      <ToastContainer />
      <div className="nav-img">
        <img
          src={dirjuspLogo}
          alt="Observatório - Dirjusp"
          className="login-logo"
        />
      </div>

      <div className="login-content">
        <h1>Observatório - Dirjusp</h1>
        <h2>Seja bem-vindo!</h2>
        <p>Para acessar o sistema, faça login com seu usuário e senha.</p>

        {isLoading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Entrando...</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleLogin} noValidate>
            <input
              type="email"
              placeholder="E-mail"
              className={`login-input ${error?.field === "email" ? "error" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
            />
            {error?.field === "email" && (
              <p className="error-message">{error.message}</p>
            )}
            <input
              type="password"
              placeholder="Senha"
              className={`login-input ${
                error?.field === "password" ? "error" : ""
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
            />
            {error?.field === "password" && (
              <p className="error-message">{error.message}</p>
            )}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              Entrar
            </button>
          </form>
        )}

        {error?.field === "general" && (
          <p className="login-error">{error.message}</p>
        )}

        <p className="login-footer">
          Ainda não tem uma conta? <Link to="/signup">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
