import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import "./styles.css";
import UserLogo from "../../assets/avatar.png";

const Sidebar: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation(); // Obtém a rota atual

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/homepage", label: "Controle de Processos" },
    { path: "/createprocess", label: "Cadastro de Processos SEI" },
    { path: "", label: "Tutoriais SEI (em breve)", disabled: true },
  ];

  return (
    <aside className="sidebar">
      <div className="user-info">
        <img src={UserLogo} alt="User Avatar" className="avatar" />
        <p className="user-email">{user?.email || "Usuário"}</p>
      </div>
      <nav>
        <ul className="menu-container">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              } ${item.disabled ? "disabled" : ""}`}
              onClick={() => !item.disabled && navigate(item.path)}
            >
              {item.label}
            </li>
          ))}
          <li className="menu-item logout" onClick={handleLogout}>
            Deslogar
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
