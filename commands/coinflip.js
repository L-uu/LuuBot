module.exports = {
    name: "coinflip",
    aliases: ["cf"],
    execute(message, args) {
        const db = require("quick.db");
        var bankCheck = db.get(`guild_${message.guild.id}_bank_${message.author.id}`) || 0;
        if(bankCheck == 0) {
            message.channel.send("You don't have a bank, please create one.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        if(args[0] == "head" || args[0] == "heads") {
            var choice = 0;
        } else if(args[0] == "tail" || args[0] == "tails") {
            var choice = 1;
        } else {
            message.channel.send("Invalid selection.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        var balCheck = db.get(`guild_${message.guild.id}_bal_${message.author.id}`);
        if(args[1] > balCheck || args[1] < 1) {
            message.channel.send("Invalid ammount.")
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        const randomNumber = Math.round(Math.random());
        if(choice == randomNumber) {
            db.add(`guild_${message.guild.id}_bal_${message.author.id}`, args[1]);
            message.channel.send(`Congratulations, you won $${args[1]}!`);
            return message.react("✅");
        } else {
            db.subtract(`guild_${message.guild.id}_bal_${message.author.id}`, args[1]);
            message.channel.send(`Awh, you lost $${args[1]}!`);
            return message.react("✅");
        };
    }
};
