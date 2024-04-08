// import Link from "next/link";
// import Image from "next/image";
import type { Post } from "~/types/post";
import { api } from "~/utils/api";
import { getFormattedDate } from "~/utils/formatters";
import { LoadingSpinner } from "./LoadingSpinner";
import { Tab } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function GameInvite({
  id,
  homeTeamId,
  awayTeamId,
  createdAt,
} // leagueId,
: Post) {
  if (homeTeamId == null || awayTeamId == null) {
    return null;
  }

  const team1 = api.team.getById.useQuery({ id: homeTeamId });
  const team2 = api.team.getById.useQuery({ id: awayTeamId });
  // const league = api.league.getById.useQuery({ id: leagueId });

  if (team1.isLoading || team2.isLoading) {
    return <LoadingSpinner />;
  }

  const responses = {
    attending: "Attending",
    notAttending: "Not Attending",
    maybe: "Maybe",
  };

  return (
    <li key={id} className="border-b px-2 pb-4 pt-3">
      <div className="max-w-8 flex flex-grow flex-col">
        <span className="self-center">
          {team1.data?.name} vs {team2.data?.name}
        </span>
        <span className="self-center pb-3 text-sm text-gray-500">
          {getFormattedDate(createdAt, "long")}
          {/* {league.data?.name} */}
        </span>
        <div className="w-full max-w-md self-center px-2 py-4 sm:px-0">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-green-900/20 p-1">
              {Object.keys(responses).map((response) => (
                <Tab
                  key={response}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                      "ring-white/60 ring-offset-2 ring-offset-green-400 focus:outline-none focus:ring-2",
                      selected
                        ? "bg-white text-green-700 shadow"
                        : "text-green-100 hover:bg-white/[0.12] hover:text-white",
                    )
                  }
                >
                  {response}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
      </div>
    </li>
  );
}

// type TeamCardProps = {
//   id: string;
//   name?: string;
//   logo?: string | null;
// };

// function TeamCard({ id, name, logo }: TeamCardProps) {
//   if (name == null) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="flex flex-grow flex-col items-center">
//       <Link href={`/teams/${id}`} className="flex flex-col items-center">
//         <Image src={logo ?? ""} alt={name} width={36} height={36} />
//         <span className="pt-2 font-bold">{name}</span>
//       </Link>
//     </div>
//   );
// }
