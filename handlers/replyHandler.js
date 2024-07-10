"use strict";

const { MessageType, InteractionType } = require("discord.js");

//type of message: message.type === 'APPLICATION_COMMAND' can be defered .followed and .replied
//                 message.type === 'MESSAGE_COMPONENT'   can be defered .followed and .replied
//                 message.type === 'DEFAULT'             can only be message.channel.send

// editReply should be used when you deferred a reply
// followup should only be used if a message has been send before

//DEFAULT = 0 = MessageType.Default
//APPLICATION_COMMAND = 2 = InteractionType.ApplicationCommand
//MESSAGE_COMPONENT = 3 = InteractionType.MessageComponent
/**
 * @abstract
 */
class Reply {
	constructor() {
		throw new Error("You can't initiate a utility class !!!");
	}
	/**
	 * @param {object} message the message or interaction component
	 * @param {object} content - the reply content
	 * @returns {Promise<void>}
	 */

	static send(message, content) {
		try {
			//if (message.type === InteractionType.ApplicationCommand || message.type === InteractionType.MessageComponent) {
			//	message.reply(content);
			//} else {
				message.channel.send(content);
			//}
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * @description Used when a reply will take longer than 3 seconds
	 * @description Do not use in buttons
	 */
	static async deferReply(message, invisible) {
		if (message.type === InteractionType.ApplicationCommand || message.type === InteractionType.MessageComponent) {
			await message.deferReply({ ephemeral: invisible });
		} else {
			return;
		}
	}

	/**
	 * @description Used to acknowledge buttons
	 * @description To send a message after this use follow
	 * @description To edit the message with the button use editReply
	 */
	static async deferUpdate(message) {
		if (message.type === InteractionType.MessageComponent) {
			await message.deferUpdate();
		} else {
			return;
		}
	}

	/**
	 * @description edits a deferred message or sends a message if it's a messageCommand
	 */
	static editReply(message, content) {
		try {
			if (message.type === InteractionType.ApplicationCommand || message.type === InteractionType.MessageComponent) {
				//removed && message.options don't know what it did
				message.editReply(content);
			} else message.channel.send(content);
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * @description sends a message after a deferred message (must first use editReply after deferReply)
	 */
	static follow(message, content) {
		try {
			if (message.type === InteractionType.ApplicationCommand || message.type === InteractionType.MessageComponent) {
				message.followUp(content);
			} else {
				message.channel.send(content);
			}
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * @description dms the user in the messageObject
	 */
	static dm(message, content) {
		message.member.user
			.send(content)
			.then(() => this.follow(message, { content: "Check your DMs!", ephemeral: true }))
			.catch((err) => {
				console.log(err);
				this.follow(message, { content: "Couldn't DM you, are your DMs enabled?", ephemeral: true });
			});
	}
}

module.exports = Reply;
