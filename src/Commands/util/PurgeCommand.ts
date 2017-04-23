import { Collection, Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import { sendSimpleEmbeddedError, sendSimpleEmbeddedSuccess } from '../../Library/Misc';

export default class PurgeCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'purge',
			aliases: ['del'],
			group: 'util',
			memberName: 'purge',
			description: 'Deletes messages. Permission to manage messages required.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'n',
					prompt: 'Amount of messages to delete, default = 1.',
					type: 'integer',
					default: ''
				}
			]
		});
	}

	public async run(msg: CommandMessage, args: { n: string }): Promise<Message | Message[]> {
		if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
			return sendSimpleEmbeddedError(msg, 'You don\'t have permission to use this command.', 5000);
		}

		let n: number = Number(args.n);
		if (isNaN(n) || n <= 0) {
			n = 1;
		}
		return msg.channel.bulkDelete(n + 1).then((value: Collection<string, Message>) =>
			sendSimpleEmbeddedSuccess(msg, `Deleted ${n} message${n > 1 ? 's' : ''}`, 5000)
		).catch(() =>
			sendSimpleEmbeddedError(msg, 'An error ocurred while deleting the messages.', 5000)
		);
	}
}
