const axios = require('axios');

async function buscarUltimaOfertaCompleta() {
    try {
        const response = await axios.get(process.env.TELEGRAM_API);
        const updates = response.data.result;

        if (!updates || updates.length === 0) return null;

        const ultima = updates[updates.length - 1];
        const msg = ultima.message;

        if (!msg || (!msg.text && !msg.caption)) return null;

        let texto = msg.text || msg.caption;
        let imagem = null;

        if (msg.photo) {
            const fileId = msg.photo[msg.photo.length - 1].file_id;
            const token = process.env.TELEGRAM_API.split('bot')[1].split('/')[0];

            const fileData = await axios.get(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
            const filePath = fileData.data.result.file_path;

            imagem = `https://api.telegram.org/file/bot${token}/${filePath}`;
        }

        return {
            texto,
            imagem
        };

    } catch (error) {
        console.log('Erro ao buscar dados do Telegram:', error.message);
        return null;
    }
}

module.exports = { buscarUltimaOfertaCompleta };
