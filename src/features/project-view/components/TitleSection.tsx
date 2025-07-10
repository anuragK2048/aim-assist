import Circle from "@/components/common/Circle";
import { Ellipsis } from "lucide-react";

function TitleSection() {
  return (
    <div className="flex flex-col gap-2">
      {/* title */}
      <div className="flex gap-3 items-center">
        <Circle />
        <div className="text-foreground text-2xl">Placement</div>
        <div>
          <Ellipsis className="text-primary" />
        </div>
      </div>
      {/* description */}
      <div>
        <div className="text-foreground/85 text-sm">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio
          delectus esse amet similique! Animi fuga cupiditate recusandae
          excepturi veniam. Maxime, libero iste veritatis dolores ratione
          expedita alias consectetur reiciendis natus.
        </div>
      </div>
    </div>
  );
}

export default TitleSection;
