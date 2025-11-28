const axios = require('axios');

async function buscarUltimaOfertaCompleta() {
try {
const response = await axios.get(process.env.TELEGRAM_API);
const updates = response.data.result;

if (!updates || updates.length === 0) return null;

const ultima = updates[updates.length - 1];
const msg = ultima.message;

if (!msg || !msg.text) return null;

let imagem = null;

if (msg.photo) {
const fileId = msg.photo[msg.photo.length - 1].file_id;
const fileData = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_API.split('bot')[1].split('/')[0]}/getFile?file_id=${fileId}`);
const filePath = fileData.data.result.file_path;
imagem = `https://api.telegram.org/file/bot${process.env.TELEGRAM_API.split('bot')[1].split('/')[0]}/${filePath}`;
}

return {
texto: msg.text,
imagem: imagem
};

} catch (err) {
console.log("Erro ao buscar oferta do Telegram:", err.message);
return null;
}
}

module.exports = { buscarUltimaOfertaCompleta };
