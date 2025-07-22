import { PrismaClient } from "@prisma/client";
// todo: create a singleton for the prisma client to not use multiple by accident
const prisma = new PrismaClient();

export default prisma;
// This singleton ensures that only one instance of PrismaClient is used throughout the application
