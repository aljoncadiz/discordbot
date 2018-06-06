
const winston = require('winston');
const Discord = require('discord.js');
const client = new Discord.Client();
const HttpClient = require('node-rest-client').Client;
const http = new HttpClient();
const simsimiApiKey = "18fc3a5e-da92-4fc6-9600-761321a45121";

var appCommand = {
};

var appChannelType = {
	'text'  : 'text',
	'voice' : 'voice'
};

var appRoles = {
	"verified" : "verified",
	"mod" : "Discord Moderator"
};

var temporaryRole = {
	type: 'role',
	id: '453713347616178186'
};


exports.Bot = function(bot){

	client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	});

	client.on('message', cmd => {
	var command = cmd.content.replace(/ .*/,'');
	parseCommand(cmd, command);
	if(cmd.mentions.users.array().length > 0){
		if(cmd.mentions.users.some(x => x.username == bot.name)){
			talkWithBot(cmd, cmd.content.replace(bot.tagName,''));
		}
	}
	});

	client.on('voiceStateUpdate', (oldMember, newMember) => {
		let newUserChannel = newMember.voiceChannel
		let oldUserChannel = oldMember.voiceChannel
		
		if(oldUserChannel === undefined && newUserChannel !== undefined) {
	
		// User Joins a voice channel
	
		} else if(newUserChannel.name != oldUserChannel.name){
			// User leaves a voice channel
			if(oldUserChannel.members.array().length == 0){  
				oldUserChannel.delete();
			};
		};
	});
	
	client.login(bot.key);
}

function parseCommand(cmd, command){	
	switch(command){
		case "!create": createTemporaryChannel(cmd); break;
	};
};

function createTemporaryChannel(cmd){

	var args = cmd.content.split(" ");
	var channelType = args[1] ? args[1].trim() : '';
	var channelName = args[2] ? args[2].trim() : '';	
	var server = cmd.guild;

	//checks if user is allowed to exceture commands
	if(!checkUserRoles(cmd, [appRoles.verified, appRoles.mod])){
		cmd.reply(`you do not have permission for this command`);
		return;
	};

	if(!args[1]){ 
		cmd.reply(`incomplete command`); 
		return; 
	};

	if(args[1] != appChannelType.text && args[1] != appChannelType.voice) { 
		cmd.reply(`unknown command`); 
		return; 
	};
		
	if(checkChannelNameExist(server, channelName)){
		cmd.reply(`Specified ${channelType} channel already exist`);
		return;
	};

	var tempChannelId = "453029493662154762";
	var tempChannel = server.channels.get(tempChannelId);
	var parentChannel = tempChannel;
	
	if(!!args[3]){
		var parentName = args[3].trim();
		if(checkChannelNameExist(server, parentName)){
			parentChannel = getChannelByName(server, parentName);
		}else{
			cmd.reply(`cannot find channel category name: ${parentName}`);
			return;
		};
	};

	server.createChannel(channelName, channelType, [temporaryRole]).then( channel => {
		channel.setParent(parentChannel);
		cmd.reply(`created ${channelType} channel: ${channelName}`);
	});		
};

function getChannelByName(server, channelName){
	return server.channels.find( x => x.name.toLowerCase() == channelName.toLowerCase());
};

function checkChannelNameExist(server, channelName){
	return server.channels.some( x => x.name.toLowerCase() == channelName.toLowerCase())
};

function checkUserRoles(cmd, validRoles){
	return cmd.member.roles.some(x => validRoles.includes(x.name))
};

function talkWithBot(cmd, message){
	// direct way
	http.get(`http://sandbox.api.simsimi.com/request.p?key=${simsimiApiKey}&lc=ph&ft=0.0&text=${message}`, function (data, response) {
		cmd.reply(data.response);
		return;
	});
}





