module.exports = {
    name: "reload",
    execute(message, args) {
        if (message.author.id != "365206297701777408") return;
        if (!args[0]) return message.channel.send(`You didn't pass any command to reload.`);
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName);
        try {
            delete require.cache[require.resolve(`./${command.name}.js`)];
        } catch (error) {
            message.channel.send(`Command \`${args[0]}\` not found.`)
                .then(msg => msg.delete({ timeout: 5000 }));
            return message.react("❌");
        };
        const newCommand = require(`./${command.name}.js`);
        message.client.commands.set(newCommand.name, newCommand);
        message.channel.send(`Command \`${command.name}\` was reloaded.`)
            .then(msg => msg.delete({ timeout: 5000 }));
        return message.react("✅");
    }
};
