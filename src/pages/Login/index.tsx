import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import OdinLogo from "../../assets/odin.png";
import DOMPurify from "dompurify";
import "./style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const validateInputs = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, insira um e-mail válido.");
      return false;
    }
    if (password.trim().length === 0) {
      setError("A senha não pode estar vazia.");
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

      navigate("/homepage");
    } catch (err: any) {
      console.error("Erro de autenticação:", err);
      setError("Falha ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nav-login">
      <div className="nav-img">
        <img
          src={OdinLogo}
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
              className={`login-input ${error ? "error" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className={`login-input ${error ? "error" : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
            />
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              Entrar
            </button>
          </form>
        )}

        {error && <p className="login-error">{error}</p>}
        <p className="login-footer">
          Ainda não tem uma conta? <Link to="/signup">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
