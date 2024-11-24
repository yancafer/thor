import React, { useState } from "react";
import { saveProcess } from "../../firebase/processes";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
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

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    await saveProcess(user.uid, formData);
    alert("Processo cadastrado com sucesso!");
    navigate("/homepage");
  };

  return (
    <div className="register-page">
      <Sidebar />
      <div className="create-process">
        <h1 className="form-title">Cadastro de Processos - SEI</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="number">Número do processo *</label>
              <input
                id="number"
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Digite o número"
                required
              />
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
                required
              />
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
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="creationDate">Data de criação *</label>
              <input
                id="creationDate"
                type="date"
                name="creationDate"
                value={formData.creationDate}
                onChange={handleChange}
                required
              />
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

          <button type="submit" className="submit-button">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
