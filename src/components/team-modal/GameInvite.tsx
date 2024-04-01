import { Fragment, type SyntheticEvent, useState } from "react";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import { HiCheck } from "react-icons/hi";
import { HiChevronUpDown } from "react-icons/hi2";
import { Dialog, Listbox, Switch, Transition } from "@headlessui/react";
import { Button } from "../Button";

type LogGameProps = {
  team: inferProcedureOutput<AppRouter["team"]["getById"]>;
};

export function GameInvite({ team }: LogGameProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!team) return null;

  return (
    <>
      <Button gray onClick={() => setIsOpen(true)}>
        Game Invite
      </Button>
      <GameInviteModal
        homeTeam={team}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
    </>
  );
}

type GameInviteModalProps = {
  homeTeam: inferProcedureOutput<AppRouter["team"]["getById"]>;
  isOpen: boolean;
  closeModal: () => void;
};

type GameInviteFormValues = {
  awayTeam: {
    id: string;
    name: string;
  } | null;
  date: Date | null;
  friendly: boolean;
};

const defaultFormValues: GameInviteFormValues = {
  awayTeam: null,
  date: null,
  friendly: false,
};

// TODO:
// - Select league
// - On league select, fetch teams
// - Select opponent team
// - Select date
// - Friendly switch
// - Submit button
// - Handle submit
// - Handle close

function GameInviteModal({
  homeTeam,
  isOpen,
  closeModal,
}: GameInviteModalProps) {
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [teams, setTeams] = useState<{ id: string; name: string }[] | null>(
    null,
  );

  const trpcUtils = api.useUtils();
  const createGame = api.post.create.useMutation();

  const handleClose = () => {
    closeModal();
    setFormValues(defaultFormValues);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const { awayTeam, date, friendly } = formValues;

    if (!awayTeam) return;

    // await createGame.mutateAsync({
    //   date,
    //   homeTeamId: homeTeam.id,
    //   awayTeamId: awayTeam.id,
    //   friendly,
    // });

    // await createGameRecap.mutateAsync({
    //   content: `Game between ${homeTeam.name} and ${awayTeam.name}`,
    //   homeTeamId: homeTeam.id,
    //   awayTeamId: awayTeam.id,
    // });

    handleClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Send Game Invite
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Invite players to a game. Select the opponent team and the
                    game's scheduled date.
                  </p>
                </div>
                <form id="log-game-form" onSubmit={handleSubmit}>
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-10">
                      <div className="mt-6">
                        <Listbox
                          value={formValues.awayTeam}
                          onChange={(team) =>
                            setFormValues((prev) => ({
                              ...prev,
                              awayTeam: team,
                            }))
                          }
                        >
                          <Dialog.Title
                            as="h5"
                            className="text-sm font-medium leading-6 text-gray-900"
                          >
                            Opponent
                          </Dialog.Title>
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                              <span className="block truncate">
                                {formValues.awayTeam?.name}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <HiChevronUpDown
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                {teams?.map((team, teamIdx) => (
                                  <Listbox.Option
                                    key={teamIdx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? "bg-green-100 text-green-900"
                                          : "text-gray-900"
                                      }`
                                    }
                                    value={team}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {team.name}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                                            <HiCheck
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Switch
                          checked={formValues.friendly}
                          onChange={(value) => {
                            setFormValues((prev) => ({
                              ...prev,
                              friendly: value,
                            }));
                          }}
                          className={`${
                            formValues.friendly ? "bg-green-500" : "bg-gray-500"
                          }
                            relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className={`${
                              formValues.friendly
                                ? "translate-x-5"
                                : "translate-x-0"
                            }
                              pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                        <span className="text-sm leading-6 text-gray-900">
                          Friendly
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createGame.isLoading || !formValues.awayTeam}
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
