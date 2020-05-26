const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./responses');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (message.content === '!help') {
		sendHelp(message);
	} else {
		var response =  commands.find(command => {
			return command.command == message.content;
		})
		if (typeof response !== 'undefined') {
			message.channel.send(response.message);
			if (message.member.voice.channel) {
				const connection = await message.member.voice.channel.join();
				const dispatcher = connection.play('./audio/' + response.audio);
			}
		}
	}
});

function sendHelp (message) {
	var helpText = commands.reduce((text, currentCommand) => {
		return text + '**' + currentCommand.command + '** - ' + currentCommand.hint + '\n';
	}, 'Usa esses comandos aqui pra gente trocar ideia:\n\n');
	message.channel.send(helpText);
};

client.login('MzA3NzA4NzUyNjE2ODgyMTc4.Xsw1Rg.t1gXsZtKMZkf9AtALcnpPkJUrYg');