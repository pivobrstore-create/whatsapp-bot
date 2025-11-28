const axios = require('axios');

async function buscarUltimaOfertaCompleta() {
  try {
    const token = process.env.TELEGRAM_TOKEN;

    const response = await axios.get(
      `https://api.telegram.org/bot${token}/getUpdates`
    );

    const updates = response.data.result;
    if (!updates || updates.length === 0) return null;

    // pega sempre a última atualização
    const ultima = updates[updates.length - 1];

    // pode vir como mensagem normal ou postagem de canal
    const msg = ultima.message || ultima.channel_post;
    if (!msg) return null;

    let texto = msg.text || msg.caption || '';
    let imagem = null;

    if (msg.photo && msg.photo.length > 0) {
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
    console.log('ERRO TELEGRAM BOT ESPELHO:', error.message);
    return null;
  }
}

module.exports = { buscarUltimaOfertaCompleta };
