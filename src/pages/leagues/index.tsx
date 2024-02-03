import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ErrorPage from "next/error";
import { ProfileImage } from "~/components/ProfileImage";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { HiArrowLeft, HiBookmark } from "react-icons/hi";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { MyTeamsPosts } from "..";
import { getPlural } from "~/utils/formatters";
import { LinkItemCard } from "~/components/LinkItemCard";

const LeaguesPage: NextPage = (): JSX.Element => {
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
        <title>{`RecRally - Leagues`}</title>
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
              <h1 className="text-lg font-bold">{user.name}'s Leagues</h1>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="grid-row-3 mb-2 grid auto-rows-fr gap-6 border-b p-6 sm:grid-cols-3">
          <PlayerLeagues userId={user.id} />
          {/* <div className="px-2">
            <h3 className="pb-2 text-lg font-bold">Invites</h3>
            <ul>
              <li className="my-2 rounded-md border hover:bg-slate-100">
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
          </div> */}
        </div>
        {/* TODO: implement league posts */}
        <MyTeamsPosts />
      </main>
      {/* <CreateTeamModal
        managerId={user.id}
        isOpen={createModalOpen}
        closeModal={() => setCreateModalOpen(false)}
      /> */}
    </>
  );
};

// function ManagedTeams({ userId }: { userId: string }) {
//   const {
//     data: managedTeams,
//     isLoading,
//     isFetching,
//   } = api.team.getManagerTeamsByUserId.useQuery({ userId });

//   if (isLoading || isFetching) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="flex flex-col px-2 pb-4">
//       <h3 className="pb-2 text-lg font-bold">Managed Teams</h3>
//       <ul role="list">
//         {managedTeams?.map((team) => (
//           <li
//             key={team.id}
//             className="group/item my-2 rounded-md border hover:bg-slate-100"
//           >
//             <div className="flex items-center justify-between p-2">
//               <ProfileImage
//                 src={team.image}
//                 className="mr-3 h-8 w-8 flex-shrink-0"
//               />
//               <div className="flex-grow">
//                 <span>{team.name}</span>
//                 <p className="text-sm text-gray-500">Manager: You</p>
//               </div>
//               <Link
//                 href={`/teams/${team.id}`}
//                 className="group/edit invisible flex items-center rounded-full p-2 text-gray-500 hover:bg-slate-200 group-hover/item:visible"
//               >
//                 {/* TODO: optimize for mobile */}
//                 <span className="text-sm group-hover/edit:text-gray-700">
//                   Manage
//                 </span>
//                 <HiChevronRight className="group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500" />
//               </Link>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

function PlayerLeagues({ userId }: { userId: string }) {
  const {
    data: playerLeagues,
    isLoading,
    isFetching,
  } = api.league.getByPlayerId.useQuery({ userId });

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col px-2 pb-4">
      <h3 className="pb-2 text-lg font-bold">My Leagues</h3>
      <ul role="list">
        {playerLeagues?.length === 0 && (
          <li className="rounded border border-red-100 bg-red-50 py-6 text-center text-red-500">
            You are not a member of any leagues.
          </li>
        )}
        {playerLeagues?.map((league) => (
          <li key={league.id} className="my-2 first:mt-0 last:mb-0">
            <LinkItemCard
              href={`/leagues/${league.id}`}
              icon={<HiBookmark className="h-10 w-10 text-slate-400" />}
              title={league.name}
              subtitle={`${league.teams.length} ${getPlural(
                league.teams.length,
                "team",
                "teams",
              )}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeaguesPage;
