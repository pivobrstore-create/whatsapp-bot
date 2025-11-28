const axios = require('axios');
let lastUpdateId = 0;

async function buscarUltimaOfertaCompleta() {
  try {
    const token = process.env.TELEGRAM_TOKEN;

    const response = await axios.get(
      `https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}`
    );

    const updates = response.data.result;
    if (!updates || updates.length === 0) return null;

    const ultima = updates[updates.length - 1];
    lastUpdateId = ultima.update_id;

    const msg = ultima.message || ultima.channel_post;
    if (!msg) return null;

    let texto = msg.text || msg.caption || '';
    let imagem = null;

    if (msg.photo) {
      const fileId = msg.photo[msg.photo.length - 1].file_id;

      const fileData = await axios.get(
        `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
      );

      const filePath = fileData.data.result.file_path;
      imagem = `https://api.telegram.org/file/bot${token}/${filePath}`;
    }

    return {
      texto,
      imagem
    };

  } catch (error) {
    console.log('Erro ao buscar oferta do Telegram:', error.message);
    return null;
  }
}

module.exports = { buscarUltimaOfertaCompleta };
