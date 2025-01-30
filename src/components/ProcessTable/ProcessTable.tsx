import React, { useState, useEffect } from "react";
import styles from "./processTable.module.css";
import { Process } from "../../utils/processUtils";
import { Settings } from "lucide-react";
import Pagination from "../Pagination/Pagination";
import ModalEditStatus from "../Modal/ModalEditStatus";

interface ProcessTableProps {
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
  selectedProcesses: string[];
  setSelectedProcesses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedProcess: Process | null; // Adicionado aqui
  setSelectedProcess: React.Dispatch<React.SetStateAction<Process | null>>;
}

const ProcessTable: React.FC<ProcessTableProps> = ({
  processes,
  setProcesses,
  selectedProcesses,
  setSelectedProcesses,
  selectedProcess, // Agora está correto
  setSelectedProcess
}) => {

  const [newStatus, setNewStatus] = useState<string>(""); // Apenas o estado do status

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

  const handleSelectProcess = (processId: string) => {
    setSelectedProcesses((prev) =>
      prev.includes(processId)
        ? prev.filter((id) => id !== processId)
        : [...prev, processId]
    );
  };

  const handleEditStatus = (process: Process) => {
    setSelectedProcess(process); // Agora funcionará corretamente
    setNewStatus(process.status);
  };

  const formatDateToBR = (dateString: string) => {
    if (!dateString) return "-"; // Caso a data seja vazia, retorna um traço
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR"); // Converte para o formato brasileiro
  };
  

  return (
    <div className={styles.processContainer}>
      {currentData.length > 0 ? (
        currentData.map((process) => (
          <div key={process.id} className={styles.processCard}>
            <div className={styles.processHeader}>
              {/* Checkbox + Número do Processo alinhados à esquerda */}
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={selectedProcesses.includes(process.id)}
                  onChange={() => handleSelectProcess(process.id)}
                />
                <span className={styles.processNumber}>{process.number}</span>
              </div>

              {/* Criado, Recebido e Enviado agora estão alinhados à direita */}
              <div className={styles.processDetails}>
                <p><strong>Criado:</strong> {formatDateToBR(process.creationDate)}</p>
                <p><strong>Recebido:</strong> {formatDateToBR(process.receivedDate)}</p>
                <p><strong>Enviado:</strong> {formatDateToBR(process.sentDate)}</p>
                <p><strong>Status:</strong> {process.status}</p>
              </div>



              {/* Botão de Edição */}
              <span className={styles.actionEdit} onClick={() => handleEditStatus(process)}>
                <Settings size={20} />
              </span>
            </div>

            {/* Assunto em linha separada */}
            <div className={styles.processBody}>
              <p>
                <strong>Assunto:</strong> {process.subject}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.tableEmpty}>Nenhum processo encontrado.</p>
      )}

      {/* Paginação */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      {/* Modal de Edição de Status */}
      <ModalEditStatus
        selectedProcess={selectedProcess}
        setSelectedProcess={setSelectedProcess}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        user={null} // Certifique-se de passar a prop `user` corretamente!
        fetchProcesses={() => { }}
      />
    </div>
  );
};

export default ProcessTable;
