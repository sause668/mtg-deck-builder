import type { PrismaClient } from "../../src/app/generated/prisma/client";

import { STATIC_CARD_POOL } from "./data/static-card-pool";

type CardRow = {
  scryfallId: string;
  name: string;
  imageSmall: string | null;
};

type DeckSpec = {
  name: string;
  description: string | null;
  isPublic: boolean;
  /** Number of distinct cards (rows) in this deck */
  cardCount: number;
};

const SEED_USERS: Array<{
  email: string;
  password: string;
  decks: DeckSpec[];
}> = [
  {
    email: "alex@seed.local",
    password: "seedpassword123",
    decks: [
      {
        name: "Mono Red Aggro",
        description: "Burn and creatures for quick games.",
        isPublic: true,
        cardCount: 8,
      },
    ],
  },
  {
    email: "blake@seed.local",
    password: "seedpassword123",
    decks: [
      {
        name: "Azorius Control",
        description: "Answers, sweepers, and card advantage.",
        isPublic: true,
        cardCount: 10,
      },
      {
        name: "Commander Staples",
        description: "Private pile of format staples.",
        isPublic: false,
        cardCount: 6,
      },
    ],
  },
  {
    email: "casey@seed.local",
    password: "seedpassword123",
    decks: [
      {
        name: "Green Ramp",
        description: "Mana dorks, cultivate, big threats.",
        isPublic: true,
        cardCount: 7,
      },
      {
        name: "Draft Grab Bag",
        description: "Mixed Limited picks.",
        isPublic: true,
        cardCount: 5,
      },
      {
        name: "Foils & Flex",
        description: "Private brew — not listed publicly.",
        isPublic: false,
        cardCount: 9,
      },
    ],
  },
];

export async function seedDemoWorld(prisma: PrismaClient) {
  const totalCardsNeeded = SEED_USERS.flatMap((u) => u.decks).reduce(
    (s, d) => s + d.cardCount,
    0,
  );

  const pool: CardRow[] = STATIC_CARD_POOL.map((c) => ({
    scryfallId: c.scryfallId,
    name: c.name,
    imageSmall: c.imageSmall,
  }));

  if (pool.length !== totalCardsNeeded) {
    throw new Error(
      `STATIC_CARD_POOL length (${pool.length}) must equal total deck slots (${totalCardsNeeded}).`,
    );
  }

  const seedEmails = SEED_USERS.map((u) => u.email);
  await prisma.user.deleteMany({ where: { email: { in: seedEmails } } });

  let poolIndex = 0;

  const bcrypt = await import("bcryptjs");
  for (const userSeed of SEED_USERS) {
    const hashedPassword = await bcrypt.hash(userSeed.password, 12);
    const user = await prisma.user.create({
      data: {
        email: userSeed.email,
        hashedPassword,
      },
    });

    for (const deckSpec of userSeed.decks) {
      const deck = await prisma.deck.create({
        data: {
          userId: user.id,
          name: deckSpec.name,
          description: deckSpec.description,
          isPublic: deckSpec.isPublic,
        },
      });

      const slice = pool.slice(poolIndex, poolIndex + deckSpec.cardCount);
      poolIndex += deckSpec.cardCount;

      await prisma.deckCard.createMany({
        data: slice.map((c) => ({
          deckId: deck.id,
          scryfallId: c.scryfallId,
          quantity: 1,
          name: c.name,
          imageSmall: c.imageSmall,
        })),
      });
    }
  }

  console.log(
    `Seeded ${SEED_USERS.length} users (${seedEmails.join(", ")}) with ${pool.length} card rows (offline pool).`,
  );
  console.log("Password for all seed users: seedpassword123");
}
