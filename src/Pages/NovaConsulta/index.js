import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { db } from '../../firebaseConnection';
import { collection, addDoc, Timestamp, onSnapshot } from 'firebase/firestore'
import './NovaConsulta.css';
import DatePicker from "react-datepicker";
import { ptBR } from 'date-fns/locale';




export default function NovaConsulta() {
  const [nome, setNome] = useState('');
  const [data, setData] = useState(null);
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [datasOcupadas, setDatasOcupadas] = useState([]);


  
  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'consultas'), (snapshot) => {
    const ocupadas = snapshot.docs.map(doc => doc.data().data.toDate().toISOString().slice(0,16));
    setDatasOcupadas(ocupadas);
  });

  return () => unsubscribe();
}, []);




  const formatDocumento = (value) => {
    value = value.replace(/\D/g, '').slice(0, 14);
    if (value.length <= 11) {
      // CPF: 999.999.999-99
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ: 99.999.999/9999-99
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  const handleDocumentoChange = (e) => {
    setDocumento(formatDocumento(e.target.value));
  };

  const formatTelefone = (value) => {
  value = value.replace(/\D/g, '').slice(0, 11);
  if (value.length > 0) value = '(' + value;
  if (value.length > 3) value = value.slice(0, 3) + ') ' + value.slice(3);
  if (value.length > 10) value = value.slice(0, 10) + '-' + value.slice(10);
  else if (value.length > 6) value = value.slice(0, 9) + '-' + value.slice(9);
  return value;
};

const handleTelefoneChange = (e) => {
  setTelefone(formatTelefone(e.target.value));
};

const handleNomeChange = (e) => {
    const value = e.target.value;
    setNome(value.replace(/\b\w/g, l => l.toUpperCase()));
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  // Validação de horário
const hora = data.getHours();
const minutos = data.getMinutes();
const diaSemana = data.getDay();

if (diaSemana === 0) {
  setMensagem('As consultas não estão disponíveis aos domingos.');
  setLoading(false);
  return;
}

if (hora < 8 || hora >= 20 || minutos !== 0) {
  alert('Horário inválido. Selecione um horário entre 08h e 20h.');
  setMensagem('Horário inválido. Selecione um horário entre 08h e 20h.');
  setLoading(false);
  return;
}
  setMensagem('');

  if (!nome || !data || !documento || !email) {
    setMensagem('Preencha todos os campos obrigatórios.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setMensagem('Digite um e-mail válido.');
    return;
  }

  setLoading(true);

  try {
    
    const resp = await fetch('http://localhost:3333/api/pagamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeProduto: "Consulta Médica",
        preco: 100,
        idCliente: documento.replace(/\D/g, '')
      })
    });

    const dataResp = await resp.json();

    if (!dataResp.link) {
      setMensagem('Erro ao gerar link de pagamento.');
      setLoading(false);
      return;
    }

    

    const novoDoc = {
      nome,
      email,
      mensagem,
      telefone,
      documento: documento.replace(/\D/g, ''),
      status: 'Pendente',
      data: Timestamp.fromDate(data), // usa a data escolhida
      linkPagamento: dataResp.link,
    };

    
    await addDoc(collection(db, 'consultas'), novoDoc);

    
    window.location.href = dataResp.link;

  } catch (error) {
    console.error(error);
    setMensagem('Erro ao processar o pagamento.');
  }

  setLoading(false);
};

  return (
    <div className="nova-consulta-form-container">
      <h2>Nova Consulta</h2>
      <form className="nova-consulta-form" onSubmit={handleSubmit}>

        <label>
          Nome*:
          <input
            type="text"
            value={nome}
            onChange={handleNomeChange}
            required
            maxLength={35}
          />
        </label>

        <label>
        Data*:

<DatePicker
  selected={data}
  onChange={(date) => setData(date)}
  showTimeSelect
  timeFormat="HH:mm"
  timeIntervals={60}
  timeCaption="Horário"
  dateFormat="dd/MM/yyyy HH:mm"
  minDate={new Date()}
  filterDate={(date) => date.getDay() !== 0}
  filterTime={(time) => {
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const formatted = time.toISOString().slice(0, 16);
    return (
      hour >= 8 &&
      hour < 20 &&
      minutes === 0 &&
      !datasOcupadas.includes(formatted)
    );
  }}
  placeholderText="Selecione a data e hora"
  required
  onKeyDown={(e) => e.preventDefault()}
  locale={ptBR}
/>

        </label>

        
        <label>
          Email*:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

           <label>
          Telefone*:
          <input
            type="tel"
            value={telefone}
            onChange={handleTelefoneChange}
            required
          />
        </label>

        <label>
          Número do Documento*:
          <input
            type="text"
            value={documento}
            onChange={handleDocumentoChange}
            required
            placeholder="CPF ou CNPJ"
            maxLength={18}
          />
        </label>
        <button type="submit" disabled={loading}>
           {loading ? 'Redirecionando...' : 'Pagar e Confirmar Consulta'}
        </button>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </form>
    </div>
  )
};