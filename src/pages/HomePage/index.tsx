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
import Pagination from "../../components/Pagination/Pagination";
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
    const filtered = processes.filter((process) => {
      // Verifica se o termo de pesquisa está no número ou no assunto
      const matchesSearch =
        process.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.subject.toLowerCase().includes(searchTerm.toLowerCase());

      // Verifica se o status filtrado é compatível
      const matchesStatus = selectedFilter ? process.status === selectedFilter : true;

      return matchesSearch && matchesStatus;
    });

    setFilteredProcesses(filtered);
    setCurrentPage(1); // Reinicia para a primeira página ao mudar os filtros
  }, [searchTerm, selectedFilter, processes]);

  const handleDeleteSelected = () => {
    if (user?.uid) {
      deleteSelectedProcesses(user.uid, selectedProcesses, () => {
        fetchProcesses(user.uid!, setProcesses, setFilteredProcesses);
        setSelectedProcesses([]);
      });
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
        {/* Barra de Pesquisa e Filtros */}
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

        {/* Alteração de Status */}
        <section className={styles.statusSection}>
          <button
            className={styles.deleteGroupButton}
            onClick={handleDeleteSelected}
            disabled={selectedProcesses.length === 0}
          >
            Deletar Selecionados
          </button>
          <select
            className={styles.groupStatusSelect}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            disabled={selectedProcesses.length === 0}
          >
            <option value="">Alterar Status</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Enviado">Enviado</option>
          </select>
          <button
            className={styles.confirmStatusButton}
            onClick={handleChangeStatusSelected}
            disabled={!newStatus || selectedProcesses.length === 0}
          >
            Confirmar
          </button>
        </section>

        {/* Lista de Processos */}
        <ProcessTable
          processes={filteredProcesses}
          setProcesses={setProcesses}
          selectedProcesses={selectedProcesses}
          setSelectedProcesses={setSelectedProcesses}
          selectedProcess={selectedProcess} // Passando corretamente
          setSelectedProcess={setSelectedProcess} // Passando corretamente
        />

        {/* Modal de Edição de Status */}
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
