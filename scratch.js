import React, { Component } from "react";
import { Manager, Reference, Popper, Arrow } from "react-popper";

import "../App.css";
import Box from "./Box";
import Stop from "./Stop";
import Truck from "./Truck";

class Grid extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      legs: [],
      stops: [
        {
          name: "A",
          x: 20,
          y: 10
        },
        {
          name: "B",
          x: 20,
          y: 20
        },
        {
          name: "C",
          x: 25,
          y: 30
        },
        {
          name: "D",
          x: 25,
          y: 80
        },
        {
          name: "E",
          x: 30,
          y: 100
        },
        {
          name: "F",
          x: 35,
          y: 80
        }
      ],
      truckPosition: { x: 0, y: 0 },
      tempX: "0",
      tempY: "0",
      stopToggle: false,
      startingCellNum: 39800,
      previousX: 0,
      previousY: 0,
      boxesToRender: Array.from({ length: 40000 }, (v, i) => i),
      holdingAllIndexes: [],
      pushToChildArr: []
    };
  }

  // takes and x/y and returns px to move
  convertToPixels(x, y) {
    let totalX;
    let totalY;
    // first 10 cells = 100px
    // after that everythig 11px
    // - minus cells add 100px
    // - rest * 11 then sum
    if (x > 10) {
      x = x - 10;
      totalX = 100 + x * 11;
    } else {
      totalX = x * 10;
    }
    if (y > 10) {
      y = y - 10;
      totalY = 100 + y * 11;
    } else {
      totalY = y * 10;
    }
    let moveX = parseInt(totalX);
    let moveY = parseInt(totalY);

    let coordsObj = {
      moveX: moveX,
      moveY: moveY
    };
    return coordsObj;
  }

  render() {
    return (
      <main className="page-container">
        <div className="grid-container">
          <div className="grid">
            <Stop coords={this.state.stopsDirsArr} />
            <Box toRender={this.state.boxesToRender} />
          </div>
        </div>
      </main>
    );
  }

  componentDidMount() {
    let that = this;
    function setStopCoords(type) {
      let coordsArr = [];
      setTimeout(function() {
        // filter out undefined
        if (type === "stop") {
          if (that.state.stops.length > 0) {
            that.state.stops.forEach(stop => {
              let pixels = that.convertToPixels(stop.x, stop.y);
              let coords = {
                pixels: pixels,
                directions: {
                  xDir: "left",
                  yDir: "bottom"
                }
              };
              coordsArr.push(coords);
            });
          }
        }
        that.setState({
          stopsDirsArr: coordsArr
        });
      }, 1050);
    }
    setStopCoords("stop");
  }
}

export default Grid
