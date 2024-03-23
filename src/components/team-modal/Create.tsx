/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, Listbox, Transition } from "@headlessui/react";
import type { League } from "@prisma/client";
import { Fragment, useState, type SyntheticEvent } from "react";
import { HiCheck } from "react-icons/hi";
import { HiChevronUpDown } from "react-icons/hi2";
import { api } from "~/utils/api";

type CreateTeamModalProps = {
  managerId: string;
  isOpen: boolean;
  closeModal: () => void;
};

export function CreateTeamModal({
  managerId,
  isOpen,
  closeModal,
}: CreateTeamModalProps) {
  const trpcUtils = api.useUtils();
  const createTeam = api.team.create.useMutation({
    onSuccess: async () => {
      await trpcUtils.team.getManagerTeamsByUserId.invalidate({
        userId: managerId,
      });
    },
  });

  const { data: leagues } = api.league.getAll.useQuery();
  const [selected, setSelected] = useState<Pick<League, "id" | "name"> | null>(
    null,
  );

  function handleCloseModal() {
    setSelected(null);
    closeModal();
  }
  async function handleCreateTeam(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = (event.target as any).teamName.value;
    const image = (event.target as any).teamImageUrl.value || null;
    const description = (event.target as any).description.value || null;
    await createTeam.mutateAsync({
      name,
      image,
      description,
      leagueId: selected?.id ?? null,
    });

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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Create Team
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Give your new team a name, image URL (optional), and
                    description (optional) to get started.
                  </p>
                </div>
                <form id="team-create-form" onSubmit={handleCreateTeam}>
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="teamName"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Name
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
                              <input
                                required
                                type="text"
                                name="teamName"
                                id="teamName"
                                className="block flex-1 border-0 bg-transparent py-2 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Arsenal"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="teamImageUrl"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Image URL
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
                              <input
                                type="text"
                                name="teamImageUrl"
                                id="teamImageUrl"
                                className="block flex-1 border-0 bg-transparent py-2 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="https://example.com/image.png"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-full">
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Description
                          </label>
                          <div className="mt-2">
                            <textarea
                              id="description"
                              name="description"
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                              defaultValue={""}
                            />
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            Write a few sentences about your team.
                          </p>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="league"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            League
                          </label>
                          <div className="mt-2">
                            <Listbox value={selected} onChange={setSelected}>
                              <div className="relative mt-1">
                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                  <span className="block truncate">
                                    {selected?.name ?? "Select a league"}
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
                                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {leagues?.map((league, leagueIdx) => (
                                      <Listbox.Option
                                        key={leagueIdx}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active
                                              ? "bg-green-100 text-green-900"
                                              : "text-gray-900"
                                          }`
                                        }
                                        value={league}
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
                                              {league?.name}
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
                        </div>
                      </div>
                    </div>
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
                      disabled={createTeam.isLoading}
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
