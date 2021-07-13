const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const queue = new Map();
module.exports.queue = queue;
const db = require("quick.db");

const fs = require("fs");
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
};

client.on("message", async message => {
    const prefix = db.get(`guild_${message.guild.id}_prefix`) || ".";
    module.exports.prefix = prefix;
    const isRankOn = db.get(`guild_${message.guild.id}_isrankon`) || false;
    module.exports.isRankOn = isRankOn;
    const { xp } = require("./functions/xp");
    if (isRankOn == true && !message.author.bot && !message.content.startsWith(`${prefix}`)) xp(message);
    if (!message.content.startsWith(`${prefix}`) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
        return command.execute(message, args);
    } catch (error) {
        console.log(error);
        message.channel.send("An unexpected error occured and has been logged for review, please try again. Sorry about that.")
            .then(msg => msg.delete({ timeout: 5000 }));
        return message.react("❌");
    };
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activity: { name: `tunes! | prefix: ${config.PREFIX}`, type: "LISTENING" } });
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

function setPresence() {
    return client.user.setPresence({ activity: { name: `tunes! | prefix: ${config.PREFIX}`, type: "LISTENING" } });
};
setInterval(setPresence, 43200000);

client.login(`${config.TOKEN}`);
