import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";
import { HiHome, HiUserCircle, HiUserGroup, HiLogin, HiLogout } from "react-icons/hi";
import { useRouter } from "next/router";

export function SideNav() {
  const session = useSession();
  const user = session.data?.user;
  const { pathname } = useRouter()

  const isSelected = (path: string) => {
    let boldStyles = '';
    if (pathname === path) {
      boldStyles = 'font-bold';
    }
    return boldStyles;
  }

  return (
    <nav className="sticky top-0 px-4 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">
            <IconHoverEffect>
              <span className={`flex items-center gap-4 ${isSelected('/')}`}>
                <HiHome className="h-8 w-8" />
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        {user != null && (
          <li>
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect>
                <span className={`flex items-center gap-4 ${isSelected('/profiles/[id]')}`}>
                  <HiUserCircle className="h-8 w-8" />
                  <span className="hidden text-lg md:inline">Profile</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>
        )}
        {user != null && (
          <li>
            <Link href={`/teams/${user.id}`}>
              <IconHoverEffect>
                <span className={`flex items-center gap-4 ${isSelected('/profiles/[id]')}`}>
                  <HiUserGroup className="h-8 w-8" />
                  <span className="hidden text-lg md:inline">Teams</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>
        )}
        {user == null ? (
          <li>
            <button onClick={() => void signIn()}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <HiLogin className="h-8 w-8 fill-green-700" />
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
                  <HiLogout className="h-8 w-8 fill-red-700" />
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
