/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
*/

import React, { Component } from 'react';
import renderHTML from 'react-render-html';

import Source from './data';
import Navigation from './Navigation';
import HeaderComponent from './Header';
import Thumbnail from './Thumbnail';
import B from './back';

export default class Collection extends Component {

  state = { isLoading:true, lim:20  }
  counter = 0;
  storeDef;
  thumbnails;

  componentWillMount() {
    // console.log('coll willmount')
    const {name} = this.props.match.params;
    Source.getSync(name)
    .then( (store) => this.setState({isLoading:false, store:store}) )
    
    this.storeDef = Source.getDef(name);
    this.loadMore = this.loadMore.bind(this);
    this.map = this.map.bind(this);
    B.back = true;
  }

  loadMore(){
    this.setState({lim:this.state.lim + 40});
    this.thumbnails = this.map();
  }

  map(coll){
    this.counter = 0;
    let ret = coll.Solutions.filter( (itemID, index) => {
      let item = this.state.store.getByID(itemID);
      if (item && item.Icon && !item.del){
        return item;
      }
      return null;
    })
    .map((itemID, index) => {
      let item = this.state.store.getByID(itemID);
      this.counter++;
      if(this.counter % 5 === 0){
        return (          
          <Thumbnail  key={itemID} noMargin="yes" props={this.props} data={item} store={this.storeDef} />
        );
      }else{
        return (          
          <Thumbnail  key={itemID} props={this.props} data={item} store={this.storeDef} />
        );
      }
    });

    if (ret.length > this.state.lim+1){
      ret = ret.slice(0, this.state.lim);
      return (
        <div>
          <div>{ret}</div>
          <div className="loadMore" onClick={this.loadMore}>Load more...</div>
        </div>
      );
    }
    return ret;
  }

  render() {
    
    if (this.state.isLoading) return null;

    B.path = this.props.location.pathname;
    
    const { id } = this.props.match.params;
    const coll = this.state.store.getByID(id);
    if (!coll) return (
      <div className="notFound wrapper">
        <div className="notFound404">
          404 error
        </div>
        <div className="notFoundText">
          Page not found...
        </div>
      </div>
    ); 

    this.thumbnails = this.map(coll);
    return (
      <div>
        <div className="head">
          <HeaderComponent props={this.props} data={this.storeDef}/>
          <div className="menu">
            <div className="wrapper">
              <Navigation props={this.props} data={this.storeDef}/>
            </div>
          </div>
        </div>
        <div className="store">
          <div className="wrapper">
            <h2>{ coll.Title }</h2>
            <div>{ renderHTML(coll.Description || '') } </div>
            { this.thumbnails }
          </div>
        </div>
      </div>
    );
  }
}