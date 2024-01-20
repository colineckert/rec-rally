import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import DeleteTeamModal from "./team-modal/DeleteTeam";
import EditTeamModal from "./team-modal/EditTeam";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type ManageTeamDropdownProps = {
  team: inferProcedureOutput<AppRouter["team"]["getById"]>;
};

export default function ManageTeamDropdown({ team }: ManageTeamDropdownProps) {
  if (!team) return null;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:bg-green-400 focus-visible:ring-2 focus-visible:ring-white/75">
            Manage Team
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
                      <EditActiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <EditInactiveIcon
                        className="mr-2 h-5 w-5"
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
                    className={`${
                      active ? "bg-slate-100 text-black" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <DuplicateActiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <DuplicateInactiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Invite Players
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              {/* <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-slate-100 text-black" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <ArchiveActiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArchiveInactiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Archive
                  </button>
                )}
              </Menu.Item> */}
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-slate-100 text-black" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <MoveActiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <MoveInactiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Change League
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
                      <DeleteActiveIcon
                        className="mr-2 h-5 w-5 text-green-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <DeleteInactiveIcon
                        className="mr-2 h-5 w-5 text-green-400"
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
      <DeleteTeamModal
        teamId={team.id}
        teamName={team.name}
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
      />
      <EditTeamModal
        team={team}
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

function EditInactiveIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#23C55F"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#23C55F"
        stroke="#8FD1A8"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateInactiveIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#EDE9FE"
        stroke="#23C55F"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#EDE9FE"
        stroke="#23C55F"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateActiveIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#23C55F"
        stroke="#8FD1A8"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#23C55F"
        stroke="#8FD1A8"
        strokeWidth="2"
      />
    </svg>
  );
}

// function ArchiveInactiveIcon(props: React.ComponentProps<"svg">) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="8"
//         width="10"
//         height="8"
//         fill="#EDE9FE"
//         stroke="#23C55F"
//         strokeWidth="2"
//       />
//       <rect
//         x="4"
//         y="4"
//         width="12"
//         height="4"
//         fill="#EDE9FE"
//         stroke="#23C55F"
//         strokeWidth="2"
//       />
//       <path d="M8 12H12" stroke="#23C55F" strokeWidth="2" />
//     </svg>
//   );
// }

// function ArchiveActiveIcon(props: React.ComponentProps<"svg">) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="8"
//         width="10"
//         height="8"
//         fill="#23C55F"
//         stroke="#8FD1A8"
//         strokeWidth="2"
//       />
//       <rect
//         x="4"
//         y="4"
//         width="12"
//         height="4"
//         fill="#23C55F"
//         stroke="#8FD1A8"
//         strokeWidth="2"
//       />
//       <path d="M8 12H12" stroke="#8FD1A8" strokeWidth="2" />
//     </svg>
//   );
// }

function MoveInactiveIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#23C55F" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#23C55F" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#23C55F" strokeWidth="2" />
    </svg>
  );
}

function MoveActiveIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#8FD1A8" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#8FD1A8" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#8FD1A8" strokeWidth="2" />
    </svg>
  );
}

function DeleteInactiveIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#EDE9FE"
        stroke="#23C55F"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#23C55F" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#23C55F" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#23C55F"
        stroke="#8FD1A8"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#8FD1A8" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#8FD1A8" strokeWidth="2" />
    </svg>
  );
}
