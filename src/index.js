import dotenv from 'dotenv'
dotenv.config()

import { 
    Client, 
    GatewayIntentBits,
    TextInputBuilder,
    TextInputStyle,
    REST,
    Routes,
    codeBlock,
    Events,
    ActivityType,
    EmbedBuilder
 } from 'discord.js';

import functions from './functions.js';

let now = new Date();
let formattedDate = now.toLocaleString();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
    
})

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isChatInputCommand()) return;
    now = new Date();
    formattedDate = now.toLocaleString();
    //Log actions
    console.log("["+formattedDate+"]");
    console.log("- Guild: "+interaction.guild.name+" User "+interaction.user.username+" used /"+interaction.commandName);
    
    if(interaction.commandName === 'rounds'){
        await interaction.deferReply();
        try{
            const ign = interaction.options.get('ign').value;
            const user_id = interaction.user.id;
            functions.readCSVData(ign, user_id).then((a) => {
                const embed = a;
                interaction.editReply({ embeds: [embed] });
            })
        }catch (e){
            console.log(e)
            interaction.editReply("An error occurred. Please try again later.");
        }
        
    }

    // if(interaction.commandName === 'hulyo'){
    //     interaction.reply("Uh huh, I see you.")
    // }

    // if(interaction.commandName === 'jaryjary'){
    //     interaction.reply("ge.")
    // }

    // if(interaction.commandName === 'jesse'){
    //     interaction.reply("Babygirl")
    // }

    if(interaction.commandName === 'song'){
        await interaction.deferReply();
        try{
            interaction.editReply({ embeds: [functions.songSelector()]});
        }catch(e){
            console.log(e)
            interaction.editReply("An error occurred. Please try again later.\n");
        }
    }

    if(interaction.commandName === 'tourna'){
        await interaction.deferReply();
        try{
            interaction.editReply({ embeds: [functions.tsongSelector()]});
        }catch(e){
            console.log(e)
            interaction.editReply("An error occurred. Please try again later.\n");
        }
    }

    if(interaction.commandName === 'songfb'){
        let artist;
        await interaction.deferReply();
        try{
            const min = interaction.options.getInteger('min');
            const max = interaction.options.getInteger('max');
            if(interaction.options.get('artist') != null){
                artist = interaction.options.get('artist').value;    
            }
            if(min>max){
                // interaction.editReply("Max should be higher than the minimum value")
                const embed = new EmbedBuilder()
                embed.setTitle('Uh-huh..')
                embed.setColor(0xff0000)
                embed.setDescription('Max BPM should be higher than the minimum value.\n')
                interaction.editReply({ embeds: [embed] });
            }else{
                interaction.editReply({ embeds: [functions.songfbSelector(min, max, artist)]});
            }
        }catch(e){
            console.log(e)
            interaction.editReply("An error occurred. Please try again later.\n");
        }
    }

    if(interaction.commandName === 'mood'){
        await interaction.deferReply();
        try{
            interaction.editReply(functions.moodSelector());
        }catch(e){
            console.log(e)
            interaction.editReply("An error occurred. Please try again later.\n");
        }
    }

    if(interaction.commandName === 'nugagawen'){
        await interaction.deferReply();
        try{
            setTimeout(() => {
                interaction.editReply({ embeds: [functions.gameSelector()]});
                
            }, 2000);
        }catch(e){
            console.log(e)
            interaction.editReply("An error occurred. Please try again later.\n");
        }
    }

})

// Handle event error
client.on(Events.ShardError, error => {
	console.error('A websocket connection encountered an error:', error);
});

//Rich Presence
import drpc from 'discord-rpc'
const DiscordRPC = drpc;
const RPC = new DiscordRPC.Client({transport: 'ipc'});
const ID = "1377708148332429365";
DiscordRPC.register(ID);
// async function activity(){
//     if(!RPC) return;
//     console.log("RPC Ready - ["+formattedDate+"]")
//     RPC.setActivity({
//         type: ActivityType.Playing,
//         details: 'Visual Studio Code',
//         state: 'AFK',
//         largeImageKey: 'peewa',
//         largeImageText: 'Peewa',
//         smallImageKey: 'vsc',
//         smallImageText: 'Visual Studio Code',
//         buttons: [
//             {
//                 label: 'Add me on Discord',
//                 url: 'https://discordapp.com/users/382922598868058112'
//             }
//         ]
//     })
// }

//Start
client.on('ready', (c) =>{
    console.log("["+formattedDate+"]");
    console.log("Server Running")
    // Set bot status
    client.user.setActivity({
        name: 'Audition Next Gen',
        type: ActivityType.Playing,
        url: 'https://audition-sea.playpark.com/home',
        state: 'AFK',
        large_image: 'audinxgen',
    })

    //Set user status activity
    // activity();
})

client.login(process.env.DISCORD_TOKEN)
// RPC.login({ clientId: ID})
