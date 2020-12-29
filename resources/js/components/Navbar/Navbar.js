import React, { Component } from "react";
import "./Navbar.css"
export default class Navbar extends Component {
  render() {
    return (
      <>
          <nav className="navbar navbar-expand-md">
            <a href="#" className="navbar-brand">
              <img
                src="https://www.bonanzaonline.com/images/download.png"className="w-70"
              />
            </a>
          </nav>
      </>
    );
  }
}
