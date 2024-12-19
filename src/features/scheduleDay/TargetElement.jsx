function TargetElement({ target }) {
  return (
    <div>
      <h2>{target.name}</h2>
      <h2>{target.description}</h2>
      <h2>{target.time}</h2>
      <h2>{target.priority ? "IMP" : ""}</h2>
    </div>
  );
}

export default TargetElement;
