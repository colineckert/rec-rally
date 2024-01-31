import Link from "next/link";
import { ProfileImage } from "./ProfileImage";

type PlayerCardProps = {
  href: string;
  imageClassName?: string;
  image: string | null;
  name: string | null;
  subtext?: string;
};

export function ItemLinkCard({
  href,
  image,
  imageClassName,
  name,
  subtext,
}: PlayerCardProps) {
  return (
    <Link
      href={href}
      className="flex rounded-md border px-3 py-2 hover:bg-slate-100"
    >
      <div className="flex items-center justify-between">
        <ProfileImage src={image} className={`mr-3 ${imageClassName}`} />
        <div className="flex-grow">
          <span>{name}</span>
          {subtext ? <p className="text-sm text-gray-500">{subtext}</p> : null}
        </div>
      </div>
    </Link>
  );
}
