import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const saveProcess = async (userId: string, process: {
  number: string;
  subject: string;
  creationDate: string;
  receivedDate: string;
  sentDate: string;
  status: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "processes"), process);
    console.log("Processo salvo com ID:", docRef.id);
  } catch (error) {
    console.error("Erro ao salvar processo:", error);
  }
};
