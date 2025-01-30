import { FaTag } from "react-icons/fa";

function Tag({ name, color = "#E3A008" }) {
  return (
    <div
      className={`flex h-5 w-fit items-center gap-1 rounded-full border-[1px] px-1`}
      style={{ borderColor: color }}
    >
      <FaTag className={`h-3 w-auto`} style={{ color: color }} />
      <div className="whitespace-nowrap text-sm text-[var(--tag-nameColor)]">
        {/* TODO validate tag length */}
        {name}
      </div>
    </div>
  );
}

export default Tag;
