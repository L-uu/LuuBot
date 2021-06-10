const { TextChannel, MessageEmbed } = require("discord.js");
const { lavacordManager } = require("..");
const urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
const axios = require("axios").default

module.exports = class Queue {
    /**
     * 
     * @param {String} guildID 
     * @param {String} channelID 
     * @param {TextChannel} textChannel 
     */
    constructor(guildID, channelID, textChannel) {
        this.guildID = guildID
        this.channelID = channelID
        this.textChannel = textChannel
        this.queue = []
        this.player = null
        this.currentlyPlaying = null
    }

    async search(searchTerm) {
        const node = lavacordManager.idealNodes[0]
        const params = new URLSearchParams()
        params.append("identifier", urlRegex.test(searchTerm) ? searchTerm: `ytsearch:${searchTerm}`)
        const data = await axios(`http://${node.host}:${node.port}/loadtracks?${params}`, {
            Authorization: node.password
        })
        return data.data.tracks || []
    }

    async play(track) {
        this.queue.push(track)
        if (!this.currentlyPlaying) {
            this.playNext
            return false
        } else {
            return true
        }
    }

    async playNext() {
        const nextSong = this.queue.shift()
        this.currentlyPlaying = nextSong
        if (!nextSong) {
            this.player = null
            this.currentlyPlaying = null

            await lavacordManager.leave(this.guildID)
            this.textChannel.send("Finished playing.")
            return
        }
        this.textChannel.send(
            new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor("Paused")
                .setTitle(`${nextSong.info.title}`)
        )
        this.player.on("end", data => {
            if(data.reason === "REPLACED" || data.reason === "STOPPED") return
            this.playNext()
        })
        await this.player.play(nextSong.track)
    }
}