import React, { useEffect, useState,useMemo } from 'react';
import './home.css';
import ImagemPerfil from '../../assets/doctor.png'; // Certifique-se de que o caminho está correto
import { FaChevronRight,FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DepressaoImagem from '../../assets/backgroundImageDivTwoDepressao.png'; // Imagem de exemplo para depressão
import AnsiedadeImagem from '../../assets/backgroundImageDivTwoAnsiedade.png'; // Imagem de exemplo para depressão
import TranstornoImagem from '../../assets/backgroundImageDivTwoTranstorno.png'; // Imagem de exemplo para depressão
import TdahImagem from '../../assets/backgroundImageDivTwoTdah.png'; // Imagem de exemplo para depressão
import { useRef } from 'react';



export default function Home() {
  
  const [scrolled, setScrolled] = useState(false);


    const treatments = useMemo(() => [
  {
    image: DepressaoImagem,
    title: 'Depressão',
    description: ' Oferecemos tratamento humanizado para depressão, com avaliação detalhada, acompanhamento clínico regular e suporte psicoterápico personalizado. Nosso objetivo é promover a recuperação do bem-estar emocional, restaurar a qualidade de vida e fortalecer a autonomia do paciente ao longo de todo o processo terapêutico.'
  },
  {
    image: AnsiedadeImagem,
    title: 'Ansiedade',
    description: ' Realizamos uma abordagem moderna e integrada para transtornos de ansiedade, combinando intervenções clínicas, psicoterapia e orientações práticas para o dia a dia. Buscamos reduzir sintomas, prevenir recaídas e proporcionar mais equilíbrio, autoconfiança e qualidade de vida aos nossos pacientes.'
  },
  {
    image: TdahImagem,
    title: 'TDAH',
    description: ' Acompanhamento especializado para TDAH em adultos e adolescentes, com diagnóstico criterioso, intervenções clínicas e psicoterapêuticas, além de orientações para familiares. O tratamento visa melhorar o foco, a organização, o desempenho acadêmico/profissional e a qualidade das relações interpessoais.'
  },
  {
    image: TranstornoImagem,
    title: 'Transtorno Bipolar',
    description: ' Oferecemos diagnóstico preciso e tratamento contínuo para o transtorno bipolar, com foco na estabilização do humor, prevenção de episódios e promoção da autonomia. O acompanhamento é individualizado, visando o controle dos sintomas e o desenvolvimento de estratégias para uma vida mais estável e produtiva.'
  }
], []);


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

const imageRef = useRef(null);

useEffect(() => {
  const onScroll = () => {
    if (imageRef.current) {
      if (window.scrollY > 150) {
        imageRef.current.classList.add('image-out');
      } else {
        imageRef.current.classList.remove('image-out');
      }
    }
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
  }, 60);

  return () => clearInterval(interval);
}, [currentTreatment,treatments]);



// Efeito para trocar o tratamento atual a cada 6 segundos

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTreatment((prev) =>
      prev === treatments.length - 1 ? 0 : prev + 1
    );
  }, 30000); // troca a cada 30 segundos (ajuste como quiser)
  return () => clearInterval(interval);
}, [treatments.length]);

  return (
    <div className="home-container">
      {/* Seção principal */}
      <div className="main-section">
       <div className="image-section" ref={imageRef}>
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
    <p className={`typewriter${isTyping ? ' typing' : ''}`}>{typedText}</p>
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