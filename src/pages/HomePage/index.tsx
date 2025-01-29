import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Sidebar from "../../components/Sidebar/Sidebar";
import { toast } from "react-toastify";

interface Process {
  id: string;
  number: string;
  link: string;
  subject: string;
  creationDate: string;
  receivedDate: string;
  sentDate: string;
  status: string;
}

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
  const itemsPerPage = 8;

  useEffect(() => {
    if (user?.uid) {
      fetchProcesses(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const filtered = processes.filter((process) => {
      const matchesSearch =
        process.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedFilter
        ? process.status === selectedFilter
        : true;
      return matchesSearch && matchesStatus;
    });
    setFilteredProcesses(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedFilter, processes]);

  const fetchProcesses = async (userId: string) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "users", userId, "processes")
      );
      const fetchedProcesses: Process[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Process[];

      // Ordenação por data de criação (decrescente)
      fetchedProcesses.sort((a, b) => {
        const dateA = new Date(a.creationDate).getTime();
        const dateB = new Date(b.creationDate).getTime();
        return dateB - dateA;
      });

      setProcesses(fetchedProcesses);
      setFilteredProcesses(fetchedProcesses);
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
      toast.error("Erro ao carregar os processos. Tente novamente!");
    }
  };

  const handleSelectProcess = (processId: string) => {
    setSelectedProcesses((prev) =>
      prev.includes(processId)
        ? prev.filter((id) => id !== processId)
        : [...prev, processId]
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    setSelectedProcesses(
      isChecked ? filteredProcesses.map((process) => process.id) : []
    );
  };

  const handleDeleteSelected = async () => {
    if (!user) return;

    if (
      window.confirm("Tem certeza que deseja deletar os processos selecionados?")
    ) {
      try {
        for (const processId of selectedProcesses) {
          const processRef = doc(
            db,
            "users",
            user.uid,
            "processes",
            processId
          );
          await deleteDoc(processRef);
        }
        toast.success("Processos deletados com sucesso!");
        fetchProcesses(user.uid);
        setSelectedProcesses([]);
      } catch (error) {
        console.error("Erro ao deletar processos:", error);
        toast.error("Erro ao deletar processos. Tente novamente!");
      }
    }
  };

  const handleChangeStatusSelected = async () => {
    if (!user || !newStatus) return;

    if (
      window.confirm(
        "Tem certeza que deseja alterar o status dos processos selecionados?"
      )
    ) {
      try {
        for (const processId of selectedProcesses) {
          const processRef = doc(
            db,
            "users",
            user.uid,
            "processes",
            processId
          );
          await updateDoc(processRef, { status: newStatus });
        }
        toast.success("Status atualizado com sucesso!");
        fetchProcesses(user.uid);
        setSelectedProcesses([]);
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        toast.error("Erro ao atualizar status. Tente novamente!");
      }
    }
  };

  const handleEditStatus = (process: Process) => {
    setSelectedProcess(process);
    setNewStatus(process.status);
  };

  const handleSaveStatus = async () => {
    if (!selectedProcess || !user) return;

    try {
      const processRef = doc(
        db,
        "users",
        user.uid,
        "processes",
        selectedProcess.id
      );
      await updateDoc(processRef, { status: newStatus });
      toast.success("Status atualizado com sucesso!");
      setSelectedProcess(null);
      fetchProcesses(user.uid);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status. Tente novamente!");
    }
  };

  const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage);
  const currentData = filteredProcesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <header className="header">
          <input
            type="text"
            placeholder="Pesquisar processo"
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        <section className="tabs">
          <button
            className={`tab ${selectedFilter === "" ? "active" : ""}`}
            onClick={() => setSelectedFilter("")}
          >
            Todos
          </button>
          <button
            className={`tab ${selectedFilter === "Finalizado" ? "active" : ""}`}
            onClick={() => setSelectedFilter("Finalizado")}
          >
            Finalizados
          </button>
          <button
            className={`tab ${selectedFilter === "Em andamento" ? "active" : ""}`}
            onClick={() => setSelectedFilter("Em andamento")}
          >
            Em andamento
          </button>
          <button
            className={`tab ${selectedFilter === "Enviado" ? "active" : ""}`}
            onClick={() => setSelectedFilter("Enviado")}
          >
            Enviados
          </button>
        </section>

        <div className="group-actions">
          <button
            className="delete-group-button"
            onClick={handleDeleteSelected}
            disabled={selectedProcesses.length === 0}
          >
            Deletar Selecionados
          </button>
          <select
            className="group-status-select"
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
            className="confirm-status-button"
            onClick={handleChangeStatusSelected}
            disabled={!newStatus || selectedProcesses.length === 0}
          >
            Confirmar
          </button>
        </div>

        <table className="process-table">
          <thead>
            <tr>
              <th className="table-header">
                <input
                  type="checkbox"
                  className="select-all-checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={
                    currentData.length > 0 &&
                    selectedProcesses.length === currentData.length
                  }
                />
              </th>
              <th className="table-header">Número do Processo</th>
              <th className="table-header">Assunto</th>
              <th className="table-header">Criado</th>
              <th className="table-header">Recebido</th>
              <th className="table-header">Enviado</th>
              <th className="table-header">Status</th>
              <th className="table-header">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((process) => (
                <tr key={process.id} className="table-row">
                  <td className="table-cell">
                    <input
                      type="checkbox"
                      className="select-checkbox"
                      checked={selectedProcesses.includes(process.id)}
                      onChange={() => handleSelectProcess(process.id)}
                    />
                  </td>
                  <td className="table-cell">
                    <a
                      href={process.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="process-link"
                    >
                      {process.number} <span className="link-icon">🔗</span>
                    </a>
                  </td>

                  <td className="table-cell">
                    {process.subject.length > 30
                      ? `${process.subject.slice(0, 60)}...`
                      : process.subject}
                  </td>

                  <td className="table-cell">{process.creationDate}</td>
                  <td className="table-cell">{process.receivedDate || "-"}</td>
                  <td className="table-cell">{process.sentDate || "-"}</td>
                  <td className="table-cell">{process.status}</td>
                  <td className="table-cell">
                    <span
                      className="action-edit"
                      onClick={() => handleEditStatus(process)}
                    >
                      ...
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="table-empty" colSpan={8}>
                  Nenhum processo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-button ${currentPage === index + 1 ? "active-page" : ""
                  }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {selectedProcess && (
          <div className="modal">
            <div className="modal-content">
              <h3 className="modal-title">Editar Status</h3>
              <select
                className="modal-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Em andamento">Em andamento</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Enviado">Enviado</option>
              </select>
              <div className="modal-actions">
                <button
                  className="modal-button cancel-button"
                  onClick={() => setSelectedProcess(null)}
                >
                  Cancelar
                </button>
                <button
                  className="modal-button save-button"
                  onClick={handleSaveStatus}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
