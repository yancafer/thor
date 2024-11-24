import "./footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer-box">
        © Desenvolvido por NIX - Yanca Fernandes - DIRJUSP | {currentYear}
      </p>
    </footer>
  );
}

export default Footer;
