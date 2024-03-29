import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";
import {
  HiOutlineHome,
  HiHome,
  HiOutlineUserCircle,
  HiUserCircle,
  HiOutlineUsers,
  HiUsers,
  HiCollection,
  HiOutlineCollection,
  HiOutlineLogin,
  HiOutlineLogout,
} from "react-icons/hi";
import { HiUserGroup } from "react-icons/hi2";
import { useRouter } from "next/router";

export function SideNav() {
  const session = useSession();
  const user = session.data?.user;
  const { pathname } = useRouter();

  const isSelected = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="sticky top-0 px-2 py-4">
      <Link href="/" className="flex justify-center pb-4">
        <HiUserGroup className="h-10 w-10" />
      </Link>
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">
            <IconHoverEffect>
              <span
                className={`flex items-center gap-4 ${
                  isSelected("/") ? "font-bold" : ""
                }`}
              >
                {isSelected("/") ? (
                  <HiHome className="h-8 w-8" />
                ) : (
                  <HiOutlineHome className="h-8 w-8" />
                )}
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        {user != null && (
          <>
            <li>
              <Link href={`/profiles/${user.id}`}>
                <IconHoverEffect>
                  <span
                    className={`flex items-center gap-4 ${
                      isSelected("/profiles/[id]") ? "font-bold" : ""
                    }`}
                  >
                    {isSelected("/profiles/[id]") ? (
                      <HiUserCircle className="h-8 w-8" />
                    ) : (
                      <HiOutlineUserCircle className="h-8 w-8" />
                    )}
                    <span className="hidden text-lg md:inline">Profile</span>
                  </span>
                </IconHoverEffect>
              </Link>
            </li>
            <li>
              <Link href={`/teams`}>
                <IconHoverEffect>
                  <span
                    className={`flex items-center gap-4 ${
                      isSelected("/teams") ? "font-bold" : ""
                    }`}
                  >
                    {isSelected("/teams") ? (
                      <HiUsers className="h-8 w-8" />
                    ) : (
                      <HiOutlineUsers className="h-8 w-8" />
                    )}
                    <span className="hidden text-lg md:inline">Teams</span>
                  </span>
                </IconHoverEffect>
              </Link>
            </li>
            <li>
              <Link href={`/leagues`}>
                <IconHoverEffect>
                  <span
                    className={`flex items-center gap-4 ${
                      isSelected("/leagues") ? "font-bold" : ""
                    }`}
                  >
                    {isSelected("/leagues") ? (
                      <HiCollection className="h-8 w-8" />
                    ) : (
                      <HiOutlineCollection className="h-8 w-8" />
                    )}
                    <span className="hidden text-lg md:inline">Leagues</span>
                  </span>
                </IconHoverEffect>
              </Link>
            </li>
          </>
        )}
        {user == null ? (
          <li>
            <button onClick={() => void signIn()}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <HiOutlineLogin className="h-8 w-8 text-green-700" />
                  <span className="hidden text-lg text-green-700 md:inline">
                    Log In
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        ) : (
          <li>
            <button onClick={() => void signOut()}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <HiOutlineLogout className="h-8 w-8 text-red-700" />
                  <span className="hidden text-lg text-red-700 md:inline">
                    Log Out
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
