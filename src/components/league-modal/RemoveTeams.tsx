/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState, type SyntheticEvent } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { HiCheck } from "react-icons/hi";
import { HiChevronUpDown } from "react-icons/hi2";
import { api } from "~/utils/api";
import type { Team } from "@prisma/client";

type RemoveTeamsModalProps = {
  leagueId: string;
  teams: {
    id: string;
    name: string;
  }[];
  isOpen: boolean;
  closeModal: () => void;
};

export function RemoveTeamsModal({
  leagueId,
  teams,
  isOpen,
  closeModal,
}: RemoveTeamsModalProps) {
  const [seletectIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const trpcUtils = api.useUtils();
  const sortedTeams = teams?.sort((a, b) =>
    a.name && b.name ? a.name.localeCompare(b.name) : 0,
  );

  const filteredTeams =
    query === ""
      ? sortedTeams
      : sortedTeams?.filter(
          (team) =>
            team.name &&
            team.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  const removeTeams = api.league.removeTeams.useMutation({
    onSuccess: async () => {
      await trpcUtils.league.getById.invalidate({ id: leagueId });
    },
  });

  function handleTeamSelect(team: Pick<Team, "id" | "name">) {
    if (seletectIds.some((id) => id === team.id)) {
      return setSelectedIds(seletectIds.filter((id) => id !== team.id));
    }
    return setSelectedIds([...seletectIds, team.id]);
  }

  function handleCloseModal() {
    setSelectedIds([]);
    closeModal();
  }

  function handleRemoveTeams(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    removeTeams.mutate({ leagueId, teamIds: seletectIds });
    handleCloseModal();
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
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
                  Remove Teams
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Remove teams from your league.
                  </p>
                </div>
                <form id="remove-teams-form" onSubmit={handleRemoveTeams}>
                  <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-4">
                      <div className="col-span-full">
                        <label
                          htmlFor="teams"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Select Teams
                        </label>
                        <div className="mt-2">
                          <Combobox onChange={handleTeamSelect}>
                            <div className="relative mt-1">
                              <div className="relative w-full cursor-default rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300 sm:text-sm">
                                <Combobox.Input
                                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                  placeholder="Search teams..."
                                  displayValue={(team: Team) =>
                                    team?.name ?? ""
                                  }
                                  onChange={(event) =>
                                    setQuery(event.target.value)
                                  }
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                  <HiChevronUpDown
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </Combobox.Button>
                              </div>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setQuery("")}
                              >
                                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                  {filteredTeams?.length === 0 &&
                                  query !== "" ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                      No matches.
                                    </div>
                                  ) : (
                                    filteredTeams?.map((team) => (
                                      <Combobox.Option
                                        key={team.id}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active
                                              ? "bg-green-100 text-green-900"
                                              : "text-gray-900"
                                          }`
                                        }
                                        value={team}
                                      >
                                        {({ active }) => {
                                          const selected = seletectIds.some(
                                            (id) => id === team.id,
                                          );
                                          return (
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
                                                <span
                                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                    active
                                                      ? "bg-green-100 text-green-900"
                                                      : "text-gray-900"
                                                  }`}
                                                >
                                                  <HiCheck
                                                    className="h-5 w-5 text-green-500"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              ) : null}
                                            </>
                                          );
                                        }}
                                      </Combobox.Option>
                                    ))
                                  )}
                                </Combobox.Options>
                              </Transition>
                            </div>
                          </Combobox>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={removeTeams.isLoading}
                      className="rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                      Save
                    </button>
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
