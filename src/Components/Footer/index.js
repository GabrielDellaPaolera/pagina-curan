import './footer.css';
import { FaInstagram, FaWhatsapp, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import { IoLogoWhatsapp } from 'react-icons/io'; // Novo ícone

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-flex">
        <div className="footer-content">
          <span>© {new Date().getFullYear()} - Todos os direitos reservados.</span>
          <nav>
            <a href="https://www.instagram.com/gcuran" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://wa.me/+554598067576" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href="Contato" target="_blank" rel="noopener noreferrer" aria-label="E-mail">
              <FaEnvelope />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </nav>

        <div className="footer-dev">
          <span>Desenvolvido por Gabriel Paolera</span>
          <a href="https://wa.me/+5511945680221" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Desenvolvedor">
            <IoLogoWhatsapp />
          </a>
        </div>

        </div>

      </div>
    </footer>
  );
}