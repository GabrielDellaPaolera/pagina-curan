import React, { useEffect, useState } from 'react';
import './contato.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaFax, FaEnvelope } from 'react-icons/fa';

export default function Contato() {
  const [showBoxes, setShowBoxes] = useState([false, false, false, false]);

  useEffect(() => {
    // Efeito para mostrar os quadrados um a um
    showBoxes.forEach((_, i) => {
      setTimeout(() => {
        setShowBoxes(prev => {
          const updated = [...prev];
          updated[i] = true;
          return updated;
        });
      }, 300 * i);
    });
  }, []);

  return (
    <div className="contato-container">
      <div className="contato-info">
        <div className={`contato-box${showBoxes[0] ? ' show' : ''}`}>
          <FaMapMarkerAlt className="contato-icon" />
          <h3>ENDEREÇO</h3>
          <p>Rua Exemplo, 123<br />São Paulo - SP</p>
        </div>
        <div className={`contato-box${showBoxes[1] ? ' show' : ''}`}>
          <FaPhoneAlt className="contato-icon" />
          <h3>TELEFONE</h3>
          <p>(11) 99999-9999<br />Seg a Sex, 8h às 18h</p>
        </div>
        <div className={`contato-box${showBoxes[2] ? ' show' : ''}`}>
          <FaFax className="contato-icon" />
          <h3>FAX</h3>
          <p>(11) 1234-5678</p>
        </div>
        <div className={`contato-box${showBoxes[3] ? ' show' : ''}`}>
          <FaEnvelope className="contato-icon" />
          <h3>EMAIL</h3>
          <p>contato@drgabrielcuran.com</p>
        </div>
      </div>
      <div className="contato-form">
        <h1>Entre em contato</h1>
        <form>
          <input type="text" placeholder="Seu nome" required />
          <input type="email" placeholder="Seu e-mail" required />
          <textarea placeholder="Sua mensagem" required />
          <button type="submit">ENVIAR</button>
        </form>
      </div>
    </div>
  );
}