import type {
	FastifyPluginCallback,
	FastifyReply,
	FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';
import { StatusCodes } from 'http-status-codes';

const auth: FastifyPluginCallback<Record<string, never>> = async (
	app,
	_options,
	_next
) => {
	app.decorate(
		'authenticate',
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const authHeader = request.headers.authorization;
				if (!authHeader) {
					throw new Error('Not authenticated!');
				}
				const sessionToken = authHeader.replace('Bearer ', '');
				const userSession = await request.prisma.userSession.findUnique({
					select: {
						userId: true,
					},
					where: {
						sessionToken,
					},
				});
				if (!userSession?.userId) {
					throw new Error('Invalid or expired session token.');
				}
				request.user = {
					id: userSession.userId,
					sessionToken,
				};
			} catch (error) {
				reply.status(StatusCodes.UNAUTHORIZED).send(error);
			}
		}
	);
};

const fastifyAuthPlugin = fp(auth, { name: 'fastify-auth-plugin' });

export default fastifyAuthPlugin;

declare module 'fastify' {
	interface FastifyInstance {
		authenticate: () => void;
	}
	interface FastifyRequest {
		user?: {
			id: number;
			sessionToken: string;
		};
	}
}
