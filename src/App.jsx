import React, { Component } from "react";
import "./App.css";
import "./components/Shareable/custom.css";
import MenuChange from "./components/DayChange";

class App extends Component {
  render() {
    return (
      <div>
        <MenuChange />
      </div>
    );
  }
}

export default App;
