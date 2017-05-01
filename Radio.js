const Eris = require('eris');
const request = require('request');
var config = require('./config.json');
var bot = new Eris(config.token);
var json = "";
var jsonError = false;
var connections = [];
bot.on('ready', () => {
    console.log('Ready!');
    setInterval(updateData, 10000);
    updateData();
    joinOfficialVC();
});
bot.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.content == "🎵ping") {
        var msg = bot.createMessage(message.channel.id, '🎵').then(msg => msg.edit(`🎵 \`${msg.timestamp - message.timestamp}ms\``));
        console.log(message.author.username + ": " + message.content);
    }
    if (message.content == "🎵help") {
        bot.createMessage(message.channel.id, '🎵 **A bot created by PikaDude for Jakeoid\'s Lo-Fi Online Radio Station.** 🎵\nI display stats about the radio station and have the ability to play the radio in voice channels.\n**Commands:**\n**🎵ping**\n**🎵help**\n**🎵nowplaying**\n\n**Discord Server**: https://discord.gg/jYRnUnJ\n**Listen Now**: http://lofi.jakeoid.com/');
        console.log(message.author.username + ": " + message.content);
    }
    if (message.content == "🎵nowplaying" || message.content == "🎵np") {
        var jason = JSON.parse(json);
        //Object.keys(bot.voiceConnections.guilds).forEach(function (a) { listeners = listeners + bot.guilds.find(m => m.id == a).channels.get(?).voiceMembers.size - 1 });
        bot.createMessage(message.channel.id, {
            embed: {
                title: "Now Playing",
                description: `[Listen Now!](http://lofi.jakeoid.com/)`,
                fields: [{
                    name: 'Title',
                    value: jason.icestats.source.title,
                    inline: true
                }, {
                    name: 'Artist',
                    value: jason.icestats.source.artist,
                    inline: true
                }, {
                    name: 'Current Listeners',
                    value: jason.icestats.source.listeners,
                    inline: true
                }],
                footer: { text: (jsonError) ? "We're having some issues connecting to the API, so these stats may not be accurate." : null }
            }
        });
        console.log(message.author.username + ": " + message.content);
    }
    if (message.content.startsWith("🎵eval ")) {
        if (config.developers.includes(message.author.id)) {
            try {
                var msg = message.content.slice(7);
                var eeeval = eval(msg);
                bot.createMessage(message.channel.id, "```javascript\n" + eeeval + "```");
            } catch (Exception) {
                bot.createMessage(message.channel.id, "```javascript\n" + Exception.message + "```");
            }
            console.log(message.author.username + "(" + message.guild.name + "): " + message.content);
        } else {
            bot.createMessage(message.channel.id, "🎵 **You don't have permission to do this!**");
        }
    }
    if (message.content.startsWith("🎵setvolume ")) {
        try {
            var connection = connections.filter(function (a) { return a.channelID === message.member.voiceState.channelID });
            try {
                var volume = parseFloat(message.content.slice(12));
            } catch (Exception) {
                bot.createMessage("🎵 **Invalid volume! Choose a number between 0.1 and 2.0**");
            }
            if (connection != null) {
                if (volume < 2 || volume > 0) {
                    connection.setVolume(volume);
                    bot.createMessage(message.channel.id, "🎵 **Volume set to " + volume + "**");
                } else {
                    bot.createMessage(message.channel.id, "🎵 **That volume is too high!**");
                }
            } else {
                bot.createMessage(message.channel.id, "🎵 **Make sure you and I are both in the same voice channel first!**");
            }
        } catch (Exception) {
            console.log(Exception);
        }
    }
});
function updateData() {
    request('http://lofi.jakeoid.com:8000/status-json.xsl', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (json != body) {
                try {
                    var jason = JSON.parse(body);
                    json = body;
                    jsonError = false;
                    bot.editStatus("online", { name: jason.icestats.source.artist + ' - ' + jason.icestats.source.title });
                } catch (Exception) {
                    jsonError = true;
                    console.log("Failed to update JSON: " + Exception);
                }
            }
        }
        else {
            jsonError = true;
            console.log("Failed to fetch JSON. Got HTTP response: " + response.statusCode);
        }
    });
}

function joinOfficialVC() {
    bot.joinVoiceChannel(config.defaultVC).catch((err) => {
        console.log(err);
    }).then((connection) => {
        connections.push(connection);
        connection.play('http://lofi.jakeoid.com:8000/stream', { inlineVolume: true });
        connection.once("end", () => {
            var index = connections.indexOf(connection);
            if (index != -1) connection.splice(index, 1);
            joinOfficialVC();
        });
    });
}
bot.connect();