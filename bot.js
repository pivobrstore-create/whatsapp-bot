const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { gerarOferta } = require('./offers');


const client = new Client({
authStrategy: new LocalAuth()
});


client.on('qr', qr => {
qrcode.generate(qr, { small: true });
});


client.on('ready', () => {
console.log('✅ WhatsApp BOT ONLINE');
});


client.on('message', async message => {
if (message.body.startsWith('oferta')) {
const link = message.body.replace('oferta ', '');
const resposta = await gerarOferta(link);
client.sendMessage(message.from, resposta);
}


if (message.body === 'menu') {
client.sendMessage(message.from, `📦 MENU\n1 - Última oferta\n2 - Promoções do dia\n3 - Categoria`);
}
});


client.initialize();
