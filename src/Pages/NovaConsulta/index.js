import React, { useState } from 'react';
import './NovaConsulta.css';
import QRCode from 'react-qr-code';

export default function NovaConsulta() {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [documento, setDocumento] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [pix, setPix] = useState(null);

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

  const handleNomeChange = (e) => {
    const value = e.target.value;
    setNome(value.replace(/\b\w/g, l => l.toUpperCase()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setPix(null);

    if (!nome || !data || !documento) {
      setMensagem('Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      // Chama o backend para criar o Pix dinâmico
      const resp = await fetch('http://localhost:3001/api/criar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, documento, data })
      });
      const charge = await resp.json();
      if (charge.brCode) {
        setPix(charge);
        setMensagem('Escaneie o QR Code para pagar. O agendamento será confirmado automaticamente após o pagamento.');
      } else {
        setMensagem('Erro ao gerar QR Code Pix.');
      }
    } catch (error) {
      setMensagem('Erro ao criar cobrança Pix.');
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
          <input
            type="datetime-local"
            value={data}
            onChange={e => setData(e.target.value)}
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
          {loading ? 'Gerando Pix...' : 'Gerar QR Code Pix'}
        </button>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </form>
      {pix && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <h3>Pagamento</h3>
          <QRCode value={pix.brCode} size={180} />
          <p style={{ fontSize: 12, marginTop: 8 }}>
            Após o pagamento, sua consulta será confirmada automaticamente.
          </p>
        </div>
      )}
    </div>
  );
}