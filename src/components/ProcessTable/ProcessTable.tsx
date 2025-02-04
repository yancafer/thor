import React, { useState, useEffect } from "react";
import styles from "./processTable.module.css";
import { Process } from "../../utils/processUtils";
import { Settings, Edit, Save, X } from "lucide-react";
import Pagination from "../Pagination/Pagination";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, updateDoc, getDocs, collection, addDoc, getDoc } from "firebase/firestore";
import { saveProcess } from "../../firebase/processes";

interface ProcessTableProps {
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
  selectedProcesses: string[];
  setSelectedProcesses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedProcess: Process | null;
  setSelectedProcess: React.Dispatch<React.SetStateAction<Process | null>>;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};

const ProcessTable: React.FC<ProcessTableProps> = ({
  processes,
  setProcesses,
  selectedProcesses,
  setSelectedProcesses,
  setSelectedProcess
}) => {
  const [visibleItems, setVisibleItems] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [editedValues, setEditedValues] = useState<Process | null>(null);

  useEffect(() => {
    const updateVisibleItems = () => {
      const screenHeight = window.innerHeight;
      if (screenHeight > 900) {
        setVisibleItems(6);
      } else if (screenHeight > 700) {
        setVisibleItems(4);
      } else if (screenHeight > 500) {
        setVisibleItems(2);
      } else {
        setVisibleItems(4);
      }
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  const totalPages = Math.ceil(processes.length / visibleItems);
  const sortedProcesses = [...processes].sort(
    (a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
  );
  const currentData = sortedProcesses.slice((currentPage - 1) * visibleItems, currentPage * visibleItems);


  const handleEditProcess = (process: Process) => {
    setEditingProcess(process);
    setEditedValues({ ...process });
  };

  const handleSaveProcess = async () => {
    if (!editedValues) return;

    console.log("📌 ID do documento a ser atualizado:", editedValues.id);

    const user = auth.currentUser;
    if (!user) {
      console.error("❌ Usuário não autenticado. Abortando atualização.");
      return;
    }

    try {
      const processRef = doc(db, "users", user.uid, "processes", editedValues.id);
      const docSnap = await getDoc(processRef);

      if (!docSnap.exists()) {
        console.warn("⚠ Documento não encontrado. Criando um novo...");
        const { id, ...processData } = editedValues;
        const newId = await saveProcess(user.uid, processData);

        if (!newId) {
          console.error("❌ Erro ao obter ID do documento.");
          return;
        }

        setProcesses((prev) => [...prev, { ...processData, id: newId }]);
        return;
      }

      // Atualiza o documento existente
      await updateDoc(processRef, {
        number: editedValues.number,
        subject: editedValues.subject,
        creationDate: editedValues.creationDate,
        receivedDate: editedValues.receivedDate,
        sentDate: editedValues.sentDate,
      });

      console.log("✅ Documento atualizado com sucesso!");

      setProcesses((prev) =>
        prev.map((p) => (p.id === editedValues.id ? editedValues : p))
      );

      setEditingProcess(null);
      setEditedValues(null);
    } catch (error) {
      console.error("❌ Erro ao salvar no Firestore:", error);

      if (error instanceof Error) {
        alert(`Erro ao salvar no Firestore: ${error.message}`);
      } else {
        alert("Erro desconhecido ao salvar no Firestore.");
      }
    }
  };

  const fetchProcesses = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("❌ Usuário não autenticado. Abortando busca.");
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, "users", user.uid, "processes"));
      let fetchedProcesses = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          number: data.number || "",
          subject: data.subject || "",
          creationDate: data.creationDate || "",
          receivedDate: data.receivedDate || "",
          sentDate: data.sentDate || "",
          link: data.link || "",
          status: data.status || "Em andamento",
        };
      });

      // Ordenação correta pelo mais recente primeiro
      fetchedProcesses.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

      console.log("✅ Processos carregados e ordenados:", fetchedProcesses);

      // Garantindo que o estado sempre reflete a ordenação correta
      setProcesses([...fetchedProcesses]);

    } catch (error) {
      console.error("❌ Erro ao buscar processos:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProcess(null);
    setEditedValues(null);
  };

  const handleChange = (field: keyof Process, value: string) => {
    setEditedValues((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSelectProcess = (processId: string) => {
    setSelectedProcesses((prev) =>
      prev.includes(processId)
        ? prev.filter((id) => id !== processId)
        : [...prev, processId]
    );
  };

  const handleCreateProcess = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("❌ Usuário não autenticado. Abortando criação.");
      return;
    }

    const newProcess = {
      number: "12345",
      subject: "Novo Processo",
      creationDate: new Date().toISOString(),
      receivedDate: "",
      sentDate: "",
      link: "",
      status: "Em andamento",
    };

    try {
      const id = await saveProcess(user.uid, newProcess);

      if (!id) {
        console.error("❌ Erro ao obter ID do documento.");
        return;
      }
      setProcesses((prev) => [{ ...newProcess, id }, ...prev]);

      console.log("✅ Processo criado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao criar o processo:", error);
    }
  };

  return (
    <div className={styles.processContainer}>
      {currentData.length > 0 ? (
        currentData.map((process) => (
          <div key={process.id} className={styles.processCard}>
            {/* Checkbox para seleção */}
            <input
              type="checkbox"
              checked={selectedProcesses.includes(process.id)}
              onChange={() => handleSelectProcess(process.id)}
              className={styles.checkbox}
            />

            {/* Informações principais */}
            <div className={styles.processDetails}>
              {editingProcess?.id === process.id ? (
                <>
                  <input
                    type="text"
                    value={editedValues?.number || ""}
                    onChange={(e) => handleChange("number", e.target.value)}
                    className={styles.inputField}
                  />
                  <input
                    type="text"
                    value={editedValues?.subject || ""}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className={styles.inputField}
                  />
                  <div className={styles.processDates}>
                    <input
                      type="date"
                      value={editedValues?.creationDate || ""}
                      onChange={(e) => handleChange("creationDate", e.target.value)}
                      className={styles.inputField}
                    />
                    <input
                      type="date"
                      value={editedValues?.receivedDate || ""}
                      onChange={(e) => handleChange("receivedDate", e.target.value)}
                      className={styles.inputField}
                    />
                    <input
                      type="date"
                      value={editedValues?.sentDate || ""}
                      onChange={(e) => handleChange("sentDate", e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.processNumber}>
                    {process.link ? (
                      <a href={process.link} target="_blank" rel="noopener noreferrer" className={styles.processLink}>
                        {process.number}
                      </a>
                    ) : (
                      process.number
                    )}
                  </div>

                  <p><strong></strong> {process.subject}</p>
                  <div className={styles.processDates}>
                    <p><strong>Criado:</strong> {formatDate(process.creationDate)}</p>
                    <p><strong>Recebido:</strong> {formatDate(process.receivedDate)}</p>
                    <p><strong>Enviado:</strong> {formatDate(process.sentDate)}</p>
                  </div>

                </>
              )}
            </div>

            <div className={styles.actionButtons}>
              <span className={`${styles.statusText} ${process.status === "Em andamento"
                ? styles.statusEmAndamento
                : process.status === "Finalizado"
                  ? styles.statusFinalizado
                  : styles.statusEnviado
                }`}>
                {process.status}
              </span>

              <button onClick={() => setSelectedProcess(process)} className={styles.editButton}>
                <Settings size={20} />
              </button>

              {editingProcess?.id === process.id ? (
                <>
                  <button onClick={handleSaveProcess} className={styles.editButton}>
                    <Save size={20} />
                  </button>
                  <button onClick={handleCancelEdit} className={styles.editButton}>
                    <X size={20} />
                  </button>
                </>
              ) : (
                <button onClick={() => handleEditProcess(process)} className={styles.editButton}>
                  <Edit size={20} />
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className={styles.tableEmpty}>Nenhum processo encontrado.</p>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default ProcessTable;
