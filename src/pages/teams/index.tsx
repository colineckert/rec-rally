import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ErrorPage from "next/error";
import { Button } from "~/components/Button";
import { ProfileImage } from "~/components/ProfileImage";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { HiArrowLeft } from "react-icons/hi";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/LoadingSpinner";

const TeamsPage: NextPage = () => {
  const session = useSession();

  if (session.status === 'loading') {
    return <LoadingSpinner />;
  }

  if (session.status !== 'authenticated') {
    return <ErrorPage statusCode={404} />;
  }

  const currentUser = session?.data?.user;

  return (
    <>
      <Head>
        <title>{`Pitchup - My Teams`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <HiArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={currentUser.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{currentUser.name}'s Teams</h1>
          <div className="text-gray-500">
          </div>
        </div>
        <Button onClick={() => console.log('Create a team click')}>Create Team</Button>
      </header>
      <main>
        <h2>Teams</h2>
        <PlayerTeams userId={currentUser.id} />
        <ManagedTeams userId={currentUser.id} />
      </main>
    </>
  );
}

function PlayerTeams({ userId }: { userId: string }) {
  const { data: playerTeams, isLoading } = api.team.getPlayerTeamsByUserId.useQuery({ userId });

  if (isLoading) {
    return <LoadingSpinner />;  
  }

  return (
    <ul>
      {playerTeams?.map((team) => (
        <li key={team.id}>
          <h4>{team.name}</h4>
        </li>
      ))}
    </ul>
  );
}

function ManagedTeams({ userId }: { userId: string }) {
  const { data: managedTeams, isLoading } = api.team.getManagerTeamsByUserId.useQuery({ userId });

  if (isLoading) {
    return <LoadingSpinner />;  
  }

  return (
    <ul>
      {managedTeams?.map((team) => (
        <li key={team.id}>
          <h4>{team.name}</h4>
        </li>
      ))}
    </ul>
  );
}


export default TeamsPage;
