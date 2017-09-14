import React, { Component } from 'react';
import {Config} from './../config.js';
import {Data} from './../store.js';
import {Link} from 'react-router-dom'
import '../css/Header.css';
import imgLoading from '../img/loading.gif'
import imgSearch from '../img/search.png'
import FaSearch from 'react-icons/lib/fa/search';

var properties;
var data;
class Header extends React.Component {
  constructor(props) {
    super(props);
    properties = props.props;
    data = props.data;
  }
  render() {
    return (
      <div className="header">
        <div className="wrapper">
          <Link to="/employee/" replace>
            <div className="header-name" title="Home">
              {data.title}
            </div>
          </Link>
          <div className="header-input">
            <input type="text" placeholder="Search in the store..." />
            <div className="header-search">
              <FaSearch color='#ffffff'  style={{ marginTop: '-4px' }}/>
            </div>
          </div>
        </div>
      </div>     
    );
  }
}
export default Header;