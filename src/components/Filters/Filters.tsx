import React from "react";
import styles from "./filters.module.css";

interface FiltersProps {
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
}

const Filters: React.FC<FiltersProps> = ({ selectedFilter, setSelectedFilter }) => {
  const filters = ["Todos", "Finalizado", "Em andamento", "Enviado"];

  return (
    <div className={styles.filtersWrapper}>
      <div className={styles.filtersContainer}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterButton} ${selectedFilter === (filter === "Todos" ? "" : filter) ? styles.active : ""}`}
            onClick={() => setSelectedFilter(filter === "Todos" ? "" : filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );  
};  

export default Filters;
