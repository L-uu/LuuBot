module.exports = {
    name: "makebank",
    aliases: ["mb"],
    execute(message) {
        const db = require("quick.db");
        var bankCheck = db.get(`guild_${message.guild.id}_bank_${message.author.id}`) || 0;
        if(bankCheck == 1) {
            message.channel.send("You already have a bank.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        db.add(`guild_${message.guild.id}_bank_${message.author.id}`, 1);
        db.add(`guild_${message.guild.id}_bal_${message.author.id}`, 500);
        message.channel.send("Done.")
            .then(msg => msg.delete({ timeout: 5000 }));
        return message.react("✅");
    }
};
