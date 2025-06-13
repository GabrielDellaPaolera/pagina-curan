import React, { useState } from 'react';
import './consultas.css';
import { db } from '../../firebaseConnection'; 
import { collection, getDocs, query, where, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [novaData, setNovaData] = useState('');

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
      q = query(q, where("documento", "==", busca));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().Nome,
        data: doc.data().Data,
        documento: doc.data().documento,
        link: doc.data().link,
        status: doc.data().status,
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
    if (diff > 2) {
      alert('Só é possível alterar a data em até 2 dias de diferença da original.');
      return;
    }
    // Atualiza no Firestore
    const consultaRef = doc(db, "consultas", consulta.id);
    await updateDoc(consultaRef, { Data: Timestamp.fromDate(dataNova) });
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
          <strong className="consulta-nome">{consulta.nome}</strong>
          {consulta.status && (
            <span className={`status-badge ${consulta.status.toLowerCase()}`}>
              {consulta.status}
            </span>
          )}
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
                    <input
                      type="datetime-local"
                      value={novaData}
                      onChange={e => setNovaData(e.target.value)}
                      style={{ marginLeft: 8 }}
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
                  <button 
                  className="consulta-button"
                  onClick={() => { setEditId(consulta.id); setNovaData(''); }}
                   style={{ marginLeft: 8 }}>
                   Alterar Data
                  </button>
                )}
        </div>

        {consulta.link && (
          <div className="consulta-campo">
            <span className="label">Reunião:</span>
            <a className="valor" href={consulta.link} target="_blank" rel="noopener noreferrer">
              Acessar link
            </a>
          </div>
        )}

        <div className="consulta-campo">
          <span className="label">Documento:</span>
          <span className="valor">{consulta.documento}</span>
        </div>       
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
