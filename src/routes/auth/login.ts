import bcrypt from 'bcrypt';
import type { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { generateSessionToken } from '~/utils/generate-session-token';

type LoginBody = {
	username?: string;
	email?: string;
	password: string;
};

export default async function loginRoute(app: FastifyInstance) {
	app.post('/auth/login', async (request, reply) => {
		const { username, email, password } = request.body as LoginBody;

		let result;
		if (username !== undefined) {
			result = await request.prisma.user.findFirst({
				select: {
					id: true,
					passwordHash: true,
				},
				where: {
					username: {
						equals: username,
					},
				},
			});
		} else if (email !== undefined) {
			result = await request.prisma.user.findFirst({
				select: {
					id: true,
					passwordHash: true,
				},
				where: {
					email: {
						equals: email,
					},
				},
			});
		} else {
			return reply
				.status(StatusCodes.BAD_REQUEST)
				.send('At least one of username or email must be provided.');
		}

		if (result === null) {
			return reply
				.status(StatusCodes.UNAUTHORIZED)
				.send('Incorrect username or password.');
		}

		if (await bcrypt.compare(password, result.passwordHash)) {
			const sessionToken = await generateSessionToken(result.id, request);
			return reply.status(StatusCodes.OK).send({
				sessionToken,
			});
		} else {
			return reply
				.status(StatusCodes.UNAUTHORIZED)
				.send('Incorrect username or password.');
		}
	});
}
