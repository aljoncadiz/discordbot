const Bot = require('./bot').Bot;
var env = require('./app.env');

var discordBot = new Bot(env.bot_beep_boop);

module.exports = discordBot;