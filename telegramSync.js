const axios = require('axios');
const fs = require('fs');


const TELEGRAM_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;


async function buscarUltimaOfertaCompleta() {
const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates`;
const { data } = await axios.get(url);


const posts = data.result.filter(p => p.channel_post);
const ultima = posts[posts.length - 1];


if (!ultima) return null;


let imagem = null;
if (ultima.channel_post.photo) {
const fileId = ultima.channel_post.photo.pop().file_id;
const filePath = await axios.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath.data.result.file_path}`;
imagem = fileUrl;
}


return {
texto: ultima.channel_post.caption || ultima.channel_post.text || "",
imagem
};
}


module.exports = { buscarUltimaOfertaCompleta };
