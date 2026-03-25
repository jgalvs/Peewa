require('dotenv').config();

const {
    REST, Routes,
    ApplicationCommand,
    ApplicationCommandOptionType
} = require('discord.js');

const commands = [
    {
        name: 'rounds',
        description: 'Get round count',
        options: [
            {
                name: 'ign',
                description: 'Your in game name',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ],
    },
    {
        name: 'song',
        description: 'Ako na mamili.'
    },
    {
        name: 'tourna',
        description: 'Ako na mamili.'
    },
    {
        name: 'songfb',
        description: 'Ako na mamili with rules.',
        options: [
            {
                name: 'min',
                description: 'Minimum BPM',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
            {
                name: 'max',
                description: 'Maximum BPM',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
            {
                name: 'artist',
                description: 'Artist',
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ],
    },
    // {
    //     name: 'hulyo',
    //     description: 'Your Majesty'
    // },
    // {
    //     name: 'jesse',
    //     description: 'Queen'
    // },
    // {
    //     name: 'jaryjary',
    //     description: 'jayr'
    // },
    {
        name: 'mood',
        description: 'Word of the day'
    },
    {
        name: 'nugagawen',
        description: 'Ako na mag decide.'
    }
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () =>{
    try{
        console.log('Registering slash commands');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {
                body: commands
            }
        )
        console.log("Done");
    }catch (error){
        console.log(`Error: ${error}`)
    }
})();