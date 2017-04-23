import { GuildMember, Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import { getRandomInt, sendSimpleEmbeddedError, sendSimpleEmbeddedImage } from '../../Library/Misc';

const { hugs }: { hugs: string[] } = require('../../settings.json');

export default class HugCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'hug',
			group: 'gifs',
			memberName: 'hug',
			description: 'If you feel like huging someone.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'user',
					prompt: 'Who would you like to hug?\n',
					type: 'member',
					default: ''
				}
			]
		});
	}

	public async run(msg: CommandMessage, args: { user: GuildMember }): Promise<Message | Message[]> {
		if (!args.user) {
			return sendSimpleEmbeddedError(msg, 'Invalid format:\n Use >hug <@user>.', 5000);
		}
		const { guildhugs }: { guildhugs: string[] } = msg.client.provider.get(msg.guild, 'hugs', { guildhugs: [] });

		const n: number = getRandomInt(0, hugs.length + guildhugs.length - 1);
		let imageId: string;
		let text: string = `**${args.user.displayName}**, you got a hug from **${msg.member.displayName}**`;
		if (args.user === msg.member) {
			imageId = 'iMrHFdDEoxT5S';
			text = `**${args.user.displayName}**, have this eggplant.`;
		} else if (n < hugs.length) {
			imageId = hugs[n];
		} else {
			imageId = guildhugs[n - hugs.length];
		}
		return sendSimpleEmbeddedImage(msg, `https://media.giphy.com/media/${imageId}/giphy.gif`, text);
	}
}
