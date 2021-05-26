module.exports = {
    name: "balance",
    aliases: ["bal"],
    execute(message) {
        const db = require("quick.db");
        var bankCheck = db.get(`guild_${message.guild.id}_bank_${message.author.id}`);
        if(!bankCheck) {
            message.channel.send("You don't have a bank, please create one.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        const user = message.mentions.users.first() || message.author;
        var balCheck = db.get(`guild_${message.guild.id}_bal_${user.id}`);
        if(balCheck == undefined) {
            message.channel.send("This user has no bank account.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        message.channel.send(`$${balCheck}`);
        return message.react("✅");
    }
};
