import { db } from "../src/server/db";

async function main() {
  const playerOneId = "cl9ebqhxk00003b600tymydho";
  const player1 = await db.user.upsert({
    where: {
      id: playerOneId,
    },
    create: {
      id: playerOneId,
    },
    update: {
      name: "Player One",
      image: "https://i.imgur.com/8Km9tLL.png",
    },
  });

  const playerTwoId = "cl9ebqhxk00003b600tymyd01";
  const player2 = await db.user.upsert({
    where: {
      id: playerTwoId,
    },
    create: {
      id: playerTwoId,
    },
    update: {
      name: "Player Two",
      image: "https://i.imgur.com/4XrHoTW.jpeg",
    },
  });

  const playerThreeId = "cl9ebqhxk00003b600tymyd02";
  await db.user.upsert({
    where: {
      id: playerThreeId,
    },
    create: {
      id: playerThreeId,
    },
    update: {
      name: "Player Two",
      image: "https://i.imgur.com/GDgRC8o.jpeg",
    },
  });

  const teamOneId = "cl9ebqhxk00003b600tymyt01";
  const team = await db.team.upsert({
    where: {
      id: teamOneId,
    },
    create: {
      id: playerThreeId,
      name: "Chelsea",
      managerId: playerOneId,
      players: {
        connect: [
          { id: "clpfuqvex0000im3vau7gdkja" },
          { id: player1.id },
          { id: player2.id },
        ],
      },
    },
    update: {
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png",
    },
  });

  console.log({ team });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
