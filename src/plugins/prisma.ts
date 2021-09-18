import { PrismaClient } from '@prisma/client';
import type { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const prismaClient: FastifyPluginCallback<Record<string, never>> = async (
	app,
	_options,
	next
) => {
	if (app.prisma) {
		return next(new Error('fastify-prisma-client has been defined before'));
	}

	const prisma = new PrismaClient();

	await prisma.$connect();
	app
		.decorate('prisma', { getter: () => prisma })
		.decorateRequest('prisma', { getter: () => app.prisma })
		.addHook('onClose', async (closedApp, done) => {
			closedApp.prisma.$disconnect();
			done();
		});

	return next();
};

const fastifyPrismaPlugin = fp(prismaClient, {
	name: 'fastify-prisma-client',
});

export default fastifyPrismaPlugin;

declare module 'fastify' {
	interface FastifyRequest {
		prisma: PrismaClient;
	}
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}
