import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type SyntheticEvent, useState } from "react";
import { Button } from "../Button";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type LogGameProps = {
  league: inferProcedureOutput<AppRouter["league"]["getById"]>;
};

export default function LogGame({ league }: LogGameProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!league) return null;

  return (
    <>
      <Button gray onClick={() => setIsOpen(true)}>
        Log Game
      </Button>
      <LogGameModal
        leagueId={league.id}
        teams={league.teams}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
    </>
  );
}

type LogGameModalProps = {
  leagueId: string;
  teams: {
    id: string;
    name: string;
  }[];
  isOpen: boolean;
  closeModal: () => void;
};

function LogGameModal({
  leagueId,
  teams,
  isOpen,
  closeModal,
}: LogGameModalProps) {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  console.log("teams", teams);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log({ homeTeam, awayTeam, homeScore, awayScore });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Log Game
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Submit a game for this league but entering a home and away
                    team and the score.
                  </p>
                </div>
                <form id="log-game-form" onSubmit={handleSubmit}>
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6"></div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        // disabled={editleague.isLoading}
                        className="rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
