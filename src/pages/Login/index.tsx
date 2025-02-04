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
import styles from './login.module.css';

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
    <div className={styles.navLogin}>
      <ToastContainer />
      <div className={styles.navImg}>
        <img
          src={dirjuspLogo}
          alt="Observatório - Dirjusp"
          className={styles.loginLogo}
        />
      </div>

      <div className={styles.loginContent}>
        <h1>Observatório - DIRJUSP</h1>
        <h2>Seja bem-vindo!</h2>
        <p>Para acessar o sistema, faça login com seu usuário e senha.</p>

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>Entrando...</p>
          </div>
        ) : (
          <form className={styles.loginForm} onSubmit={handleLogin} noValidate>
            <input
              type="email"
              placeholder="E-mail"
              className={`${styles.loginInput} ${error?.field === "email" ? styles.error : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
            />
            {error?.field === "email" && (
              <p className={styles.errorMessage}>{error.message}</p>
            )}
            <input
              type="password"
              placeholder="Senha"
              className={`${styles.loginInput} ${error?.field === "password" ? styles.error : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
            />
            {error?.field === "password" && (
              <p className={styles.errorMessage}>{error.message}</p>
            )}
            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              Entrar
            </button>
          </form>
        )}

        {error?.field === "general" && (
          <p className={styles.loginError}>{error.message}</p>
        )}

        <p className={styles.loginFooter}>
          Ainda não tem uma conta? <Link to="/signup">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
