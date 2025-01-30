import React from "react";
import styles from "./filters.module.css";

interface FiltersProps {
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
}

const Filters: React.FC<FiltersProps> = ({ selectedFilter, setSelectedFilter }) => {
  const filters = ["", "Finalizado", "Em andamento", "Enviado"];

  return (
    <div className={styles.filtersContainer}>
      {filters.map((filter) => (
        <button
          key={filter || "Todos"}
          className={`${styles.filterButton} ${selectedFilter === filter ? styles.active : ""}`}
          onClick={() => setSelectedFilter(filter)}
        >
          {filter || "Todos"}
        </button>
      ))}
    </div>
  );
};

export default Filters;
