import React, { useState } from "react";
import { saveProcess } from "../../firebase/processes";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import DOMPurify from "dompurify";
import "./styles.css";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    number: "",
    link: "",
    subject: "",
    creationDate: "",
    receivedDate: "",
    sentDate: "",
    status: "Em andamento",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const sanitizedNumber = DOMPurify.sanitize(formData.number);

    // Validações
    if (!sanitizedNumber.match(/^[0-9./-]+$/)) {
      newErrors.number =
        "O número do processo deve conter apenas números, pontos (.), barras (/) e hífens (-).";
    }
    if (!formData.link.match(/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/)) {
      newErrors.link = "O link do processo deve ser uma URL válida.";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "O assunto não pode estar vazio.";
    }
    if (!formData.creationDate) {
      newErrors.creationDate = "A data de criação é obrigatória.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpa o erro ao alterar o campo
  };

  const checkIfProcessExists = async () => {
    if (!user) return false;

    const processesRef = collection(db, "users", user.uid, "processes");
    const q = query(processesRef, where("number", "==", formData.number));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Retorna true se o processo já existe
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const processExists = await checkIfProcessExists();
      if (processExists) {
        setErrors({ number: "Este número de processo já está cadastrado." });
        setIsLoading(false);
        return;
      }

      // Sanitiza os dados do formulário
      const sanitizedData = {
        ...formData,
        number: DOMPurify.sanitize(formData.number),
        link: DOMPurify.sanitize(formData.link),
        subject: DOMPurify.sanitize(formData.subject),
      };

      await saveProcess(user.uid, sanitizedData);
      alert("Processo cadastrado com sucesso!");
      navigate("/homepage");
    } catch (err) {
      console.error("Erro ao salvar o processo:", err);
      alert("Erro ao salvar o processo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Sidebar />
      <div className="create-process">
        <h1 className="form-title">Cadastro de Processos - SEI</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="number">Número do processo *</label>
              <input
                id="number"
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Ex: 0009.016882.00112/2024-36"
                className={errors.number ? "error" : ""}
                required
              />
              {errors.number && <p className="error-message">{errors.number}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="link">Link do processo *</label>
              <input
                id="link"
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="Cole o link"
                className={errors.link ? "error" : ""}
                required
              />
              {errors.link && <p className="error-message">{errors.link}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject">Assunto *</label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Digite o assunto"
                className={errors.subject ? "error" : ""}
                required
              />
              {errors.subject && (
                <p className="error-message">{errors.subject}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="creationDate">Data de criação *</label>
              <input
                id="creationDate"
                type="date"
                name="creationDate"
                value={formData.creationDate}
                onChange={handleChange}
                className={errors.creationDate ? "error" : ""}
                required
              />
              {errors.creationDate && (
                <p className="error-message">{errors.creationDate}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="receivedDate">Data de recebimento</label>
              <input
                id="receivedDate"
                type="date"
                name="receivedDate"
                value={formData.receivedDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="sentDate">Data de envio</label>
              <input
                id="sentDate"
                type="date"
                name="sentDate"
                value={formData.sentDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Em andamento">Em andamento</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Enviado">Enviado</option>
            </select>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
