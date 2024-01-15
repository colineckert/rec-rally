/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type SyntheticEvent } from "react";
import { api } from "~/utils/api";

type CreateTeamModalProps = {
  managerId: string;
  isOpen: boolean;
  closeModal: () => void;
};

export default function CreateTeamModal({
  managerId,
  isOpen,
  closeModal,
}: CreateTeamModalProps) {
  const trpcUtils = api.useUtils();
  const createTeam = api.team.create.useMutation({
    onSuccess: (newTeam) => {
      console.log("Team Created:", newTeam);

      trpcUtils.team.getManagerTeamsByUserId.setData(
        { userId: managerId },
        (oldData) => {
          if (oldData == null) return;
          return [...oldData, newTeam];
        },
      );
    },
  });

  function handleCreateTeam(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = (event.target as any).teamName.value;
    const image = (event.target as any).teamImageUrl.value || null;
    const description = (event.target as any).description.value || null;

    const updatedTeam = createTeam.mutate({ name, image, description });

    console.log("Team Updated", updatedTeam);
    closeModal();
  }

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                <form onSubmit={handleCreateTeam}>
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
