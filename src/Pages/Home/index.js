import React, { useEffect, useState } from 'react';
import './home.css';
import ImagemPerfil from '../../assets/doctor.png'; // Certifique-se de que o caminho está correto
import { FaChevronRight,FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DepressaoImagem from '../../assets/backgroundImageDivTwoDepressao.png'; // Imagem de exemplo para depressão

export default function Home() {

  const [scrolled, setScrolled] = useState(false);


    const treatments = [
  {
    image: DepressaoImagem,
    title: 'Depressão',
    description: ' Tratamento humanizado para depressão, com acompanhamento clínico e psicoterápico personalizado.'
  },
  {
    image: 'https://images.unsplash.com/photo-1512070679279-c2f999098c01?auto=format&fit=crop&w=600&q=80',
    title: 'Ansiedade',
    description: ' Abordagem moderna para transtornos de ansiedade, focando em qualidade de vida e bem-estar.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=600&q=80',
    title: 'Transtorno Bipolar',
    description: ' Diagnóstico preciso e tratamento contínuo para estabilização do humor e autonomia do paciente.'
  },
  {
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80',
    title: 'TDAH',
    description: ' Acompanhamento especializado para TDAH em adultos e adolescentes, promovendo foco e organização.'
  }
];

    const reviews = [
    {
      text: "Excelente profissional, muito atencioso e dedicado!",
      author: "Maria S."
    },
    {
      text: "Me senti acolhido desde a primeira consulta. Recomendo!",
      author: "João P."
    },
    {
      text: "Ótimo atendimento e acompanhamento. Profissional exemplar.",
      author: "Ana L."
    }
  ];

  const [currentReview, setCurrentReview] = useState(0);
  const [currentTreatment, setCurrentTreatment] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
    

  const handlePrev = () => {
    setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };




// Efeito para imagem de perfil sair do topo ao rolar a página

useEffect(() => {
    const onScroll = () => {
      // Ajuste o valor conforme desejar para o efeito começar
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);




// Efeito para digitar a descrição do tratamento atual
useEffect(() => {
  const desc = treatments[currentTreatment]?.description;

  if (!desc) return; // Garante que não vai rodar se estiver undefined

  setTypedText('');
  setIsTyping(true);
  let i = 0;

  const interval = setInterval(() => {
    // Evita erro se desc for undefined ou i estiver fora do range
    if (i < desc.length) {
      setTypedText((prev) => prev + desc.charAt(i)); // charAt é mais seguro
      i++;
    } else {
      clearInterval(interval);
      setIsTyping(false);
    }
  }, 25);

  return () => clearInterval(interval);
}, [currentTreatment]);



// Efeito para trocar o tratamento atual a cada 6 segundos

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTreatment((prev) =>
      prev === treatments.length - 1 ? 0 : prev + 1
    );
  }, 6000); // troca a cada 6 segundos (ajuste como quiser)
  return () => clearInterval(interval);
}, [treatments.length]);

  return (
    <div className="home-container">
      {/* Seção principal */}
      <div className="main-section">
       <div className={`image-section ${scrolled ? ' image-out' : ''}`}>
          <img
            src={ImagemPerfil}
            alt="Médico Psiquiatra"
            className="doctor-image"
          />
        </div>
        <div className="info-section">
          <h1>Dr. Gabriel Pontiere Curan</h1>
          <p>
            Atendimento psiquiátrico humanizado para adultos e adolescentes. Diagnóstico, acompanhamento e tratamento de transtornos mentais.
          </p>
          <Link to="/NovaConsulta">
            <button className="schedule-btn">Agendar Consulta</button>
          </Link>
        </div>
      </div>


{/* Seção de ícones e tratamentos */}
<div className="treatments-carousel-section">
  <div className="treatments-carousel">
<div className="treatment-card" style={{ backgroundImage: `url(${treatments[currentTreatment].image})` }}>
  <button
    className="arrow-btn arrow-left"
    onClick={() =>
      setCurrentTreatment((prev) =>
        prev === 0 ? treatments.length - 1 : prev - 1
      )
    }
    aria-label="Anterior"
    type="button"
  >
    <FaChevronLeft />
  </button>
  <button
    className="arrow-btn arrow-right"
    onClick={() =>
      setCurrentTreatment((prev) =>
        prev === treatments.length - 1 ? 0 : prev + 1
      )
    }
    aria-label="Próximo"
    type="button"
  >
    <FaChevronRight />
  </button>
  <div className="treatment-overlay">
    <h3>{treatments[currentTreatment].title}</h3>
    <p className="typewriter">{typedText}</p>
   </div>
  </div>
 </div>
</div>


{/* Seção de reviews */}
<div className="review-container">
  <div className="arrow2-btn arrow2-btn-left" onClick={handlePrev} aria-label="Anterior">
    <FaChevronLeft />
  </div>

  <div className="review-card">
    <h2 className="review-title">Avaliações de Pacientes</h2>

    <div className="review-stars">
      <span>⭐⭐⭐⭐⭐</span>
    </div>

    <p>"{reviews[currentReview].text}"</p>
    <span>- {reviews[currentReview].author}</span>
  </div>

  <div className="arrow2-btn arrow2-btn-right" onClick={handleNext} aria-label="Próximo">
    <FaChevronRight />
  </div>
</div>
</div>
  );
}