const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const axios = require('axios');
const { buscarUltimaOfertaCompleta } = require('./telegramSync');


const client = new Client({ authStrategy: new LocalAuth() });


client.on('qr', qr => qrcode.generate(qr, { small: true }));


client.on('ready', () => {
console.log('✅ WhatsApp BOT ONLINE – RÉPLICA TOTAL TELEGRAM');


setInterval(async () => {
const oferta = await buscarUltimaOfertaCompleta();
if (!oferta) return;


if (!fs.existsSync('lastPost.json')) {
fs.writeFileSync('lastPost.json', JSON.stringify({ texto: "" }));
}


const last = JSON.parse(fs.readFileSync('lastPost.json'));
if (last.texto === oferta.texto) return;


if (oferta.imagem) {
const response = await axios.get(oferta.imagem, { responseType: 'arraybuffer' });
const media = new MessageMedia('image/jpeg', Buffer.from(response.data).toString('base64'));
await client.sendMessage(process.env.GRUPO_ID, media, { caption: oferta.texto });
} else {
await client.sendMessage(process.env.GRUPO_ID, oferta.texto);
}


fs.writeFileSync('lastPost.json', JSON.stringify({ texto: oferta.texto }));
console.log('📲 Oferta replicada no WhatsApp.');


}, 60000);
});


client.initialize();
