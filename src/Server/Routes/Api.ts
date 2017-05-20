import { LevelEntry, LevelsMap } from '../../Library/Levels';

import { Guild, GuildMember } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { NextFunction, Request, Response, Router } from 'express';

interface MemberResult {
	id: string;
	name: string;
	avatarURL: string;
	displayName: string;
	displayColor: number;
	displayHexColor: string;
	level: LevelEntry;
};

export class Api {
	public route: Router;
	private client: CommandoClient;

	constructor(client: CommandoClient) {
		this.client = client;

		this.route = Router();

		this.route.get('/guilds/:id/members', (req: Request, res: Response, next: NextFunction) => {
			const guild: Guild = this.client.guilds.get(req.params.id);
			if (guild) {
				guild.fetchMembers()
					.then((result: Guild) => {
						const levels: LevelsMap = this.client.provider.get(result, 'levels') || {};
						const members: MemberResult[] = [];
						result.members.forEach((member: GuildMember) => {
							members.push({
								id: member.id,
								name: member.user.username,
								avatarURL: member.user.displayAvatarURL,
								displayName: member.displayName,
								displayColor: member.displayColor,
								displayHexColor: member.displayHexColor,
								level: levels[member.id] || { level: 0, experience: 0, totalExperience: 0 }
							});
						});
						res.send({ status: 200, members });
					});
			} else {
				next();
			}
		});

		this.route.get('*', (req: Request, res: Response) => {
			res.status(404);
			res.send({ status: 404 });
		});

	}

	public get(): Router {
		return this.route;
	}
}
