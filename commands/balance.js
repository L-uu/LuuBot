module.exports = {
    name: "balance",
    aliases: ["bal"],
    execute(message) {
        const db = require("quick.db");
        var bankCheck = db.get(`guild_${message.guild.id}_bank_${message.author.id}`) || 0;
        if(bankCheck == 0) {
            message.channel.send("You don't have a bank, please create one.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        var balCheck = db.get(`guild_${message.guild.id}_bal_${message.author.id}`);
        message.channel.send(`$${balCheck}`);
        return message.react("✅");
    }
};
