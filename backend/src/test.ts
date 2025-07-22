import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
	const user = await prisma.user.findFirst({
		select: {
			id: true,
			role: true,
		},
	});
	console.log(user?.role);
}

test();
