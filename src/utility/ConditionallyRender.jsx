function ConditionallyRender({ show, children }) {
  if (children.length === 2) {
    return <div>{show ? children[0] : children[1]}</div>;
  }
  return <div>{show && children}</div>;
}

export default ConditionallyRender;
