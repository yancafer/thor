import { Link } from "react-router-dom";
import styles from './home.module.css';
import Footer from "../../components/Footer";

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.buttonBox}>
        <h1 className={styles.textTitle}>Bem-vindo ao Thor!</h1>
        <h4 className={styles.textSubtitle}>Sistema para controle de processos</h4>
        <p>Escolha uma das opções abaixo para continuar:</p>
        <div className={styles.buttonGroup}>
          <Link to="/login" className={styles.btnLogin}>Login</Link>
          <Link to="/signup" className={styles.btnRegister}>Cadastrar</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
