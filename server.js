'use strict';

const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const app = express();
const port = process.env.PORT || 3000;

let latestQrDataUrl = null;
let latestQrBuffer = null;

// WhatsApp Client einrichten
const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', async (qr) => {
  console.log('📲 QR Code erhalten!');
  // DataURL für JSON-API
  latestQrDataUrl = await QRCode.toDataURL(qr);
  // PNG-Buffer für direktes Bild
  latestQrBuffer = await QRCode.toBuffer(qr);
});

client.on('ready', () => {
  console.log('✅ WhatsApp Client ist bereit!');
});

client.on('message', message => {
  console.log('📩 Nachricht empfangen:', message.body);
  if (message.body === 'ping') {
    message.reply('pong');
  }
});

client.initialize();

// Status-Route
app.get('/', (req, res) => {
  res.send('✅ WhatsApp Bot läuft auf Render!');
});

// QR-Code als JSON (für Frontend-Bindung)
app.get('/qr', (req, res) => {
  if (!latestQrDataUrl) {
    return res.status(404).json({ error: '❌ Noch kein QR-Code verfügbar' });
  }

  res.json({ qr: latestQrDataUrl });
});

// QR-Code als Bild (für <img src="/qr.png">)
app.get('/qr.png', (req, res) => {
  if (!latestQrBuffer) {
    return res.status(404).send('❌ QR noch nicht bereit');
  }

  res.set('Content-Type', 'image/png');
  res.send(latestQrBuffer);
});

// Server starten
app.listen(port, () => {
  console.log(`🌐 Server läuft auf Port ${port}`);
});
