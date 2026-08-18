import "dotenv/config";

import { hash } from "bcryptjs";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not defined in .env`);
  }

  return value;
}

const connectionString = getRequiredEnv("DATABASE_URL");

const adminEmail = getRequiredEnv("ADMIN_EMAIL").trim().toLowerCase();

const adminPassword = getRequiredEnv("ADMIN_PASSWORD");

const adminName = process.env.ADMIN_NAME?.trim() || "Chantha";

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const passwordHash = await hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: {
      email: adminEmail,
    },

    update: {
      name: adminName,
      passwordHash,
      isActive: true,
    },

    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      isActive: true,
    },
  });

  console.log(`Admin account ready: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
