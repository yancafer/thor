import React, { useState } from "react";
import dirjuspLogo from '../../assets/dirjusp.png';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    const errors: { [key: string]: string } = {};
    const { email, password, confirmPassword } = formData;

    // Sanitização
    const sanitizedEmail = DOMPurify.sanitize(email);
    setFormData((prev) => ({ ...prev, email: sanitizedEmail }));

    // Validações
    if (!sanitizedEmail.match(/\S+@\S+\.\S+/)) {
      errors.email = "Formato de e-mail inválido.";
    }
    if (password.length < 8 || !/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
      errors.password =
        "A senha deve ter pelo menos 8 caracteres, incluindo letras e números.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem.";
      toast.error("As senhas não coincidem. Verifique e tente novamente.", {
        position: "top-right",
      });
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpa erros ao alterar o campo
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      toast.error("Por favor, corrija os erros antes de continuar.", {
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    const { email, password } = formData;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Usuário criado com sucesso!", { position: "top-right" });
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setErrors((prev) => ({
          ...prev,
          email: "Este e-mail já está cadastrado.",
        }));
        toast.error("E-mail já cadastrado. Use outro ou faça login.", {
          position: "top-right",
        });
      } else {
        toast.error("Erro ao criar conta. Tente novamente mais tarde.", {
          position: "top-right",
        });
      }
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
        <h1>Crie sua conta</h1>
        <h2>Bem-vindo ao Observatório - Dirjusp</h2>
        <form className="login-form" onSubmit={handleRegister} noValidate>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className={`login-input ${errors.email ? "error" : ""}`}
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Senha"
            className={`login-input ${errors.password ? "error" : ""}`}
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirme sua senha"
            className={`login-input ${errors.confirmPassword ? "error" : ""}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}

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
