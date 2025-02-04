import React, { useEffect, useState } from "react";
import styles from "./homePage.module.css";
import { auth } from "../../firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Sidebar from "../../components/Sidebar/Sidebar";
import { toast } from "react-toastify";
import {
  Process,
  fetchProcesses,
  deleteSelectedProcesses,
  updateSelectedProcessesStatus,
} from "../../utils/processUtils";
import Filters from "../../components/Filters/Filters";
import ProcessTable from "../../components/ProcessTable/ProcessTable";
import ModalEditStatus from "../../components/Modal/ModalEditStatus";

const Dashboard: React.FC = () => {
  const [user] = useAuthState(auth);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (user?.uid) {
      fetchProcesses(user.uid, setProcesses, setFilteredProcesses);
    }
  }, [user]);

  useEffect(() => {
    let filtered;
  
    if (selectedFilter === "") {
      // 🚀 Mostra todos os processos e aplica pesquisa
      filtered = processes.filter((process) =>
        process.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // 🔍 Aplica o filtro de status e pesquisa
      filtered = processes.filter((process) =>
        (process.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
        process.status === selectedFilter
      );
    }
  
    // 🚀 Sempre mantém a ordenação do mais recente para o mais antigo
    filtered.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  
    setFilteredProcesses(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedFilter, processes]);     

  const handleDeleteSelected = async () => {
    if (user?.uid && selectedProcesses.length > 0) {
      try {
        await deleteSelectedProcesses(user.uid, selectedProcesses, () => {
          fetchProcesses(user.uid!, setProcesses, setFilteredProcesses);
          setSelectedProcesses([]); // Reseta a seleção após a remoção
        });
      } catch (error) {
        toast.error("Erro ao remover processos.");
        console.error("Erro ao deletar processos:", error);
      }
    }
  };

  const handleChangeStatusSelected = () => {
    if (user?.uid && newStatus) {
      updateSelectedProcessesStatus(user.uid, selectedProcesses, newStatus, () => {
        fetchProcesses(user.uid!, setProcesses, setFilteredProcesses);
        setSelectedProcesses([]);
      });
    }
  };

  const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage);
  const currentData = filteredProcesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.dashboard}>
      <Sidebar />

      <main className={styles.mainContent}>
        <section className={styles.searchFilterSection}>
          <input
            type="text"
            placeholder="Pesquisar processo"
            className={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
        </section>
        <section className={styles.actionButtonsSection}>
          <button
            className={styles.deleteGroupButton}
            onClick={handleDeleteSelected}
            disabled={selectedProcesses.length === 0} // Desabilita se nada estiver selecionado
          >
            Remover Selecionados
          </button>
        </section>
        

        <ProcessTable
          processes={filteredProcesses}
          setProcesses={setProcesses}
          setFilteredProcesses={setFilteredProcesses} // Adicionado
          selectedProcesses={selectedProcesses}
          setSelectedProcesses={setSelectedProcesses}
          selectedProcess={selectedProcess}
          setSelectedProcess={setSelectedProcess}
        />


        {selectedProcess && (
          <ModalEditStatus
            selectedProcess={selectedProcess}
            setSelectedProcess={setSelectedProcess}
            newStatus={newStatus}
            setNewStatus={setNewStatus}
            user={user}
            fetchProcesses={() => fetchProcesses(user?.uid!, setProcesses, setFilteredProcesses)}
          />
        )}

      </main>
    </div>
  );
};

export default Dashboard;
