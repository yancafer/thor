import React, { useState, useEffect } from "react";
import styles from "./processTable.module.css";
import { Process } from "../../utils/processUtils";
import { Settings } from "lucide-react";
import Pagination from "../Pagination/Pagination";

interface ProcessTableProps {
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
  selectedProcesses: string[];
  setSelectedProcesses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedProcess: Process | null;
  setSelectedProcess: React.Dispatch<React.SetStateAction<Process | null>>;
}

const ProcessTable: React.FC<ProcessTableProps> = ({
  processes,
  setProcesses,
  selectedProcesses,
  setSelectedProcesses,
  selectedProcess,
  setSelectedProcess
}) => {
  const [visibleItems, setVisibleItems] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

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
  const currentData = processes.slice((currentPage - 1) * visibleItems, currentPage * visibleItems);

  const handleEditProcess = (process: Process) => {
    setSelectedProcess(process);
  };

  const handleSelectProcess = (processId: string) => {
    setSelectedProcesses((prev) =>
      prev.includes(processId)
        ? prev.filter((id) => id !== processId)
        : [...prev, processId]
    );
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
              <div className={styles.processNumber}>{process.number}</div>

              <p><strong>Assunto:</strong> {process.subject}</p>

              <div className={styles.processDates}>
                <p><strong>Criado:</strong> {process.creationDate}</p>
                <p><strong>Recebido:</strong> {process.receivedDate}</p>
                <p><strong>Enviado:</strong> {process.sentDate}</p>
              </div>
            </div>

            {/* Botões de ação */}
            <div className={styles.actionButtons}>
              <span className={`${styles.statusText} ${
                process.status === "Em andamento"
                  ? styles.statusEmAndamento
                  : process.status === "Finalizado"
                  ? styles.statusFinalizado
                  : styles.statusEnviado
              }`}>
                {process.status}
              </span>
              <button onClick={() => handleEditProcess(process)} className={styles.editButton}>
                <Settings size={20} />
              </button>
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
