import { Link } from "react-router";
import { cn } from "../utils/global";
import { Spotlight } from "../components/ui/spotlight";

const Root: React.FC = () => {
  const links = [
    { id: 0, name: "Roll Forward", href: "/roll-forward", disabled: false },
    { id: 1, name: "Graphs", href: "/graphs", disabled: false },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center py-8">
        <div className="flex flex-wrap gap-4">
          {links.map((link) => (
            <LinkCard {...link} key={link.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Root;

const LinkCard: React.FC<{
  id: number;
  name: string;
  disabled: boolean;
  href: string;
}> = ({ id, name, disabled, href }) => {
  return (
    <Link
      to={disabled ? "#" : href}
      className={cn(
        "relative aspect-video h-[180px] overflow-hidden rounded-xl bg-dark-700 p-[1px] cursor-pointer",
        disabled ? "bg-transparent" : ""
      )}
    >
      {!disabled && <Spotlight className="to-primary-400 blur-xl" size={175} />}
      <div
        className={cn(
          "relative h-full w-full rounded-xl bg-dark-800 hover:bg-dark-700 p-5",
          disabled ? "cursor-not-allowed opacity-50" : ""
        )}
      >
        <h3 className={cn("text-xl font-bold")}>{name}</h3>
      </div>
    </Link>
  );
};
