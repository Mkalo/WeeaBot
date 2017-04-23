import { Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';

export function sendSimpleEmbededMessage(msg: CommandMessage, text: string, color: number, timeout?: number): Promise<Message | Message[]> {
	const promise: Promise<Message | Message[]> = msg.embed({
		color,
		author: {
			name: `${msg.author.username} `,
			icon_url: msg.author.displayAvatarURL
		},
		description: `${text}`
	});
	if (timeout) {
		promise.then((reply: Message) => {
			reply.delete(timeout).catch(() => undefined);
		});
	}
	return promise;
}

export function sendSimpleEmbeddedError(msg: CommandMessage, text: string, timeout?: number): Promise<Message | Message[]> {
	return sendSimpleEmbededMessage(msg, text, 16711680, timeout);
}

export function sendSimpleEmbeddedSuccess(msg: CommandMessage, text: string, timeout?: number): Promise<Message | Message[]> {
	return sendSimpleEmbededMessage(msg, text, 3447003, timeout);
}

export function sendSimpleEmbeddedImage(msg: CommandMessage, url: string, description?: string): Promise<Message | Message[]> {
	return msg.embed({
		color: 3447003,
		author: {
			name: `${msg.author.username} `,
			icon_url: msg.author.displayAvatarURL
		},
		image: { url },
		description
	});
}

export function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
