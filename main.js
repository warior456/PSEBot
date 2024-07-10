const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
require('dotenv').config();
require('ffmpeg-static');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
    require(`./handlers/${handler}`)(client, Discord)
})

client.on('ready', () => {
    client.user.setActivity(`${(process.env.PREFIX)}help`, { type: 'PLAYING' });
    //client.user.setActivity(`Thunderstorm!`, {type: 'PLAYING'});
});

client.login(process.env.DISCORD_TOKEN);
// @echo off
// mode 90,25
// title Discord-Bot 
// color A
// node main.js
// @echo CTRL+C to render the Bot offline. 
// pause