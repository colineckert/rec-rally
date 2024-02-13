import Link from "next/link";
import { ProfileImage } from "./ProfileImage";

type PlayerCardProps = {
  href: string;
  title: string | null;
  subtitle?: string;
  icon?: React.ReactNode;
  imageClassName?: string;
  image?: string | null;
  children?: React.ReactNode;
};

export function LinkItemCard({
  href,
  title,
  subtitle,
  icon,
  image,
  imageClassName,
  children,
}: PlayerCardProps) {
  const cardImage = icon ? (
    icon
  ) : (
    <ProfileImage src={image} className={imageClassName} />
  );

  return (
    <div className="flex rounded-md border px-3 py-2 hover:bg-slate-100">
      <Link href={href} className="flex flex-grow items-center justify-between">
        <div className="mr-3">{cardImage}</div>
        <div className="flex-grow">
          <span>{title}</span>
          {subtitle ? (
            <p className="text-sm text-gray-500">{subtitle}</p>
          ) : null}
        </div>
      </Link>
      {children}
    </div>
  );
}
