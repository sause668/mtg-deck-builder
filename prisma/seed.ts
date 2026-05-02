import "dotenv/config";

import { prisma } from "../src/lib/prisma";
import { seedDemoWorld } from "./seeds/demo-world";

async function main() {
  await seedDemoWorld(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
