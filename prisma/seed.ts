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
      name: "Player Three",
      image: "https://i.imgur.com/GDgRC8o.jpeg",
    },
  });

  const playerFourId = "cl9ebqhxk00003b600tymyd03";
  await db.user.upsert({
    where: {
      id: playerFourId,
    },
    create: {
      id: playerFourId,
    },
    update: {
      name: "Player Four",
    },
  });

  const teamOneId = "cl9ebqhxk00003b600tymyt01";
  const team1 = await db.team.upsert({
    where: {
      id: teamOneId,
    },
    create: {
      id: teamOneId,
      name: "Chelsea",
      managerId: playerOneId,
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png",
      players: {
        connect: [
          { id: "clpfuqvex0000im3vau7gdkja" },
          { id: player1.id },
          { id: player2.id },
        ],
      },
    },
    update: {},
  });

  const teamTwoId = "cl9ebqhxk00003b600tymyt02";
  const team2 = await db.team.upsert({
    where: {
      id: teamTwoId,
    },
    create: {
      id: teamTwoId,
      name: "Aston Villa",
      managerId: playerTwoId,
      image:
        "https://www.shutterstock.com/image-vector/aston-englandseptember-14-2023aston-villa-600nw-2361639603.jpg",
      players: {
        connect: [
          { id: "clpfuqvex0000im3vau7gdkja" },
          { id: playerThreeId },
          { id: playerFourId },
        ],
      },
    },
    update: {},
  });

  const leagueOneId = "cl9ebqhxk00003b600tymyl01";
  const league = await db.league.upsert({
    where: {
      id: leagueOneId,
    },
    create: {
      id: leagueOneId,
      name: "Premier League",
      teams: {
        connect: [{ id: team1.id }, { id: team2.id }],
      },
    },
    update: {},
  });

  console.log("League:", { league });
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
