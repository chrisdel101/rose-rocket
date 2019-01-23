class Box extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: true
    };
  }

  renderBoxes(i) {
    if (this.props.toRender) {
      let { toRender, toAdd } = this.props;
      return toRender.map((obj, i) => {
        let hasColor = (() => {
          if (!toAdd || !toAdd.length || !toAdd.includes(i)) return false;
          return true;
        })();
        return (
          <div
            className={`box ${hasColor ? " backgroundColor" : ""}`}
            key={i}
          />
        );
      });
    }
  }
  render() {
    if (this.props.toRender && this.props.toRender.length) {
      return <React.Fragment> {this.renderBoxes()} </React.Fragment>;
    } else {
      return <div>No Boxes yet!</div>;
    }
  }
}
class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxesToRender: Array.from(
        {
          length: 40000
        },
        (v, i) => i
      ),
      classesToAdd: []
    };
  }

  clickToAdd() {
    this.setState({
      classesToAdd: [10, 11, 12]
    });
  }

  render() {
    return (
      <div className="grid-container">
        <div className="utils-container">
          <button onClick={this.clickToAdd.bind(this)}> Add Class </button>{" "}
        </div>{" "}
        <div className="grid">
          <Box
            toRender={this.state.boxesToRender}
            toAdd={this.state.classesToAdd ? this.state.classesToAdd : null}
          />{" "}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<TodoApp />, document.querySelector("#app"));
