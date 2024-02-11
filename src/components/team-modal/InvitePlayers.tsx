/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState, type SyntheticEvent } from "react";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import type { User } from "@prisma/client";
import { HiCheck } from "react-icons/hi";
import { HiChevronUpDown } from "react-icons/hi2";
import { api } from "~/utils/api";

type CreateTeamModalProps = {
  teamId: string;
  isOpen: boolean;
  closeModal: () => void;
};

export default function InvitePlayersModal({
  teamId,
  isOpen,
  closeModal,
}: CreateTeamModalProps) {
  const [selected, setSelected] = useState<User[]>([]);
  // const trpcUtils = api.useUtils();

  const createPlayerInvites = api.invite.create.useMutation({
    onSuccess: (invites) => {
      console.log("invites", invites);
    },
  });

  function handleCloseModal() {
    setSelected([]);
    closeModal();
  }

  function handleCreateInvites(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const playerIds = selected.map((player) => player.id);
    createPlayerInvites.mutate({ teamId, playerIds });

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Invite Players
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Send invites to players to join your team.
                  </p>
                </div>
                <form id="player-invite-form" onSubmit={handleCreateInvites}>
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="league"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Players
                          </label>
                          <div className="mt-2"></div>
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
                      disabled={createPlayerInvites.isLoading}
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
