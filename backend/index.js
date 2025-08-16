// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const { db } = require('./firebaseAdmin');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota para criar link de pagamento
app.post("/api/pagamento", async (req, res) => {
  const { nomeProduto, preco, idCliente, nome, email, telefone, data } = req.body;

  const preference = {
    items: [
      {
        title: nomeProduto || "Consulta",
        quantity: 1,
        unit_price: preco || 100
      }
    ],
    external_reference: idCliente,
    metadata: {
      nome,
      email,
      telefone,
      dataConsulta: data
    },
  back_urls: {
    success: "https://8e0a78406b37.ngrok-free.app/sucesso",
    failure: "https://8e0a78406b37.ngrok-free.app/falha",
    pending: "https://8e0a78406b37.ngrok-free.app/pendente"
  },
    auto_return: "approved",
   notification_url: "https://8e0a78406b37.ngrok-free.app/api/webhook"
 };

  try {
    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    res.json({ link: response.data.init_point });
  } catch (err) {
    console.error("Erro ao criar link de pagamento:", err.response?.data || err);
    res.status(500).json({ erro: "Erro ao criar pagamento" });
  }
});

function gerarLinkJitsi() {
  const nomeUnico = 'consulta-' + Date.now(); // ou use clienteId, nome, etc.
  return `https://meet.jit.si/${nomeUnico}`;
}

// Rota Webhook
app.post("/api/webhook", async (req, res) => {
  console.log("📩 Webhook recebido!");
  console.log("Conteúdo do body:", JSON.stringify(req.body, null, 2));

  const { data, type } = req.body;

  if (type !== 'payment') {
    console.log("❌ Tipo de evento não é 'payment'. Ignorando.");
    return res.sendStatus(200);
  }

  try {
    const paymentId = data.id;
    console.log(`🔎 Buscando detalhes do pagamento ID: ${paymentId}`);

    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    const payment = response.data;
    const status = payment.status;
    const clienteId = payment.external_reference;
    const metadata = payment.metadata;

    console.log("📄 Dados do pagamento:");
    console.log("Status:", status);
    console.log("Cliente ID (documento):", clienteId);
    console.log("Metadata:", metadata);

    if (status === "approved") {
      const consultasRef = db.collection('consultas');
      const snapshot = await consultasRef
        .where('documento', '==', clienteId)
        .orderBy('data', 'desc')
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];

        const linkReuniao = gerarLinkJitsi();

        await doc.ref.update({
        status: 'Agendado',
        linkReuniao: linkReuniao,
      });
        console.log(`✅ Status da consulta atualizado para 'Agendado'.`);
      } else {
        console.log(`⚠️ Nenhuma consulta encontrada com documento ${clienteId}.`);
      }
    } else {
      console.log("ℹ️ Pagamento não aprovado. Status:", status);
    }
  } catch (err) {
    console.error("❌ Erro no webhook:", err.response?.data || err);
  }

  res.sendStatus(200);
});


const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
