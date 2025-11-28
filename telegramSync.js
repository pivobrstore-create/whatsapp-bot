const axios = require('axios');


const TELEGRAM_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME;


async function buscarUltimaOferta() {
const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates`;
const { data } = await axios.get(url);


const mensagens = data.result.filter(m => m.channel_post);
const ultima = mensagens[mensagens.length - 1];


if (!ultima) return null;


return {
texto: ultima.channel_post.caption || ultima.channel_post.text || "",
};
}


module.exports = { buscarUltimaOferta };
