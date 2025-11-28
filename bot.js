require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const axios = require('axios');
const { buscarUltimaOfertaCompleta } = require('./telegramSync');

const client = new Client({
authStrategy: new LocalAuth()
});

client.on('qr', qr => {
qrcode.generate(qr, { small: true });
console.log('📱 Escaneie o QR Code para conectar o WhatsApp');
});

client.on('ready', () => {
console.log('✅ BOT WHATSAPP ESPELHO ONLINE');

if (!fs.existsSync('lastPost.json')) {
fs.writeFileSync('lastPost.json', JSON.stringify({ texto: "" }));
}

setInterval(async () => {
try {
const oferta = await buscarUltimaOfertaCompleta();
if (!oferta) return;

const last = JSON.parse(fs.readFileSync('lastPost.json'));
if (last.texto === oferta.texto) return;

if (oferta.imagem) {
try {
const response = await axios.get(oferta.imagem, { responseType: 'arraybuffer' });
const media = new MessageMedia('image/jpeg', Buffer.from(response.data).toString('base64'));
await client.sendMessage(process.env.GRUPO_ID, media, { caption: oferta.texto });
} catch {
await client.sendMessage(process.env.GRUPO_ID, oferta.texto);
}
} else {
await client.sendMessage(process.env.GRUPO_ID, oferta.texto);
}

fs.writeFileSync('lastPost.json', JSON.stringify({ texto: oferta.texto }));
console.log('📲 Nova oferta repostada no WhatsApp');

} catch (error) {
console.log('Erro interno:', error.message);
}

}, 60000);
});

client.initialize();
