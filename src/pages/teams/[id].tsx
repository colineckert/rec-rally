import { useState } from "react";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import ErrorPage from "next/error";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { HiArrowLeft, HiOutlineMinusCircle } from "react-icons/hi";
import { ProfileImage } from "~/components/ProfileImage";
import { InfinitePostList } from "~/components/InfinitePostList";
import { useSession } from "next-auth/react";
import { ManageTeamDropdown } from "~/components/ManageTeamDropdown";
import { LinkItemCard } from "~/components/LinkItemCard";
import { getPlural } from "~/utils/formatters";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { InviteStatus } from "@prisma/client";
import { Button } from "~/components/Button";
import { LeaveTeamModal } from "~/components/team-modal/Leave";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { GameInvite } from "~/components/team-modal/GameInvite";

const TeamPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const [leaveTeamModalOpen, setLeaveTeamModalOpen] = useState(false);
  const session = useSession();
  const currentUserId = session.data?.user?.id;
  const { data: team } = api.team.getById.useQuery({ id });
  const posts = api.post.infiniteTeamFeed.useInfiniteQuery(
    { teamId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  if (!team) return <ErrorPage statusCode={404} />;

  const { name, image, description, manager, playersCount, league } = team;
  const isManager = currentUserId === manager.id;
  const isPlayer = team.players.some((player) => player.id === currentUserId);

  return (
    <>
      <Head>
        <title>{`RecRally - ${name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex flex-col items-center border-b bg-white px-3 py-2 sm:flex-row">
        <div className="flex flex-grow flex-row items-center">
          <Link href="/teams" className="mr-2">
            <IconHoverEffect>
              <HiArrowLeft className="h-6 w-6" />
            </IconHoverEffect>
          </Link>
          <div className="flex items-center">
            <ProfileImage src={image} className="flex-shrink-0" />
            <div className="ml-2">
              <h1 className="text-lg font-bold">{team.name}</h1>
              <div className="text-gray-500">
                Manager: {manager.name}
                {" - "}
                {playersCount} {getPlural(playersCount, "Player", "Players")}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 py-3 sm:py-0">
          {isPlayer && (
            <Button
              className="bg-red-500 hover:bg-red-400 focus-visible:bg-red-400"
              onClick={() => setLeaveTeamModalOpen(true)}
            >
              Leave
            </Button>
          )}
          {isManager && (
            <div className="flex gap-2">
              <GameInvite team={team} />
              <ManageTeamDropdown team={team} />
            </div>
          )}
        </div>
      </header>
      <main>
        <div className="grid-row-3 mb-2 grid auto-rows-fr gap-6 border-b p-6 sm:grid-cols-3">
          <div className="px-2">
            {description ? (
              <div className="pb-4">
                <h3 className="pb-2 text-lg font-bold">About</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ) : null}
            <div className="pb-4">
              <h3 className="pb-2 text-lg font-bold">Manager</h3>
              <LinkItemCard
                href={`/profiles/${manager.id}`}
                image={manager.image}
                title={manager.name}
              />
            </div>
            <div>
              <h3 className="pb-2 text-lg font-bold">League</h3>
              {league ? (
                <Link href={`/leagues/${league.id}`}>
                  <span className="text-gray-600">{league.name}</span>
                </Link>
              ) : (
                <span className="text-gray-600">No league</span>
              )}
            </div>
          </div>
          <div>
            <TeamPlayers players={team.players} />
            {isManager && <TeamInvites teamId={team.id} />}
          </div>
          <TeamGames teamId={team.id} />
        </div>
        <InfinitePostList
          posts={posts.data?.pages?.flatMap((page) => page.posts) ?? []}
          isError={posts.isError}
          isLoading={posts.isLoading}
          hasMore={posts.hasNextPage}
          fetchNewPosts={posts.fetchNextPage}
        />
      </main>
      <LeaveTeamModal
        teamId={id}
        teamName={name}
        isOpen={leaveTeamModalOpen}
        closeModal={() => setLeaveTeamModalOpen(false)}
      />
    </>
  );
};

function TeamPlayers({
  players,
}: {
  players: Array<{ id: string; name: string | null; image: string | null }>;
}) {
  if (players.length === 0) {
    return (
      <div className="px-2 pb-4">
        <h3 className="pb-2 text-lg font-bold">Players</h3>
        <div className="rounded border border-red-100 bg-red-50 py-6 text-center text-red-500">
          No players on this team yet.
        </div>
      </div>
    );
  }
  return (
    <div className="px-2 pb-4">
      <h3 className="pb-2 text-lg font-bold">Players</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id} className="my-2 first:mt-0 last:mb-0">
            <LinkItemCard
              href={`/profiles/${player.id}`}
              image={player.image}
              title={player.name}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamInvites({ teamId }: { teamId: string }) {
  const trpcUtils = api.useUtils();
  const { data: invites, isLoading } = api.invite.getPendingByTeamId.useQuery({
    teamId,
  });

  const updateInvite = api.invite.update.useMutation({
    onSuccess: async () => {
      await trpcUtils.invite.getPendingByTeamId.invalidate({ teamId });
    },
  });

  function handleInviteCancel(id: string) {
    updateInvite.mutate({ id, status: InviteStatus.CANCELED });
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (invites?.length === 0) {
    return (
      <div className="px-2">
        <h3 className="pb-2 text-lg font-bold">Invites</h3>
        <div className="rounded border border-gray-100 bg-gray-50 py-6 text-center text-gray-500">
          No pending invites.
        </div>
      </div>
    );
  }

  return (
    <div className="px-2">
      <h3 className="pb-2 text-lg font-bold">Invites</h3>
      <ul>
        {invites?.map((invite) => (
          <li key={invite.id} className="my-2 first:mt-0 last:mb-0">
            <LinkItemCard
              href={`/profiles/${invite.player.id}`}
              image={invite.player.image}
              title={invite.player.name}
              children={
                <button onClick={() => handleInviteCancel(invite.id)}>
                  <HiOutlineMinusCircle className="h-8 w-8 text-gray-400 hover:text-gray-500" />
                </button>
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamGames({ teamId }: { teamId: string }) {
  const { data: games, isLoading } = api.game.getByTeamId.useQuery({ teamId });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (games?.length === 0) {
    return (
      <div className="px-2">
        <h3 className="pb-2 text-lg font-bold">Games</h3>
        <div className="rounded border border-gray-100 bg-gray-50 py-6 text-center text-gray-500">
          No recent games.
        </div>
      </div>
    );
  }

  return (
    <div className="px-2">
      <h3 className="pb-2 text-lg font-bold">Recent Games</h3>
      <ul>
        {games?.map((game) => <GameListItem game={game} teamId={teamId} />)}
      </ul>
    </div>
  );
}

type GameListItemProps = {
  game: inferProcedureOutput<AppRouter["game"]["getById"]>;
  teamId: string;
};

function GameListItem({ game, teamId }: GameListItemProps) {
  if (!game) return null;

  const isHome = game.homeTeamId === teamId;
  const teamScore = isHome ? game.homeScore : game.awayScore;
  const opponentScore = isHome ? game.awayScore : game.homeScore;
  const opponentId = isHome ? game.awayTeamId : game.homeTeamId;

  const { data: opponent, isLoading } = api.team.getById.useQuery({
    id: opponentId,
  });

  function getGameResult() {
    if (teamScore > opponentScore) {
      return (
        <div className="flex text-green-500">
          <div className="mr-2 content-center rounded-lg bg-green-500 px-2 text-sm text-white">
            W
          </div>
          <span>
            {teamScore} - {opponentScore}
          </span>
        </div>
      );
    } else if (teamScore < opponentScore) {
      return (
        <div className="flex text-red-500">
          <div className="mr-2 content-center rounded-lg bg-red-500 px-2 text-sm text-white">
            L
          </div>
          <span>
            {teamScore} - {opponentScore}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex text-gray-500">
          <div className="mr-2 content-center rounded-lg bg-gray-500 px-2 text-sm text-white">
            D
          </div>
          <span>
            {teamScore} - {opponentScore}
          </span>
        </div>
      );
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <li
      key={game.id}
      className="grid grid-cols-3 items-start border-b border-gray-200 py-2 first:pt-0 last:border-none"
    >
      <div className="justify-self-start">{getGameResult()}</div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-500">
          {game.homeTeamId === teamId ? "vs" : "@"}
        </span>
        <span className="pt-1 text-xs text-gray-500">
          {new Date(game.date).toLocaleDateString()}
        </span>
      </div>
      <div className="flex flex-col justify-self-end text-sm">
        <Link href={`/teams/${opponentId}`}>{opponent?.name}</Link>
        {game.friendly ? (
          <p className="text-xs text-gray-500">Friendly</p>
        ) : null}
      </div>
    </li>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>,
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/teams",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.team.getById.prefetch({ id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
}

export default TeamPage;
