import React, { useEffect, useState } from 'react';
import './contato.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaFax, FaEnvelope } from 'react-icons/fa';
import { db } from '../../firebaseConnection';
import { collection, addDoc, Timestamp } from 'firebase/firestore';



export default function Contato() {
  const [showBoxes, setShowBoxes] = useState([false, false, false, false]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setMensagem('Digite um e-mail válido.');
    return;
  }

    if (!nome.trim() || !email.trim() || !mensagem.trim()) {
      setStatus('Preencha todos os campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'mensagens'), {
        nome,
        email,
        mensagem,
        data: Timestamp.now(),
      });
      alert('Mensagem enviada com sucesso!');
      setStatus('Mensagem enviada com sucesso!');
      setNome('');
      setEmail('');
      setMensagem('');
    } catch (error) {
      setStatus('Erro ao enviar mensagem. Tente novamente.');
    }
  };

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
          <p><br />Foz do Iguaçu - PR</p>
        </div>
        <div className={`contato-box${showBoxes[1] ? ' show' : ''}`}>
          <FaPhoneAlt className="contato-icon" />
          <h3>CELULAR</h3>
          <p>(45) 9806-7576<br />Seg a Sex, 8h às 18h</p>
        </div>
        <div className={`contato-box${showBoxes[2] ? ' show' : ''}`}>
          <FaFax className="contato-icon" />
          <h3>TELEFONE</h3>
          <p>(45) 1234-5678</p>
        </div>
        <div className={`contato-box${showBoxes[3] ? ' show' : ''}`}>
          <FaEnvelope className="contato-icon" />
          <h3>EMAIL</h3>
          <p>gcuran@gmail.com</p>
        </div>
      </div>
      <div className="contato-form">
        <h1>Entre em contato</h1>
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Seu nome"
            required
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
          <input
            type="email"
            placeholder="Seu e-mail"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Sua mensagem"
            required
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
          />
          <button type="submit">ENVIAR</button>
          {status && <p style={{ marginTop: 10 }}>{status}</p>}
        </form>
      </div>
    </div>
  );
}