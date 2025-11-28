require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const axios = require('axios');
const { buscarUltimaOfertaCompleta } = require('./telegramSync');

const client = new Client({
    authStrategy: new LocalAuth()
});

// QR CODE VISUAL FUNCIONAL PARA RENDER
client.on('qr', qr => {
    console.log('📱 QR Code gerado! Abra o link abaixo para escanear no WhatsApp:');
    console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
});

// BOT PRONTO
client.on('ready', () => {
    console.log('✅ BOT WHATSAPP ESPELHO ONLINE - TELEGRAM → WHATSAPP');

    if (!fs.existsSync('lastPost.json')) {
        fs.writeFileSync('lastPost.json', JSON.stringify({ texto: "" }));
    }

    // Verifica a cada 60 segundos
    setInterval(async () => {
        try {
            const oferta = await buscarUltimaOfertaCompleta();
            if (!oferta) return;

            const last = JSON.parse(fs.readFileSync('lastPost.json'));
            if (last.texto === oferta.texto) return;

            if (oferta.imagem) {
                try {
                    const response = await axios.get(oferta.imagem, { responseType: 'arraybuffer' });
                    const media = new MessageMedia(
                        'image/jpeg',
                        Buffer.from(response.data).toString('base64')
                    );

                    await client.sendMessage(process.env.GRUPO_ID, media, { caption: oferta.texto });

                } catch (erroImagem) {
                    console.log('⚠️ Erro ao baixar imagem, enviando só texto...');
                    await client.sendMessage(process.env.GRUPO_ID, oferta.texto);
                }
            } else {
                await client.sendMessage(process.env.GRUPO_ID, oferta.texto);
            }

            fs.writeFileSync('lastPost.json', JSON.stringify({ texto: oferta.texto }));
            console.log('📲 Oferta replicada com sucesso no WhatsApp.');

        } catch (erro) {
            console.log('❌ Erro interno no BOT:', erro.message);
        }

    }, 60000);
});

// INICIALIZA
client.initialize();
