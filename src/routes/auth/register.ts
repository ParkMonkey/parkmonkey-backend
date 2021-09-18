import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { generateSessionToken } from '~/utils/generate-session-token';

type RegisterBody = {
	username: string;
	email: string;
	password: string;
};

export default async function registerRoute(app: FastifyInstance) {
	app.post('/auth/register', async (request, reply) => {
		const { username, email, password } = request.body as RegisterBody;

		let result: User | undefined;
		if (username && email && password) {
			try {
				result = await request.prisma.user.create({
					data: {
						email,
						username,
						passwordHash: await bcrypt.hash(password, 10),
					},
				});
			} catch {
				return reply
					.status(StatusCodes.CONFLICT)
					.send('Email or username already in use.');
			}
		} else {
			return reply
				.status(StatusCodes.BAD_REQUEST)
				.send('One or more required fields is empty.');
		}

		if (result) {
			const sessionToken = await generateSessionToken(result.id, request);
			return reply.status(StatusCodes.CREATED).send({
				sessionToken,
			});
		}
		return reply.status(StatusCodes.BAD_REQUEST);
	});
}
