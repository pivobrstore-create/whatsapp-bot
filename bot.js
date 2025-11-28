const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { buscarUltimaOferta } = require('./telegramSync');


const client = new Client({
authStrategy: new LocalAuth()
});


client.on('qr', qr => {
qrcode.generate(qr, { small: true });
});


client.on('ready', () => {
console.log('✅ WhatsApp BOT ONLINE (ESPELHO TELEGRAM)');


setInterval(async () => {
const oferta = await buscarUltimaOferta();


if (!oferta || !oferta.texto) return;


if (!fs.existsSync('lastPost.json')) {
fs.writeFileSync('lastPost.json', JSON.stringify({ texto: "" }));
}


let last = JSON.parse(fs.readFileSync('lastPost.json'));


if (last.texto !== oferta.texto) {
await client.// ENVIO PARA GRUPO DE CLIENTES
// Substitua pelo ID do grupo do WhatsApp
// Exemplo: 1203630XXXXXXXX@g.us
await client.sendMessage(process.env.GRUPO_ID, oferta.texto);
fs.writeFileSync('lastPost.json', JSON.stringify({ texto: oferta.texto }));
console.log('📤 Oferta espelhada para WhatsApp');
}


}, 60000); // a cada 1 minuto
});


client.initialize();
