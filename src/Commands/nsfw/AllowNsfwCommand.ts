import { Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import { sendSimpleEmbeddedError, sendSimpleEmbeddedSuccess } from '../../Library/Misc';

export default class AllowNsfwCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'allownsfw',
			group: 'nsfw',
			memberName: 'allownsfw',
			description: 'Enable and disable nsfw commands in the current channel. Administrator permission required.',
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
		const nsfw: boolean = msg.client.provider.get(msg.guild, `nsfw-${msg.channel.id}`, false);
		msg.client.provider.set(msg.guild, `nsfw-${msg.channel.id}`, !nsfw);
		if (!nsfw) {
			return sendSimpleEmbeddedSuccess(msg, 'Nsfw commands enabled in this channel!');
		} else {
			return sendSimpleEmbeddedSuccess(msg, 'Nsfw commands disabled in this channel!');
		}
	}
}
