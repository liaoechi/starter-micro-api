var http = require('http');
http.createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`)
    res.write('Yo!');
    res.end();
}).listen(process.env.PORT || 3000);

// Require necessary node modules
// Make the variables inside the .env element available to our Node project
require('dotenv').config();

const tmi = require('tmi.js');
var p_yen_count = 0;

// Setup connection configurations
// These include the channel, username and password
const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },

    // Set up identity of chatbot
    identity: {
        username: `${process.env.TWITCH_USERNAME}`,
        password: `oauth:${process.env.TWITCH_OAUTH}`
    },
    channels: [`${process.env.TWITCH_CHANNEL}`]
});

// Connect to the channel specified using the setings found in the configurations
// Any error found shall be logged out in the console
client.connect().catch(console.error);

// We shall pass the parameters which shall be required
client.on('message', (channel, tags, message, self) => {
    // Lack of this statement or it's inverse (!self) will make it in active
    if (self) return;

    // Create up a switch statement with some possible commands and their outputs
    // The input shall be converted to lowercase form first
    // The outputs shall be in the chats
    
    switch (message.toLowerCase()) {
        // Use 'tags' to obtain the username of the one who has keyed in a certain input
        // 'channel' shall be used to specify the channel name in which the message is going to be displayed
        //For one to send a message in a channel, you specify the channel name, then the message
        // We shall use backticks when using tags to support template interpolation in JavaScript
        
        // In case the message in lowercase is equal to the string 'commands', send the sender of that message some of the common commands

        case '!commands':
            client.say(channel, `@${tags.username}, available commands are:
            Commands Help Greetings Hi !Website !Name
            For more help just type "Help"
            `);
            break;
        
        case 'p-yen': case 'piyan':
            p_yen_count++;
            client.say(channel, `@${tags.username}, Haha P-yen pai duay! LUL P-yen was mentioned ${p_yen_count} times.`);
            break;
        
        case 'dc': case 'discord':
            client.say(channel, "Gadra's discord channel link can be found here: https://discord.gg/vZ7US3VFhG")
            break;

            // In case the message in lowercase is equal to the string '!website', send the sender of that message your personal website
        case '!website':
            client.say(channel, `@${tags.username}, www.facebook.com/magicgadra2`);
            break;
            
            // In case the message in lowercase is equal to the string 'greetings', send the sender of that message 'Hello @Username, what's up?!'
        case 'greetings': case 'hi': case 'hello':
            client.say(channel, `Hello @${tags.username}, welcome to Gadra's sewer! VoHiYo`);
            break;
            
            // In case the message in lowercase is equal to the string '!name', send the sender of that message the name of the chatbot
        case '!bot':
            client.say(channel, `Hello @${tags.username}, my name is WonkoBot I am just a slave in Gadra's chat.`);
            break;
            
            // In case the message in lowercase is equal to the string 'help', send the sender of that message all the available help and commands
        case 'help':
            client.say(channel, `${tags.username}, Use the following commands to get quick help:
            -> Commands: Get Commands || 
            Help: Get Help || 
            Greetings: Get Greetings || 
            Hi: Get "Hola" || 
            !Website: Get my website || 
            !Name: Get my name || 
            !Cheer first_name second_name: Cheer first_name second_name || Cheers first_name second_name: Cheer first_name second_name --
            For more help just ping me up!
            `);
            break;
            
            
            // In case the message in lowercase is none of the above, check whether it is equal to '!upvote' or '!cheers'
            // these are used to  like certain users' messages or celebrate them due to an achievement
            
        default:
            // We shall convert the message into a string in which we shall check for its first word
            // and use the others for output
            let mymessage = message.toString();
            
            if ((mymessage.split(' ')[0]).toLowerCase() === '!cheer' || 'cheers') {
                client.say(channel, `HSCheers @${(mymessage.split(' ')[1])} HSCheers you have been Kanpai/Cheers by ${ tags.username }`);
            }
            break;
    }
    
// This logs out all the messages sent on the channel on the terminal
    //console.log(message);

});