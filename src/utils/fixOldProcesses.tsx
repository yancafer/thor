import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";

const fixOldProcesses = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("❌ Usuário não autenticado. Abortando correção.");
    return;
  }

  try {
    const querySnapshot = await getDocs(collection(db, "users", user.uid, "processes"));
    const updates: Promise<void>[] = [];

    querySnapshot.forEach((document) => {
      const data = document.data();

      if (!data.creationDate || isNaN(new Date(data.creationDate).getTime())) {
        const newDate = new Date().toISOString();

        console.log(`🔄 Atualizando processo ${document.id} com nova data: ${newDate}`);

        const processRef = doc(db, "users", user.uid, "processes", document.id);
        updates.push(updateDoc(processRef, { creationDate: newDate }));
      }
    });

    // Aguarda todas as atualizações terminarem
    await Promise.all(updates);
    console.log("✅ Todos os processos antigos foram corrigidos!");

  } catch (error) {
    console.error("❌ Erro ao corrigir processos antigos:", error);
  }
};

export default fixOldProcesses;
