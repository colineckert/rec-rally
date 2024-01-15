import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
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

  function handleCreateTeam() {
    const updatedTeam = createTeam.mutate({
      name: "New Team",
      image: null,
    });
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
                    Give your new team a name and an image URL (optional) to get
                    started.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
