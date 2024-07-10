module.exports = {
    name: 'ping',
    description: "pong!",
    execute(message, args, cmd, client, Discord){
        message.channel.send('pong!')
    }
}