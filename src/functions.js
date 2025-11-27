require('dotenv').config();
const csv = require('fast-csv');
const fs = require('fs');
const {
    EmbedBuilder,
    MessageEmbed
} = require('discord.js');
const song_list = require('./songs/songlist.json');
const tsong_list = require('./songs/tourna.json');
const roundCount_details = require('./rounds/details.json');

//Mood Selector
const moodSelector = () => {
    const mood = [
        'Uh-huh', 'Legit?', 'I see you.', 'nc1', 'gaw'
    ]
    const num = mood.length;
    const num2 = Math.floor(Math.random() * num)
    return mood[num2];
}

//Song Selector
const songSelector = () => {
    const songs = song_list;
    // console.log(songs);
    const num = songs.length;
    const num2 = Math.floor(Math.random() * num)
    const embed = new EmbedBuilder();
    embed.setColor("#00b0f4");
    embed.setTitle('Song Selected')
    embed.addFields(
        {
            name: "BPM: ",
            value: songs[num2].BPM +" BPM",
            inline: true
        },
        {
            name: "Artist: ",
            value: songs[num2].ARTIST,
            inline: true
        },
        {
            name: "Title: ",
            value: songs[num2].TITLE,
            inline: false
        }
    )
    return embed;
}

//Tourna Song Selector
const tsongSelector = () => {
    const songs = tsong_list;
    // console.log(songs);
    const num = songs.length;
    const num2 = Math.floor(Math.random() * num)
    const embed = new EmbedBuilder();
    embed.setColor("#00b0f4");
    embed.setTitle('Song Selected')
    embed.addFields(
        {
            name: "BPM: ",
            value: songs[num2].BPM +" BPM",
            inline: true
        },
        {
            name: "Artist: ",
            value: songs[num2].ARTIST,
            inline: true
        },
        {
            name: "Title: ",
            value: songs[num2].TITLE,
            inline: false
        }
    )
    return embed;
}

//Song Selector with rules
const songfbSelector = (min,max,artist) => {
    const songs = song_list;
    let selected;
    const num = songs.length;
    let isFound=true;
    let checkArtist=false;
    let noArtist=false;
    let bpmRange=false;
    let counter=0;
    const embed = new EmbedBuilder()
    if(artist !== undefined){
        for(song of songs){
            let songLower = song.ARTIST.toLowerCase();
            if(songLower.match(artist.toLowerCase())){
                checkArtist=true;
                break;
            }
        }
        if(checkArtist==true){
            while(isFound==true){
                if(counter<songs.length){
                    const num2 = Math.floor(Math.random() * num)
                    if(songs[num2].BPM>=min && songs[num2].BPM <= max){
                        let songLower = songs[num2].ARTIST.toLowerCase();
                        if(songLower.match(artist.toLowerCase())){
                            selected = songs[num2];
                            // console.log("Song req with Artist: "+selected.ARTIST+" - "+selected.TITLE)
                            isFound=false;
                            noArtist=false;
                        }else{
                            counter++;
                        }
                    }
                }else{
                    //BPM Range incorrect
                    isFound=false;
                    bpmRange=true;
                }
            }
        }else if(checkArtist==false){
            //Artist not found
            noArtist=true;
        }
    }else{
        while(isFound==true){
            if(counter<songs.length){
                const num2 = Math.floor(Math.random() * num)
                if(songs[num2].BPM>=min && songs[num2].BPM <= max){
                    selected = songs[num2];
                    isFound=false;
                    // console.log("Song req no Artist: "+selected.ARTIST+" - "+selected.TITLE)
                    noArtist=false;
                }else{
                    counter++;
                }
            }else{
                //BPM Range incorrect
                isFound=false;
                bpmRange=true;
            }
        }
    }
    if(noArtist==true){
        embed.setTitle('Uh-huh..')
        embed.setColor(0xff0000)
        embed.setDescription(`I couldn't find that artist on the list. Please try again.`)
    }else if(bpmRange==true){
        embed.setTitle('Uh-huh..')
        embed.setColor(0xff0000)
        embed.setDescription('Invalid BPM range. Please enter a value between 73 and 220.')
    }
    else{
        embed.setTitle('Song Selected')
        embed.setDescription("Rules: "+min+" - "+max)
        embed.addFields(
            {
            name: "BPM: ",
            value: selected.BPM +" BPM",
            inline: true
            },
            {
            name: "Artist: ",
            value: selected.ARTIST,
            inline: true
            },
            {
            name: "Title: ",
            value: selected.TITLE,
            inline: false
            }
        )
        embed.setColor("#00b0f4")
    }
    return embed;
}

//Read CSV file and return embed with round count
const readCSVData = async (user_ign,user_id) => new Promise((resolve, reject) => {
    const title = roundCount_details.title
    const anl_weblink = roundCount_details.anl_weblink
    const updateDate = roundCount_details.updateDate
    const footer = roundCount_details.footer
    let data2 = [];
    let isFound = true;
    fs.createReadStream('./src/rounds/rounds.csv')
        .pipe(csv.parse({ headers: false }))
        .on('error', error => {
            reject(error);
        })
        .on('data', row => {
            const ign2 = [user_ign]
            for (const ign of ign2) {
                if (row[0] == ign) {
                    data2.push({ "IGN": row[0], "round": row[1] });
                    isFound = false
                    break;
                }
            }
        })
        .on('end', () => {
            const embed = new EmbedBuilder()
            if (isFound) {
                embed.setTitle('Uh-huh..')
                embed.setColor(0xff0000)
                embed.setDescription('User '+user_ign+' was not found on the list. Please try again.')
            } else {
                embed.setTitle(title)
                embed.setURL(anl_weblink)
                embed.setDescription("<@"+user_id+">\nRound count result")
                embed.addFields(
                    {
                    name: "IGN",
                    value: user_ign,
                    inline: true
                    },
                    {
                    name: "Rounds",
                    value: data2[0].round,
                    inline: true
                    },
                    {
                    name: "",
                    value: updateDate,
                    inline: false
                    },
                )
                embed.setColor("#00b0f4")
                embed.setFooter({
                    text: footer
                });
                
            }
            resolve(embed);
        })
        .on('error', (error) => {
            console.log("Here2: "+error)
            reject(error);
        });
})

//Game Selector
const gameSelector = () => {
    const game = [
        'Valorant', 'Audi - Norms', 'R.E.P.O.', 'Audi - FB', 'Movie Marathon', 'PEAK', 'DOTA'
    ]
    const num = game.length;
    const num2 = Math.floor(Math.random() * num)
    const embed = new EmbedBuilder();
    embed.setTitle("Ang gagawin ay mag..");
    embed.setDescription(game[num2]);
    embed.setColor("#00b0f4");     
    return embed;  
    
}

module.exports = {
    songSelector: songSelector,
    tsongSelector: tsongSelector,
    songfbSelector: songfbSelector,
    readCSVData: readCSVData,
    moodSelector: moodSelector,
    gameSelector: gameSelector
}