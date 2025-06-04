require('dotenv').config();
const {
    EmbedBuilder
} = require('discord.js');

const embedMsg = (ign,user_id) => {
    const embed = new EmbedBuilder()
    .setTitle("Audition Next Gen Round Count - May 2025")
    .setURL("https://example.com")
    .setDescription("Round count result")
    .addFields(
        {
        name: "IGN",
        value: "<@"+user_id+">",
        inline: true
        },
        {
        name: "Rounds",
        value: "123",
        inline: true
        },
        {
        name: "",
        value: "Round count updated as of May 2025",
        inline: false
        },
    )
    .setColor("#00b0f4")
    .setFooter({
        text: "NOTE:\nThis is an unofficial bot from Audition Next Gen",
        iconURL: "",
    });
}


module.exports = {
    embedMsg: embedMsg,

}