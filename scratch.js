if (this.props.toRender) {
  let { toRender, stopsColor } = this.props;
  return toRender.map((obj, i) => {
    let hasColor = (() => {
      if (!stopsColor || !stopsColor.length || !stopsColor.includes(i)) return false;
      return true;
    })();
    return (
        <div
        className={`box ${hasColor ? " background-color" : ""}`}
        key={i}
        />)
  });
}
}
render() {
  // console.log(this.props)
if (this.props.toRender && this.props.toRender.length) {
  return <React.Fragment>{this.renderBoxes()}</React.Fragment>;
} else {
  return <div>No Boxes yet!</div>;
}
}
