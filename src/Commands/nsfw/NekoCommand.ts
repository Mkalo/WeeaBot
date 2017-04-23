import { Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import * as request from 'request-promise';
import { sendSimpleEmbeddedError, sendSimpleEmbeddedImage } from '../../Library/Misc';

export default class NekoCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'neko',
			group: 'nsfw',
			memberName: 'neko',
			description: 'Posts a random catgirl.',
			details: 'Posts a random catgirl. Add `-nsfw` to the command to get nsfw pictures.',
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'nsfw',
					prompt: 'Would you like to see NSFW pictures?\n',
					type: 'string',
					default: ''
				}
			]
		});
	}

	public async run(msg: CommandMessage, args: { nsfw: string }): Promise<Message | Message[]> {
		const nsfwChannel: boolean = !msg.guild ? true : msg.client.provider.get(msg.guild, `nsfw-${msg.channel.id}`, false);
		const { nsfw }: { nsfw: string } = args;
		if (nsfw === '-nsfw' && !nsfwChannel) {
			return sendSimpleEmbeddedError(msg, 'You can only use this command in a nsfw channel!', 5000);
		}

		const response: { url: string } = await request({
			uri: `http://catgirls.brussell98.tk/api${nsfw === '-nsfw' ? '/nsfw' : ''}/random`,
			headers: { 'User-Agent': `WeeaBot v1.0.0 (https://github.com/Mkalo/TSDiscordBot/)` },
			json: true
		});

		return sendSimpleEmbeddedImage(msg, response.url);
	}
}
