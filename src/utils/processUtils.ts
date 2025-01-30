import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";

export interface Process {
  id: string;
  number: string;
  link: string;
  subject: string;
  creationDate: string;
  receivedDate: string;
  sentDate: string;
  status: string;
}

/**
 * Função para buscar processos do Firebase Firestore.
 */
export const fetchProcesses = async (
  userId: string,
  setProcesses: (processes: Process[]) => void,
  setFilteredProcesses: (processes: Process[]) => void
) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "processes"));
    const fetchedProcesses: Process[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Process[];

    // Ordenação por data de criação (decrescente)
    fetchedProcesses.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

    setProcesses(fetchedProcesses);
    setFilteredProcesses(fetchedProcesses);
  } catch (error) {
    console.error("Erro ao buscar processos:", error);
    toast.error("Erro ao carregar os processos. Tente novamente!");
  }
};

/**
 * Função para deletar processos selecionados do Firestore.
 */
export const deleteSelectedProcesses = async (userId: string, selectedProcesses: string[], fetchProcesses: () => void) => {
  if (!userId || selectedProcesses.length === 0) return;

  if (window.confirm("Tem certeza que deseja deletar os processos selecionados?")) {
    try {
      for (const processId of selectedProcesses) {
        await deleteDoc(doc(db, "users", userId, "processes", processId));
      }
      toast.success("Processos deletados com sucesso!");
      fetchProcesses();
    } catch (error) {
      console.error("Erro ao deletar processos:", error);
      toast.error("Erro ao deletar processos. Tente novamente!");
    }
  }
};

/**
 * Função para atualizar o status de processos selecionados no Firestore.
 */
export const updateSelectedProcessesStatus = async (
  userId: string,
  selectedProcesses: string[],
  newStatus: string,
  fetchProcesses: () => void
) => {
  if (!userId || selectedProcesses.length === 0 || !newStatus) return;

  if (window.confirm("Tem certeza que deseja alterar o status dos processos selecionados?")) {
    try {
      for (const processId of selectedProcesses) {
        await updateDoc(doc(db, "users", userId, "processes", processId), { status: newStatus });
      }
      toast.success("Status atualizado com sucesso!");
      fetchProcesses();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status. Tente novamente!");
    }
  }
};

/**
 * Função para atualizar o status de um único processo no Firestore.
 */
export const updateProcessStatus = async (
  userId: string,
  processId: string,
  newStatus: string,
  fetchProcesses: () => void
) => {
  if (!userId || !processId || !newStatus) return;

  try {
    await updateDoc(doc(db, "users", userId, "processes", processId), { status: newStatus });
    fetchProcesses(); // Atualiza os processos após salvar
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
  }
};