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

import functions, { songfbSelector, songSelector } from './functions.js';

const now = new Date();
const formattedDate = now.toLocaleString();

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

    if(interaction.commandName === 'hulyo'){
        interaction.reply("Uh huh, I see you.")
    }

    if(interaction.commandName === 'jaryjary'){
        interaction.reply("ge.")
    }

    if(interaction.commandName === 'jesse'){
        interaction.reply("Babygirl")
    }

    if(interaction.commandName === 'song'){
        await interaction.deferReply();
        try{
            interaction.editReply({ embeds: [functions.songSelector()]});
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
                interaction.editReply("Please input the correct value.")
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
        // const embed = new EmbedBuilder();
        // embed.setTitle("Ang gagawin ay mag..");
        // embed.setDescription("Ako na muna mag isip leche.")
        // embed.setColor("#00b0f4");
        // interaction.editReply({ embeds: [embed] });
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

async function activity(){
    if(!RPC) return;

    RPC.setActivity({
        details: 'Audition Next Gen',
        state: 'AFK',
        largeImageKey: 'peewa',
        largeImageText: 'Peewa',
        smallImageKey: 'yay',
        smallImageText: 'yay',
    })
}

RPC.on('ready', async () =>{
    console.log("RPC Ready - ["+formattedDate+"]")
    activity();

    setInterval(() => {
        activity();
    }, 10000000)
})

//Set status activity
client.on('ready', (c) =>{
    console.log("["+formattedDate+"]");
    console.log("Server Running")
    client.user.setActivity({
        name: 'Audition Next Gen',
        type: ActivityType.Playing,
        url: 'https://audition-sea.playpark.com/home',
        state: 'AFK',
        large_image: 'audinxgen',
    })
})

client.login(process.env.DISCORD_TOKEN)
RPC.login({ clientId: ID})
