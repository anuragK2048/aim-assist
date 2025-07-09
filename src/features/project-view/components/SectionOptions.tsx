function SectionOptionsItem() {
  return (
    <div>
      <div className="border-b-2 border-b-blue-200">Projects</div>
    </div>
  );
}

function SectionOptions() {
  return (
    <div className="flex gap-10">
      <SectionOptionsItem />
      <SectionOptionsItem />
      <SectionOptionsItem />
      <SectionOptionsItem />
      <SectionOptionsItem />
    </div>
  );
}

export default SectionOptions;
