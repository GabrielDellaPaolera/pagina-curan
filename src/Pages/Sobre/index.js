import React, { useEffect, useState } from 'react';
import './sobre.css';
import ImagemPerfil from '../../assets/doctor.png'; // ajuste o caminho se necessário

const textoApresentacao = `Olá, sou o Dr. Gabriel Curan, médico psiquiatra dedicado ao cuidado integral da saúde mental. 
Com experiência em atendimento humanizado, busco oferecer acolhimento, escuta ativa e tratament.`;

export default function Sobre() {
  const [texto, setTexto] = useState('');


   useEffect(() => {
  let i = 0;
  const interval = setInterval(() => {
    const nextChar = textoApresentacao[i];
    if (nextChar !== undefined) {
      setTexto((prev) => prev + nextChar);
      i++;
    } else {
      clearInterval(interval);
    }
  }, 25);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="sobre-container">
      <div className="sobre-img">
        <img src={ImagemPerfil} alt="Dr. Gabriel Curan" />
      </div>
      <div className="sobre-texto">
        <h1>Sobre Mim</h1>
        <p className="typewriter">{texto}</p>
      </div>
    </div>
  );
}