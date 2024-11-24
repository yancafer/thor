import OdinLogo from "../../assets/odin.png";
import "./style.css";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.", { position: "top-right" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Formato de e-mail inválido.", { position: "top-right" });
      return;
    }

    if (password.length < 8 || !/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
      toast.error("A senha deve ter pelo menos 8 caracteres, incluindo letras e números.", {
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Usuário criado com sucesso!", { position: "top-right" });
      navigate("/login");
    } catch (err: any) {
      toast.error("Erro ao criar conta. Tente novamente mais tarde.", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nav-login">
      {/* Toast Container */}
      <ToastContainer />

      {/* Lateral com logo */}
      <div className="nav-img">
        <img
          src={OdinLogo}
          alt="Observatório - Dirjusp"
          className="login-logo"
        />
      </div>

      {/* Área de cadastro */}
      <div className="login-content">
        <h1>Crie sua conta</h1>
        <h2>Bem-vindo ao Observatório - Dirjusp</h2>
        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className="login-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            className="login-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirme sua senha"
            className="login-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        <p className="login-footer">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
