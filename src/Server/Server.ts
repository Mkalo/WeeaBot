import { Api } from './Routes/Api';

import { CommandoClient } from 'discord.js-commando';
import { Express } from 'express';
import { Server as HttpServer } from 'http';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

export class Server {
	private server: HttpServer;
	private client: CommandoClient;

	public constructor(port: number, client: CommandoClient) {
		this.client = client;

		const app: Express = express();

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));

		app.use('/api', (new Api(this.client)).get());
		app.set('port', port);

		this.server = http.createServer(app);
		this.server.listen(port, () => console.log('The server is ready!'));
	}
}
