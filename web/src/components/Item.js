/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
*/

import React, { Component } from 'react';
import B from './back';
import {Config} from './../config.js';
import Source from './data';
import '../css/Item.css';
import MdClose from 'react-icons/lib/md/close';
import renderHTML from 'react-render-html';
import FaAngleRight from 'react-icons/lib/fa/angle-right';

import { Button, Header, Icon, Image, Modal } from 'semantic-ui-react'
const urlDelim = '>>';

export default class Item extends Component{

  state = { isLoading:true, open: true}
 
  componentWillMount() {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const { name } = this.props.match.params;
    this.url = Source.getDef(name).url || '.';
    Source.getSync(name)
    .then( store => this.setState({isLoading:false, store:store}) )
  }


  render() {
    B.set(this);

    if (this.state.isLoading) return null;

    let item = this.state.store.getByID(this.props.match.params.id)
    // console.log('item', item)
    const back = (e) => {
      e.stopPropagation();
      document.body.style.overflow = 'auto';
      if (B.back) this.props.history.goBack();
    }
    let fields = Config.Mapping.map( (field, index) => {
      if(item[field]){
        return (
          <div className="itemField" key={index}>
            <div className="itemFieldTitle">
              {field}
            </div>
            <div className="itemFieldBody">
              { renderHTML(item[field]) }
            </div>
          </div>
        );
      }
      return null;
    });

    const url = item.Url ? item.Url.split(urlDelim) : [''];


    return (
      <Modal 
        open={this.state.open}
        closeOnEscape="true"
        closeOnRootNodeClick="true"
        onClose={back}
        closeIcon
      >
        <Modal.Header>
          { Source.format(item.Title) }
        </Modal.Header>
        <Modal.Content image>
          <Image wrapped size='large' src={this.url + "/" + item.Icon} />
          <Modal.Description>
            { fields }
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <a className="itemLaunch" href={url[0]} title="Launch" target="_blank">
            <Button primary>
              { url[1] || 'Launch' } <Icon name='right chevron' />
            </Button>
          </a>
        </Modal.Actions>
      </Modal>
    )
  }
}