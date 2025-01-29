import { Link } from "react-router-dom";
import './styles.css';
import Footer from "../../components/Footer";

function Home() {
  return (
    <div className="container">
      <div className="button-box">
        <h1 className="text-title">Bem-vindo ao Thor!</h1>
        <h4 className="text-subtitle">Sistema para controle de processos</h4>
        <p>Escolha uma das opções abaixo para continuar:</p>
        <div className="button-group">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/signup" className="btn-register">Cadastrar</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
