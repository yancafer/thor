import React from "react";
import styles from "./modalEditStatus.module.css";
import { Process } from "../../utils/processUtils";
import { updateProcessStatus } from "../../utils/processUtils"; // Importa a função para salvar no banco

interface ModalEditStatusProps {
  selectedProcess: Process | null;
  setSelectedProcess: React.Dispatch<React.SetStateAction<Process | null>>;
  newStatus: string;
  setNewStatus: React.Dispatch<React.SetStateAction<string>>;
  user: any;
  fetchProcesses: () => void;
}

const ModalEditStatus: React.FC<ModalEditStatusProps> = ({
  selectedProcess,
  setSelectedProcess,
  newStatus,
  setNewStatus,
  user,
  fetchProcesses,
}) => {
  if (!selectedProcess) return null;

  const handleSaveStatus = async () => {
    if (!selectedProcess || !user) return;

    try {
      await updateProcessStatus(user.uid, selectedProcess.id, newStatus, fetchProcesses);
      setSelectedProcess(null); // Fecha o modal após salvar
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Editar Status</h3>
        
        <select
          className={styles.modalSelect}
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="Em andamento">Em andamento</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Enviado">Enviado</option>
        </select>

        <div className={styles.modalActions}>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={() => setSelectedProcess(null)}
          >
            Cancelar
          </button>
          <button
            className={`${styles.modalButton} ${styles.saveButton}`}
            onClick={handleSaveStatus}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditStatus;
