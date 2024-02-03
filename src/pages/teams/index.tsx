import { type NextPage } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ErrorPage from "next/error";
import { Button } from "~/components/Button";
import { ProfileImage } from "~/components/ProfileImage";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { HiArrowLeft, HiCheck, HiX } from "react-icons/hi";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { MyTeamsPosts } from "..";
import CreateTeamModal from "~/components/team-modal/CreateTeam";
import { LinkItemCard } from "~/components/LinkItemCard";

const TeamsPage: NextPage = (): JSX.Element => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const session = useSession();

  if (session.status === "loading") {
    return <LoadingSpinner />;
  }

  if (session.status !== "authenticated") {
    return <ErrorPage statusCode={404} />;
  }

  const { user } = session.data;

  return (
    <>
      <Head>
        <title>{`RecRally - My Teams`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex flex-col items-center border-b bg-white px-3 py-2 sm:flex-row">
        <div className="flex flex-grow flex-row items-center">
          <Link href=".." className="mr-2">
            <IconHoverEffect>
              <HiArrowLeft className="h-6 w-6" />
            </IconHoverEffect>
          </Link>
          <div className="flex items-center">
            <ProfileImage src={user.image} className="flex-shrink-0" />
            <div className="ml-2">
              <h1 className="text-lg font-bold">{user.name}'s Teams</h1>
            </div>
          </div>
        </div>
        <div className="py-3 sm:py-0">
          <Button onClick={() => setCreateModalOpen(true)}>Create Team</Button>
        </div>
      </header>
      <main>
        <div className="grid-row-3 mb-2 grid auto-rows-fr gap-6 border-b p-6 sm:grid-cols-3">
          <ManagedTeams userId={user.id} />
          <PlayerTeams userId={user.id} />
          <div className="px-2">
            <h3 className="pb-2 text-lg font-bold">Invites</h3>
            <ul>
              <li className="rounded-md border hover:bg-slate-100">
                <div className="flex items-center justify-between p-2">
                  <Link className="flex-grow pl-1" href={`/teams/1`}>
                    Chelsea
                  </Link>
                  <Button className="mr-2">
                    <HiCheck />
                  </Button>
                  <Button className="bg-red-500 p-1 hover:bg-red-400 focus-visible:bg-red-400">
                    <HiX />
                  </Button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <MyTeamsPosts />
      </main>
      <CreateTeamModal
        managerId={user.id}
        isOpen={createModalOpen}
        closeModal={() => setCreateModalOpen(false)}
      />
    </>
  );
};

function ManagedTeams({ userId }: { userId: string }) {
  const {
    data: managedTeams,
    isLoading,
    isFetching,
  } = api.team.getManagerTeamsByUserId.useQuery({ userId });

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col px-2 pb-4">
      <h3 className="pb-2 text-lg font-bold">Managing</h3>
      <ul role="list">
        {managedTeams?.map((team) => (
          <li key={team.id} className="my-2 first:mt-0 last:mb-0">
            <LinkItemCard
              href={`/teams/${team.id}`}
              image={team.image}
              imageClassName="h-8 w-8 flex-shrink-0"
              title={team.name}
              subtitle={team.league?.name}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlayerTeams({ userId }: { userId: string }) {
  const {
    data: playerTeams,
    isLoading,
    isFetching,
  } = api.team.getPlayerTeamsByUserId.useQuery({ userId });

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col px-2 pb-4">
      <h3 className="pb-2 text-lg font-bold">Playing</h3>
      <ul role="list">
        {playerTeams?.length === 0 && (
          <li className="rounded border border-red-100 bg-red-50 py-6 text-center text-red-500">
            You are not a member of any teams.
          </li>
        )}
        {playerTeams?.map((team) => (
          <li key={team.id} className="my-2 first:mt-0 last:mb-0">
            <LinkItemCard
              href={`/teams/${team.id}`}
              image={team.image}
              imageClassName="h-8 w-8 flex-shrink-0"
              title={team.name}
              subtitle={team.league?.name}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamsPage;
