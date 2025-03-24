'use strict';

const express = require('express');
const { Client, LocalAuth } = require('./src/Client'); // <- passt zu deinem Projekt
const app = express();
const port = process.env.PORT || 3000;

// WhatsApp Client einrichten
const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  console.log('QR Code erhalten:\n', qr);
});

client.on('ready', () => {
  console.log('✅ WhatsApp Client ist bereit!');
});

client.on('message', message => {
  console.log('📩 Nachricht empfangen:', message.body);
  // Beispiel-Antwort
  if (message.body === 'ping') {
    message.reply('pong');
  }
});

client.initialize();

// HTTP Endpoint nur für Render-Erkennung
app.get('/', (req, res) => {
  res.send('✅ WhatsApp Bot läuft auf Render!');
});

// Starte Express-Server
app.listen(port, () => {
  console.log(`🌐 Server läuft auf Port ${port}`);
});
