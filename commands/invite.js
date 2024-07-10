module.exports = {
    name: 'invite',
    description: 'Invite the bot to your server.',
    execute(message, args, cmd, client, Discord){
        message.channel.send(`invite me with: ${(process.env.INVITE)}`)
    }
}