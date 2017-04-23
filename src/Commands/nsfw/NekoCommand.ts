import { Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import * as request from 'request-promise';

export default class NekoCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'neko',
			aliases: ['catgirls', 'catgirl', 'nekos', 'nya', 'nyaa'],
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
					prompt: 'would you like to see NSFW pictures?\n',
					type: 'string',
					default: ''
				}
			]
		});
	}

	public async run(msg: CommandMessage, args: { nsfw: string }): Promise<Message | Message[]> {
		const { nsfw }: { nsfw: string } = args;

		const response: { url: string } = await request({
			uri: `http://catgirls.brussell98.tk/api${nsfw === '-nsfw' ? '/nsfw' : ''}/random`,
			headers: { 'User-Agent': `TSDiscordBot v1.0.0 (https://github.com/Mkalo/TSDiscordBot/)` },
			json: true
		});

		return msg.embed({
			color: 3447003,
			author: {
				name: `${msg.author.username} `,
				icon_url: msg.author.displayAvatarURL
			},
			image: { url: response.url }
		});
	}
}
