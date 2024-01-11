import type { ReactNode } from "react";

type IconHoverEffectProps = {
  children: ReactNode;
  red?: boolean;
};

export function IconHoverEffect({
  children,
  red = false,
}: IconHoverEffectProps) {
  const colorClasses = red
    ? "rounded-full p-2 outline-red-400 hover:bg-red-200 group-hover-bg-red-200 group-focus-visible:bg-red-200"
    : "rounded-md px-3 py-2 outline-gray-400 hover:bg-gray-200 group-hover-bg-gray-200 group-focus-visible:bg-gray-200";

  return (
    <div className={`transition-colors duration-200 ${colorClasses}`}>
      {children}
    </div>
  );
}
