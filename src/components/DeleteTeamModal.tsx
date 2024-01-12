import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { api } from "~/utils/api";

type DeleteTeamModalProps = {
  teamId: string;
  teamName: string;
  isOpen: boolean;
  closeModal: () => void;
};

export default function DeleteTeamModal({
  teamId,
  teamName,
  isOpen,
  closeModal,
}: DeleteTeamModalProps) {
  const router = useRouter();
  const deleteTeam = api.team.delete.useMutation({
    onSuccess: () => {
      router
        .push("/teams")
        .then(() => {
          router.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  function handleDeleteTeam() {
    const deletedTeam = deleteTeam.mutate({ id: teamId });
    console.log("Team Deleted", deletedTeam);
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Delete Team
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {`Are you sure you want to delete ${teamName}? This cannot be
                    undone.`}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={handleDeleteTeam}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="ml-4 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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
