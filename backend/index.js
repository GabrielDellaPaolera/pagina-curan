require('dotenv').config();
const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

// Inicialize o Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

// Endpoint para criar Pix dinâmico
app.post('/api/criar-pix', async (req, res) => {
  const { nome, documento, data } = req.body;
  try {
    const response = await axios.post(
      'https://api.openpix.com.br/api/v1/charge',
      {
        value: 10000, // valor em centavos (ex: 10000 = R$ 100,00)
        correlationID: `${documento}-${Date.now()}`,
        comment: `Consulta para ${nome}`,
        expiresIn: 3600,
        additionalInfo: [
          { name: 'Nome', value: nome },
          { name: 'Documento', value: documento },
          { name: 'Data', value: data }
        ]
      },
      {
        headers: {
          'Authorization': process.env.OPENPIX_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data.charge);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar cobrança Pix' });
  }
});

// Webhook do OpenPix
app.post('/api/webhook-openpix', async (req, res) => {
  const event = req.body;
  if (event.type === 'OPENPIX:CHARGE_COMPLETED') {
    const { correlationID, additionalInfo } = event.data.charge;
    // Atualize ou crie a consulta no Firestore
    await db.collection('consultas').add({
      Nome: additionalInfo.find(i => i.name === 'Nome').value,
      documento: additionalInfo.find(i => i.name === 'Documento').value,
      Data: additionalInfo.find(i => i.name === 'Data').value,
      status: 'Pago',
      link: '', // ou o link do comprovante se quiser
    });
  }
  res.sendStatus(200);
});

app.listen(3001, () => console.log('Backend rodando na porta 3001'));