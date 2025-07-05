import Circle from "./Circle";

function TitleSection() {
  return (
    <div className="flex flex-col gap-2">
      {/* title */}
      <div className="flex gap-5 items-center">
        <Circle />
        <div className="text-2xl">Placement</div>
        <div>...</div>
      </div>
      {/* description */}
      <div>
        <div className="text-slate-300 text-sm">
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
