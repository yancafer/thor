import React, { useState } from "react";
import { saveProcess } from "../../firebase/processes";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import DOMPurify from "dompurify";
import styles from "./register.module.css";
import { Process } from "../../utils/processUtils";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    number: "",
    link: "",
    subject: "",
    creationDate: "",
    receivedDate: "",
    sentDate: "",
    status: "Em andamento",
    orderDate: Date.now(),
  });  

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const maxSubjectLength = 160;
  const [processExists, setProcessExists] = useState<boolean | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const sanitizedNumber = DOMPurify.sanitize(formData.number);
    const currentYear = new Date().getFullYear();

    if (!sanitizedNumber.match(/^[0-9./-]+$/)) {
      newErrors.number =
        "O número do processo deve conter apenas números, pontos (.), barras (/) e hífens (-).";
    }
    if (!formData.link.match(/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/)) {
      newErrors.link = "O link do processo deve ser uma URL válida.";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "O assunto não pode estar vazio.";
    } else if (formData.subject.length > maxSubjectLength) {
      newErrors.subject = `O assunto não pode ter mais que ${maxSubjectLength} caracteres.`;
    }
    if (formData.creationDate) {
      const year = parseInt(formData.creationDate.split("-")[0], 10);
      if (isNaN(year) || year < 2010 || year > currentYear) {
        newErrors.creationDate = `Ano inválido. Insira um ano entre 2010 e ${currentYear}.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "subject" && value.length > maxSubjectLength) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Verifica se o número do processo já existe quando atingir 25 caracteres ou mais
    if (name === "number") {
      checkProcessExists(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Verifica se o processo já existe no Firestore
      const processRef = collection(db, "users", user.uid, "processes");
      const querySnapshot = await getDocs(query(processRef, where("number", "==", formData.number)));

      if (!querySnapshot.empty) {
        alert("Este processo já foi cadastrado!");
        setIsLoading(false);
        return;
      }

      await saveProcess(user.uid, { ...formData, orderDate: Date.now() });
      alert("Processo cadastrado com sucesso!");
      navigate("/homepage");
    } catch (err) {
      alert("Erro ao salvar o processo.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkProcessExists = async (processNumber: string) => {
    if (processNumber.length < 25) {
      setProcessExists(null);
      return;
    }

    if (!user) return;

    try {
      const processRef = collection(db, "users", user.uid, "processes");
      const querySnapshot = await getDocs(query(processRef, where("number", "==", processNumber)));

      if (!querySnapshot.empty) {
        setProcessExists(true);
      } else {
        setProcessExists(false);
      }
    } catch (error) {
      console.error("Erro ao verificar processo:", error);
    }
  };


  return (
    <div className={styles.registerPage}>
      <Sidebar />
      <div className={styles.createProcess}>
        <h1 className={styles.formTitle}>Cadastro de Processos - SEI</h1>
        <form onSubmit={handleSubmit} noValidate>

          {/* Número do Processo e Link */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="number">Número do processo *</label>
              <input
                id="number"
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Ex: 0009.016882.00112/2024-36"
                className={`${styles.input} ${errors.number || processExists ? styles.error : ""}`}
                required
              />
              {errors.number && <p className={styles.errorMessage}>{errors.number}</p>}
              {processExists && <p className={styles.errorMessage}>Este processo já está cadastrado.</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="link">Link do processo *</label>
              <input
                id="link"
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="Cole o link"
                className={`${styles.input} ${errors.link ? styles.error : ""}`}
                required
              />
              {errors.link && <p className={styles.errorMessage}>{errors.link}</p>}
            </div>
          </div>

          {/* Assunto agora ocupa toda a linha */}
          <div className={styles.formRow}>
            <div className={styles.formGroupFull}>
              <label className={styles.label} htmlFor="subject">Assunto *</label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Digite o assunto"
                className={`${styles.input} ${errors.subject ? styles.error : ""}`}
                maxLength={maxSubjectLength}
                required
              />
              <p className={styles.charCount}>
                {formData.subject.length}/{maxSubjectLength} caracteres
              </p>
              {errors.subject && <p className={styles.errorMessage}>{errors.subject}</p>}
            </div>
          </div>

          {/* Datas corrigidas */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="creationDate">Data de criação</label>
              <input
                id="creationDate"
                type="date"
                name="creationDate"
                value={formData.creationDate}
                onChange={handleChange}
                className={`${styles.input} ${errors.creationDate ? styles.error : ""}`}
              />
              {errors.creationDate && <p className={styles.errorMessage}>{errors.creationDate}</p>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="receivedDate">Data de recebimento</label>
              <input
                id="receivedDate"
                type="date"
                name="receivedDate"
                value={formData.receivedDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* Data de envio e Status na mesma linha */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="sentDate">Data de envio</label>
              <input
                id="sentDate"
                type="date"
                name="sentDate"
                value={formData.sentDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="Em andamento">Em andamento</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Enviado">Enviado</option>
              </select>
            </div>
          </div>

          {/* Botão centralizado */}
          <div className={styles.formButtonContainer}>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
