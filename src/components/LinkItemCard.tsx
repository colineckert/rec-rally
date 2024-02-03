import Link from "next/link";
import { ProfileImage } from "./ProfileImage";

type PlayerCardProps = {
  href: string;
  title: string | null;
  subtitle?: string;
  icon?: React.ReactNode;
  imageClassName?: string;
  image?: string | null;
};

export function LinkItemCard({
  href,
  title,
  subtitle,
  icon,
  image,
  imageClassName,
}: PlayerCardProps) {
  const cardImage = icon ? (
    icon
  ) : (
    <ProfileImage src={image} className={imageClassName} />
  );

  return (
    <Link
      href={href}
      className="flex rounded-md border px-3 py-2 hover:bg-slate-100"
    >
      <div className="flex items-center justify-between">
        <div className="mr-3">{cardImage}</div>
        <div className="flex-grow">
          <span>{title}</span>
          {subtitle ? (
            <p className="text-sm text-gray-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
