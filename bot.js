let Discord = require("discord.js"); //npm i discord.js
let bot = new Discord.Client();
let config = require('./config.json');
var moment = require('moment') //npm i moment
var randomcolor = require('randomcolor') //npm i randomcolor
var winston = require('winston'); //npm i winston
var util = require('util') //npm i util


process.on('uncaughtException', function (err) {
    console.log('ERROR!: ' + err); //STOPS THE BOT FROM CRASHING
});


function AaN(args, i) {
    if (args[i] === null || args[i] === "" || args[i] === undefined) return true;
    return false;
}

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}`);
    console.log(`Guilds: ${bot.guilds.size}`);
    console.log(`Channels: ${bot.channels.size}`);
    console.log(`Users: ${bot.users.size}`);
});

bot.on('message', msg => {
    if (msg.author.id !== bot.user.id) return;

    let prefix = config.prefix;
    let channel = msg.channel;
    let guild = msg.guild;
    let text = msg.content;
    let args = text.split(" ");
    let command = text.substring(prefix.length, args[0].length).toLowerCase();
    if (!msg.content.startsWith(prefix)) return;

    if (command == "ping") {
        msg.delete()
        startTime = Date.now();
        channel.send("Pinging...").then((msg) => {
            endTime = Date.now();
            msg.edit(`Pong! \`${Math.round(endTime - startTime)}ms\``);
        });
    }

    if (command == "purge") {
        var amount = parseInt(args[1]);
        msg.channel.fetchMessages({
            limit: amount
        })
            .then(messages => {
                messages.map(msg => msg.delete().catch(console.error));
            }).catch(console.error);
    } else if (command == "clear") {
        let delamount = parseInt(args[1]) ? parseInt(args[1]) : 1;
        msg.channel.fetchMessages({
            limit: amount
        })
            .then(messages => {
                msgar = messages.array();
                msgar = msgar.filter(msg => msg.author.id === bot.user.id);
                msgar.length = delamount + 1;
                msgar.map(msg => msg.delete().catch(console.error));
            });
    }

    if (msg.content.toLowerCase().startsWith(prefix + 'get')) {
        var userg = msg.mentions.users.first();
        if (!userg) {
            return;
        }
        msg.channel.send('**Beep**');
        msg.channel.sendFile(userg.avatarURL.split('?')[0]);
    }

    if (msg.content === prefix + "stats") {
        var date = new Date(bot.uptime);
        var days = date.getUTCDate() - 1;
        var hours = date.getUTCHours();
        var minutes = date.getUTCMinutes();
        var embed = new Discord.RichEmbed();
        embed.setColor(randomcolor())
            .setFooter(' ', ' ')
            .setThumbnail(`${bot.user.avatarURL}`)
            .setTimestamp()
            .addField('Servers', `${bot.guilds.size}`, true)
            .addField('Users', `${bot.users.size}`, false)
            .addField('Discord Version', `${Discord.version}`, false)
            .addField('Uptime', days + " days, " + hours + " hours and " + minutes + " minutes.")
        msg.channel.sendEmbed(
            embed, {
                disableEveryone: true
            }
        );
    }

    //THIS WILL RESET THE BOT IF YOU RUN A FOREVER JS PROCESS. (LIKE PM2 OR NODEMON)
    if (msg.content.toLowerCase() == prefix + 'r' || msg.content.toLowerCase() == prefix + 'reload') {
        msg.channel.send(`Restarted. Heartbeat Pong! \`${bot.ping}ms\``).then(function (t) {
            process.exit(1);
        });
    }


    if (command == "userinfo") {
        var embed = new Discord.RichEmbed();
        if (msg.guild) {
            embed.addField("Username", `${msg.author.username}#${msg.author.discriminator}`, true)
                .addField("ID", `${msg.author.id}`, true)
                .setColor(randomcolor())
                .setFooter(' ', ' ')
                .setThumbnail(`${msg.author.avatarURL}`)
                .setTimestamp()
                .setURL(`${msg.author.avatarURL}`)
                .addField('Currently', `${msg.author.presence.status.toUpperCase()}`, true)
                .addField('Game', `${msg.author.presence.game === null ? "No Game" : msg.author.presence.game.name}`, true)
                .addField('Joined Discord', `${moment(msg.author.createdAt).format('MM.DD.YY')}`, true)
                .addField('Joined Server', `${moment(msg.member.joinedAt).format('MM.DD.YY')}`, true)
                .addField('Roles', `${msg.member.roles.filter(r => r.name).size}`, true)
                .addField('Is Bot', `${msg.author.bot.toString().toUpperCase()}`, true)
            msg.channel.sendEmbed(
                embed, {
                    disableEveryone: true
                }
            );
        } else {
            embed.addField("Username", `${msg.author.username}#${msg.author.discriminator}`, true)
                .addField("ID", `${msg.author.id}`, true)
                .setColor(randomcolor())
                .setFooter(' ', ' ')
                .setThumbnail(`${msg.author.avatarURL}`)
                .setTimestamp()
                .setURL(`${msg.author.avatarURL}`)
                .addField('Currently', `${msg.author.presence.status.toUpperCase()}`, true)
                .addField('Game', `${msg.author.presence.game === null ? "No Game" : msg.author.presence.game.name}`, true)
                .addField('Joined Discord', `${moment(msg.author.createdAt).format('MM.DD.YY')}`, true)
                .addField('Is Bot', `${msg.author.bot.toString().toUpperCase()}`, true)
            msg.channel.sendEmbed(
                embed, {
                    disableEveryone: true
                }
            );
        }
    }

   if (msg.content.startsWith("5y")) {
        if (msg.content.replace("5y ", "") === "") {
            msg.reply("`result <Query>`");
        }
        request(
            "https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&q=" +
            msg.content.replace("5y ", "") +
            "&type=video&videoDefinition=high&key=AIzaSyB-IuppTwP4EnCr_O6tN-4Unmz2eQWfakI",
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    msg.reply("L'API de Google ne fonctionne pas lol.");
                } else {
                    body = JSON.parse(body);
                    if (body.pageInfo.totalResults === 0) {
                        msg.reply("Sans résultats lol."); // nice french
                    } else {
                        msg.reply(
                            "La première vidéo: http://youtu.be/" + body.items[0].id.videoId
                        );
                    }
                }
            }
        );


    }

    if (msg.content.toLowerCase() === prefix + "serverinfo") {
        var embed = new Discord.RichEmbed();
        embed.addField("Server Name", `${msg.guild.name}`, true)
            .addField("Server ID", `${msg.guild.id}`, true)
            .setColor(randomcolor())
            .setFooter(' ', ' ')
            .setThumbnail(`${msg.guild.iconURL}`)
            .setTimestamp()
            .setURL(`${msg.author.avatarURL}`)
            .addField('Guild Owner', `${msg.guild.owner.user.username}`, true)
            .addField('Owner ID', `${msg.guild.owner.id}`, true)
            .addField('Guild Created', `${moment(msg.guild.createdAt).format('MM.DD.YY')}`, true)
            .addField('Member Count', `${msg.guild.memberCount}`, true)
            .addField('Verification Level', `${msg.guild.verificationLevel}`, true)
            .addField('Region', `${msg.guild.region.toUpperCase()}`, true)
            .addField('Roles', `${msg.guild.roles.filter(r => r.name).size}`, true)
            .addField('Channels', `${msg.guild.channels.filter(r => r.name).size}`, true)
        msg.channel.sendEmbed(
            embed, {
                disableEveryone: true
            }
        );
    }

    if (command == "whois") {
        var mention = msg.mentions.users.first();
        if (msg.mentions.users.size === 0) {
            return msg.channel.send(":x: | Please mention a user.")
        }
        var embed = new Discord.RichEmbed();
        embed.addField("Username", `${mention.username}#${mention.discriminator}`, true)
            .addField("ID", `${mention.id}`, true)
            .setColor(randomcolor())
            .setThumbnail(`${mention.avatarURL}`)
            .setURL(`${mention.avatarURL}`)
            .addField('Currently', `${mention.presence.status.toUpperCase()}`, true)
            .addField('Game', `${mention.presence.game === null ? "No Game" : mention.presence.game.name}`, true)
            .addField('Joined Discord', `${moment(mention.createdAt).format('MM.DD.YY')}`, true)
            .addField('Is Bot', `${msg.author.bot.toString().toUpperCase()}`, true)
        msg.channel.sendEmbed(
            embed, {
                disableEveryone: true
            }
        );
    }


    if (command == 'embed') {
        let noto = msg.content.split(" ").slice(1).join(" ");
        msg.delete();
        var embed = new Discord.RichEmbed();
        embed.setColor(randomcolor())
            .setDescription(noto)
        msg.channel.sendEmbed(
            embed, {
                disableEveryon: true
            }
        );
    }




    if (msg.content.startsWith(prefix + "pmspam")) { //THIS WAS MADE BY Nuno#0558
        let suffix = msg.content.split(' ').slice(1);;
        try {
            var usertospam = msg.mentions.users.first();
            var timesRun = 0;
            var numberspam = suffix[1];
            console.log(numberspam)
            var tospam = msg.content.split(' ').slice(3).join(' ');
            console.log(tospam)
            let messagecount = parseInt(numberspam) ? parseInt(numberspam) : 1;
            var interval = setInterval(function () {
                usertospam.send(tospam)
                timesRun += 1
                if (timesRun === messagecount) {
                    clearInterval(interval)
                }
            }, 1)

            usertospam.send(interval.length);
        } catch (err) {
            msg.channel.send("Error, user not found.")
        }
    }

});
bot.login(process.env.TOKEN);
