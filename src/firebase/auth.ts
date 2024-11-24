import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Usuário deslogado com sucesso.");
  } catch (error) {
    console.error("Erro ao deslogar:", error);
  }
};
