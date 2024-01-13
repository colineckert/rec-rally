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
import { MyTeamsPosts } from "..";
import { HiChevronRight } from "react-icons/hi";

const TeamsPage: NextPage = (): JSX.Element => {
  const session = useSession();

  const trpcUtils = api.useUtils();
  const createTeam = api.team.create.useMutation({
    onSuccess: (newTeam) => {
      console.log("Team Created:", newTeam);

      trpcUtils.team.getManagerTeamsByUserId.setData(
        { userId: user.id },
        (oldData) => {
          if (oldData == null) return;
          return [...oldData, newTeam];
        },
      );
    },
  });

  if (session.status === "loading") {
    return <LoadingSpinner />;
  }

  if (session.status !== "authenticated") {
    return <ErrorPage statusCode={404} />;
  }

  const { user } = session.data;

  const handleCreateTeamClick = () => {
    console.log("***Create a team click***");

    createTeam.mutate({
      name: "Arsenal - test 2",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png",
    });
  };

  return (
    <>
      <Head>
        <title>{`Pitchup - My Teams`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex flex-col items-center border-b bg-white px-4 py-2 sm:flex-row">
        <div className="flex flex-grow items-center">
          <Link href=".." className="mr-2">
            <IconHoverEffect>
              <HiArrowLeft className="h-6 w-6" />
            </IconHoverEffect>
          </Link>
          <ProfileImage src={user.image} className="flex-shrink-0" />
          <div className="ml-2 flex-grow">
            <h1 className="text-lg font-bold">{user.name}'s Teams</h1>
            <div className="text-gray-500"></div>
          </div>
        </div>
        <Button className="m-3 sm:m-1" onClick={handleCreateTeamClick}>
          Create Team
        </Button>
      </header>
      <main>
        <div className="grid-row-3 mb-2 grid auto-rows-fr border-b p-6 sm:grid-cols-3">
          <ManagedTeams userId={user.id} />
          <PlayerTeams userId={user.id} />
          <div className="px-2 sm:text-end">
            <h3 className="pb-2 text-lg font-bold">Invites</h3>
            <ul>
              <li>
                <Link href={`/teams/1`}>Chelsea</Link>
              </li>
            </ul>
          </div>
        </div>
        <MyTeamsPosts />
      </main>
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
      <h3 className="pb-2 text-lg font-bold">Managed Teams</h3>
      <ul role="list">
        {managedTeams?.map((team) => (
          <li
            key={team.id}
            className="group/item my-2 rounded-md border hover:bg-slate-100"
          >
            <div className="flex items-center justify-between p-2">
              <ProfileImage
                src={team.image}
                className="mr-3 h-8 w-8 flex-shrink-0"
              />
              <div className="flex-grow">
                <span>{team.name}</span>
                <p className="text-sm text-gray-500">Manager: You</p>
              </div>
              <Link
                href={`/teams/${team.id}`}
                className="group/edit invisible flex items-center rounded-full p-2 text-gray-500 hover:bg-slate-200 group-hover/item:visible"
              >
                <span className="mr-1 text-sm group-hover/edit:text-gray-700">
                  Visit
                </span>
                <HiChevronRight className="group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500" />
              </Link>
            </div>
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
      <h3 className="pb-2 text-lg font-bold">Player Teams</h3>
      <ul role="list">
        {playerTeams?.length === 0 && (
          <li className="rounded border border-red-100 bg-red-50 py-6 text-center text-red-500">
            You are not a member of any teams.
          </li>
        )}
        {playerTeams?.map((team) => (
          <li
            key={team.id}
            className="group/item my-2 rounded-md border hover:bg-slate-100"
          >
            <div className="flex items-center justify-between p-2">
              <ProfileImage
                src={team.image}
                className="mr-3 h-8 w-8 flex-shrink-0"
              />
              <div className="flex-grow">
                <span>{team.name}</span>
                <p className="text-sm text-gray-500">Manager: You</p>
              </div>
              <Link
                href={`/teams/${team.id}`}
                className="group/edit invisible flex items-center rounded-full p-2 text-gray-500 hover:bg-slate-200 group-hover/item:visible"
              >
                <span className="mr-1 text-sm group-hover/edit:text-gray-700">
                  Visit
                </span>
                <HiChevronRight className="group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamsPage;
