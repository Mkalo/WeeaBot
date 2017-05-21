import { Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import { sendSimpleEmbeddedError, sendSimpleEmbeddedSuccess } from '../../Library/Misc';

export default class AllowNsfwCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'resetlevels',
			group: 'levels',
			memberName: 'resetlevels',
			description: 'Reset all levels in guild.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},
		});
	}

	public hasPermission(msg: CommandMessage): boolean {
		return this.client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR');
	}

	public async run(msg: CommandMessage, args: { n: string }): Promise<Message | Message[]> {
		return msg.client.provider.remove(msg.guild, 'levels')
			.then(() => sendSimpleEmbeddedSuccess(msg, 'All levels have been reseted.'));
	}
}
