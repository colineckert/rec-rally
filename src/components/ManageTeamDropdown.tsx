import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import {
  HiChevronDown,
  HiPencilAlt,
  HiOutlinePencilAlt,
  HiOutlineUserAdd,
  HiUserAdd,
  HiOutlineTrash,
  HiTrash,
} from "react-icons/hi";
import DeleteTeamModal from "./team-modal/Delete";
import EditTeamModal from "./team-modal/Edit";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import InvitePlayersModal from "./team-modal/InvitePlayers";

type ManageTeamDropdownProps = {
  team: inferProcedureOutput<AppRouter["team"]["getById"]>;
};

export default function ManageTeamDropdown({ team }: ManageTeamDropdownProps) {
  if (!team) return null;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:bg-green-400 focus-visible:ring-2 focus-visible:ring-white/75">
            Manage
            <HiChevronDown
              className="-mr-1 ml-2 h-5 w-5 text-green-200 hover:text-green-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className={`${
                      active ? "bg-slate-100 text-black" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <HiPencilAlt
                        className="mr-3 h-5 w-5 text-green-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <HiOutlinePencilAlt
                        className="mr-3 h-5 w-5 text-green-600"
                        aria-hidden="true"
                      />
                    )}
                    Edit
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className={`${
                      active ? "bg-slate-100 text-black" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <HiUserAdd
                        className="mr-3 h-5 w-5 text-green-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <HiOutlineUserAdd
                        className="mr-3 h-5 w-5 text-green-600"
                        aria-hidden="true"
                      />
                    )}
                    Invite Players
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className={`${
                      active ? "bg-slate-100 text-black" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <HiTrash
                        className="mr-3 h-5 w-5 text-green-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <HiOutlineTrash
                        className="mr-3 h-5 w-5 text-green-600"
                        aria-hidden="true"
                      />
                    )}
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <EditTeamModal
        team={team}
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
      />
      <InvitePlayersModal
        teamId={team.id}
        isOpen={isInviteModalOpen}
        closeModal={() => setIsInviteModalOpen(false)}
      />
      <DeleteTeamModal
        teamId={team.id}
        teamName={team.name}
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
