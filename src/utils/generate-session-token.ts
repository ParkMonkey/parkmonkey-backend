import { FastifyRequest } from 'fastify';
import { nanoid } from 'nanoid';

export async function generateSessionToken(
	userId: number,
	context: FastifyRequest
): Promise<string> {
	const sessionToken = nanoid();
	await context.prisma.userSession.create({
		data: {
			userId,
			sessionToken,
		},
	});
	return sessionToken;
}
