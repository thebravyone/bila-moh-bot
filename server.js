/**
 * @Author: Guilherme Serradilha
 * @Date:   29-Apr-2017 11:58:13
 * @Filename: server.js
 * @Last modified by:   Guilherme Serradilha
 * @Last modified time: 29-Apr-2017 22:51:44
 * @License: MIT
 */

const Discord = require('discord.io')
const fs = require('fs')

var responses = []
var helpMessage = ''

var bot = new Discord.Client({
  token: '',
  autorun: true
})

// Inicializacao
bot.on('ready', function () {
  responses = loadResponseJSON()
  helpMessage = generateHelp(responses)
  console.log('BilaMohBot já tá rodando a milhão!\n')
})

// Reconecta caso a conexao seja interrompida
bot.on('disconnect', function (err, errCode) {
  if (err) console.error(err)
  bot.connect()
})

// Gerencia as respostas do bot baseado nos comandos recebidos no chat
bot.on('message', function (user, userID, channelID, message, event) {
  var voiceChannelID = getVoiceChannelID(userID)
  if (userID === bot.id) return
  // Lida com as mensagens definidas no JSON
  for (var i = 0; i < responses.length; i++) {
    if (message === responses[i].command) {
      if (responses[i].audio !== '') {
        playAudio(voiceChannelID, responses[i].audio)
      }
      if (responses[i].message !== '') {
        bot.sendMessage({ to: channelID, message: responses[i].message })
      }
    }
  }
  // Mensagens especiais ou eventos extras
  if (message === '!help') {
    bot.sendMessage({ to: channelID, message: helpMessage })
  }
  if (message === '!falou-bila') {
    bot.leaveVoiceChannel(voiceChannelID, function (err, events) {
      if (err) return console.error(err)
    })
  }
})

// Lida com a interrupcao do processo usando Ctrl+C no terminal
process.on('SIGINT', function () {
  process.exit(1)
})

// Carraga o arquivo JSON com os comandos e suas respectivas respostas
function loadResponseJSON () {
  return JSON.parse(fs.readFileSync('responses.json', 'utf8'))
}

// Traz o Voice Channel do usuario
// Retorna undefined se o usuario nao estiver em nenhum voice channel
function getVoiceChannelID (userID) {
  for (var server in bot.servers) {
    if (bot.servers[server].members[userID]) {
      return bot.servers[server].members[userID].voice_channel_id
    }
  }
}

// Prepara o voice channel para receber o audio
// E chama a funcao que streama o audio
function playAudio (voiceChannelID, audioFile) {
  bot.joinVoiceChannel(voiceChannelID, function (err, events) {
    if (err) {
      if (err.message.includes('Voice channel already active')) {
        streamAudioToVoiceChannel(voiceChannelID, audioFile)
      } else {
        return console.error(err)
      }
    } else {
      streamAudioToVoiceChannel(voiceChannelID, audioFile)
    }
  })
}

// Streama o arquivo de audio no voice channel
function streamAudioToVoiceChannel (voiceChannelID, audioFile) {
  bot.getAudioContext(voiceChannelID, function (error, stream) {
    if (error) return console.error(error)
    fs.createReadStream('./audio/' + audioFile).pipe(stream, {end: false})
  })
}

// Cria a lista de comandos para mostrar no chat
function generateHelp (responsesObj) {
  var help = 'Usa esses comandos aqui pra gente trocar ideia:\n\n'
  for (var i = 0; i < responsesObj.length; i++) {
    help += '**' + responsesObj[i].command + '** - ' + responsesObj[i].hint + '\n'
  }
  return help
}
