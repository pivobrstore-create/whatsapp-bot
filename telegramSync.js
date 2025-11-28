const axios = require('axios');

async function buscarUltimaOfertaCompleta() {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const response = await axios.get(
      `https://api.telegram.org/bot${token}/getChatHistory`,
      {
        params: {
          chat_id: chatId,
          limit: 1
        }
      }
    );

    const mensagem = response.data.result[0];
    if (!mensagem) return null;

    let texto = mensagem.text || mensagem.caption || '';
    let imagem = null;

    if (mensagem.photo) {
      const fileId = mensagem.photo[mensagem.photo.length - 1].file_id;
      const fileData = await axios.get(
        `https://api.telegram.org/bot${token}/getFile`,
        { params: { file_id: fileId } }
      );
      const filePath = fileData.data.result.file_path;
      imagem = `https://api.telegram.org/file/bot${token}/${filePath}`;
    }

    return { texto, imagem };

  } catch (error) {
    console.log('ERRO REAL TELEGRAM:', error.message);
    return null;
  }
}

module.exports = { buscarUltimaOfertaCompleta };
