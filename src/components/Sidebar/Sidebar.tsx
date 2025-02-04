import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import { LogOut } from "lucide-react";
import styles from "./sideBar.module.css";
import UserLogo from "../../assets/avatar.png";

const Sidebar: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/homepage", label: "Controle de Processos" },
    { path: "/createprocess", label: "Cadastro de Processos SEI" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userInfo}>
        <img src={UserLogo} alt="User Avatar" className={styles.avatar} />
        <p className={styles.userEmail}>{user?.email || "Usuário"}</p>
      </div>
      <nav>
        <ul className={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`${styles.menuItem} ${
                location.pathname === item.path ? styles.active : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.logoutContainer}>
        <div className={styles.logoutItem} onClick={handleLogout}>
          <LogOut className={styles.logoutIcon} />
          Deslogar
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
