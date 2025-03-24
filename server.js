'use strict';

const express = require('express');
const { Client, LocalAuth } = require('./src/Client');
const qrcode = require('qrcode'); // npm install qrcode
const app = express();
const port = process.env.PORT || 3000;

let latestQrDataUrl = null;

// WhatsApp Client einrichten
const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', async (qr) => {
  console.log('📲 QR Code erhalten!');
  // QR-Code in eine DataURL konvertieren (z. B. für <img src="..."> im Frontend)
  latestQrDataUrl = await qrcode.toDataURL(qr);
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

// Web-Route: Status
app.get('/', (req, res) => {
  res.send('✅ WhatsApp Bot läuft auf Render!');
});

// Web-Route: QR-Code (als Bild/DataURL)
app.get('/qr', (req, res) => {
  if (!latestQrDataUrl) {
    return res.status(404).send('❌ Noch kein QR-Code verfügbar');
  }

  // Als HTML anzeigen (oder JSON je nach Frontend)
  res.send(`
    <html>
      <body>
        <h2>📱 WhatsApp QR-Code</h2>
        <img src="${latestQrDataUrl}" />
      </body>
    </html>
  `);
});

// Server starten
app.listen(port, () => {
  console.log(`🌐 Server läuft auf Port ${port}`);
});
