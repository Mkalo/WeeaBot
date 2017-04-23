import { Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import { GiphyApi } from '../../Library/GiphyApi';
import { sendSimpleEmbeddedError, sendSimpleEmbeddedImage } from '../../Library/Misc';

const { hugs }: { hugs: string[] } = require('../../settings.json');

export default class AddHugCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'addhug',
			group: 'gifs',
			memberName: 'addhug',
			description: 'Add a gif from giphy.com to the hug command. To remove a gif use `-r`.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'giphyId',
					prompt: 'What is the giphy id of the gif you wanna add?\n',
					type: 'string',
				},
				{
					key: 'remove',
					prompt: 'Do you wanna remove this giphyId?\n',
					type: 'string',
					default: ''
				}
			]
		});
	}

	public hasPermission(msg: CommandMessage): boolean {
		return this.client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR');
	}

	public async run(msg: CommandMessage, args: { giphyId: string, remove: string }): Promise<Message | Message[]> {
		if (!args.giphyId) {
			return sendSimpleEmbeddedError(msg, 'Invalid giphyId.', 5000);
		}

		const { giphyId, remove }: { giphyId: string, remove: string } = args;
		const { guildhugs }: { guildhugs: string[] } = msg.client.provider.get(msg.guild, 'hugs', { guildhugs: [] });

		if (remove === '-r') {
			const i: number = guildhugs.indexOf(giphyId);
			if (i === -1) {
				return sendSimpleEmbeddedError(msg, 'Could not find the informed giphyId.', 5000);
			}

			guildhugs.splice(i, 1);
			return msg.client.provider.set(msg.guild, 'hugs', { guildhugs })
				.then(() =>
					sendSimpleEmbeddedImage(msg, `https://media.giphy.com/media/${giphyId}/giphy.gif`, `${giphyId} successfuly removed from the list of gifs.`)
				)
				.catch(() => sendSimpleEmbeddedError(msg, 'An error ocurred while executing the command.', 5000));
		} else {
			const i: number = guildhugs.indexOf(giphyId);
			if (i !== -1) {
				return sendSimpleEmbeddedError(msg, 'This gyphyId is already in the list of hug gifs.', 5000);
			}

			GiphyApi.validateGif(giphyId)
			.then(() => {
				guildhugs.push(giphyId);
				return msg.client.provider.set(msg.guild, 'hugs', { guildhugs })
					.then(() =>
						sendSimpleEmbeddedImage(msg, `https://media.giphy.com/media/${giphyId}/giphy.gif`, `${giphyId} successfuly added to the list of gifs.`)
					)
					.catch(() => sendSimpleEmbeddedError(msg, 'An error ocurred while executing the command.', 5000));
			})
			.catch(() => sendSimpleEmbeddedError(msg, 'This giphyId is invalid.'));
		}
	}
}
