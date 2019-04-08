import React, { Component } from 'react';

class Header extends Component {
  state = {}
  render() {
    return (
      <div id="wrapper">
        <nav className="navbar navbar-expand-lg navbar-light bg-white static-top navbar-sme">
          <div className="container-fluid">
            <div className="nav-bar">
              <a className="navbar-brand" href="#">
                <img src="http://placehold.it/150x50?text=Logo" alt="" />
              </a>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
              aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>


            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#">Profile &nbsp;<i className="fa fa-1x fa-user-circle"></i></a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Sair &nbsp;<i className="fas fa-1x fa-power-off"></i></a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default Header;
