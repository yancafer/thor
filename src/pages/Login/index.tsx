import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import OdinLogo from "../../assets/odin.png";
import "./style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para controle do loader
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // Inicia o estado de carregamento

    try {
      // Configura a persistência do login para `local`
      await setPersistence(auth, browserLocalPersistence);

      // Realiza o login com e-mail e senha
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/homepage"); // Redireciona após login bem-sucedido
    } catch (err: any) {
      setError("Falha ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
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

        {isLoading ? ( // Exibe o loader enquanto está carregando
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Entrando...</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Usuário ou e-mail"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>
        )}

        {error && <p className="login-error">{error}</p>}

        <p className="login-footer">
          Ainda não tem uma conta? <a href="/signup">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
