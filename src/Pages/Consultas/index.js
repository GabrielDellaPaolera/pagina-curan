import React, { useState,useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './consultas.css';
import { db } from '../../firebaseConnection'; 
import { collection, getDocs, query, where, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ptBR } from 'date-fns/locale';

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [novaData, setNovaData] = useState('');
  const [datasOcupadas, setDatasOcupadas] = useState([]);




useEffect(() => {
  const fetchOcupadas = async () => {
    const snapshot = await getDocs(collection(db, "consultas"));
    const ocupadas = snapshot.docs.map(doc => {
      const data = doc.data().data.toDate();
      const key = `${data.getFullYear()}-${(data.getMonth()+1).toString().padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')} ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
      return key;
    });
    setDatasOcupadas(ocupadas);
  };

  fetchOcupadas();
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

  const buscarConsultas = async () => {
    setLoading(true);
    let q = collection(db, "consultas");
    if (busca.trim() !== '') {
      const documentoLimpo = busca.replace(/\D/g, '');
      q = query(q, where("documento", "==", documentoLimpo));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome,
        data: doc.data().data,
        documento: doc.data().documento,
        linkReuniao: doc.data().linkReuniao,
        status: doc.data().status,
        linkPagamento: doc.data().linkPagamento,
      }));
      setConsultas(lista);
    } else {
      setConsultas([]);
    }
    setLoading(false);
  };

    // Função para salvar a nova data
  const salvarNovaData = async (consulta) => {
    if (!novaData) return;
    // Data original
    let dataOriginal = consulta.data instanceof Object && typeof consulta.data.toDate === "function"
      ? consulta.data.toDate()
      : new Date(consulta.data);

    let dataNova = new Date(novaData);
    // Verifica diferença de até 2 dias (em ms)
    const diff = Math.abs(dataNova - dataOriginal) / (1000 * 60 * 60 * 24);
    if (diff < 1) {
      alert('Só é possível alterar a data em até 1 dia de diferença da original.');
      return;
    }
    // Atualiza no Firestore
    const consultaRef = doc(db, "consultas", consulta.id);
    await updateDoc(consultaRef, { data: Timestamp.fromDate(dataNova) });
    setEditId(null);
    setNovaData('');
    buscarConsultas();
  };

  return (
    <div className="consultas-container">
      <h1>Minhas Consultas</h1>
      <div className="busca-consultas">
        <input
          type="text"
          placeholder="Digite o CPF ou CNPJ"
          value={busca}
          onChange={e => setBusca(formatDocumento(e.target.value))}
          maxLength={18}
        />
        <button onClick={buscarConsultas}>Buscar</button>
      </div>
      
      {loading && <p className="loading-text">Carregando...</p>}

  <ul className="lista-consultas">
  {consultas.length === 0 && !loading && (
    <li className="no-results">Nenhuma consulta encontrada.</li>
  )}

        

  {consultas.map(consulta => (
    <li key={consulta.id} className="consulta-item">
      <div className="consulta-info">
        <div className="consulta-info-header">
          <strong className="label">{consulta.nome}</strong>
          {consulta.status && (
            <span className={`status-badge ${consulta.status.toLowerCase()}`}>
              {consulta.status}
            </span>
          )}
        </div>

                <div className="consulta-campo">
          <span className="label">Documento:</span>
          <span className="valor">{consulta.documento}</span>
        </div>    

        <div className="consulta-campo">
          <span className="label">Data:</span>
          <span className="valor">
            {consulta.data instanceof Object && typeof consulta.data.toDate === "function"
              ? consulta.data.toDate().toLocaleString('pt-BR')
              : 'Data inválida'}
          </span>
{editId === consulta.id ? (
  <>

<DatePicker
  selected={novaData}
  onChange={(date) => setNovaData(date)}
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
  const localKey = `${time.getFullYear()}-${(time.getMonth()+1).toString().padStart(2, '0')}-${time.getDate().toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return (
    hour >= 8 &&
    hour < 20 &&
    minutes === 0 &&
    !datasOcupadas.includes(localKey)
  );
}}
  placeholderText="Selecione nova data e hora"
  className="custom-datepicker"
  onKeyDown={(e) => e.preventDefault()}
  locale={ptBR}
/>
    <button 
      className="consulta-button"
      onClick={() => salvarNovaData(consulta)}
      style={{ marginLeft: 8 }}
    >
      Salvar
    </button>

    <button 
      className="consulta-button"
      onClick={() => { setEditId(null); setNovaData(''); }} 
      style={{ marginLeft: 4 }}
    >
      Cancelar
    </button>
  </>
) : (
  <>
  {consulta.status === 'Agendado' && ( 
    <button 
      className="consulta-button"
      onClick={() => {
      setEditId(consulta.id);
      const agora = new Date();
      const dataAtual = agora.getMinutes() > 0 ? new Date(agora.setHours(agora.getHours() + 1, 0, 0, 0)) : new Date(agora.setMinutes(0, 0, 0));
      if (dataAtual.getHours() < 8) dataAtual.setHours(8);
      if (dataAtual.getHours() >= 20 || dataAtual.getDay() === 0) {
        do {
          dataAtual.setDate(dataAtual.getDate() + 1);
        } while (dataAtual.getDay() === 0);
        dataAtual.setHours(8);
      }
  setNovaData(dataAtual);
}}
      style={{ marginLeft: 8 }}
    >
      Alterar Data
    </button>
  )}
    {consulta.status === 'Pendente' && consulta.linkPagamento && (
      <button 
        className="consulta-button"
        onClick={() => window.open(consulta.linkPagamento, '_blank')}
        style={{ marginLeft: 8 }}
      >
        Realizar pagamento pendente
      </button>
    )}
  </>
)}
</div>

        {consulta.linkReuniao && (
          <div className="consulta-campo">
            <span className="label">Consulta:</span>
            <a className="valor" href={consulta.linkReuniao} target="_blank" rel="noopener noreferrer">
              Acessar link
            </a>
          </div>
        )}
   
      </div>
    </li>
  ))}
 </ul>
 <div className="nova-consulta-container">
  <Link to="/NovaConsulta">
    <button className="nova-consulta-button">
    Agendar nova consulta
    </button>
  </Link>
</div>   
  
</div>
);
}
