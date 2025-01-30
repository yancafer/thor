import React from "react";
import styles from "./pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null; // Não exibir paginação se houver apenas uma página

  return (
    <div className={styles.pagination}>
      <button 
        className={styles.pageButton} 
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ""}`}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button 
        className={styles.pageButton} 
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>
    </div>
  );
};

export default Pagination;
