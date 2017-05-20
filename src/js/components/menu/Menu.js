import React, { Component } from 'react';

class Menu extends Component {

  handleClickOnButton(option) {
    this.props.selectTool(option);
  }

  render() {
    let position = {
      top: `${this.props.y}px`,
      left: `${this.props.x}px`
    };

    let show = (this.props.show ? ' menu-open' : '');

    return (
      <div id='menu' className={ 'menu noselect' + show } style={ position }>
        <div className='menu-board noselect'>
          <div className='main-menu noselect'>
            <ul>
              <li>
                <span onClick={ this.handleClickOnButton.bind(this, 'brush') }>
                  <i className='fa fa-pencil fa-2x' />
                </span>
              </li>
              <li>
                <span onClick={ this.handleClickOnButton.bind(this, 'eraser') }>
                  <i className='fa fa-eraser fa-2x' />
                </span>
              </li>
              <li>
                <span onClick={ this.handleClickOnButton.bind(this, 'color') }>
                  <i className='fa fa-tint fa-2x' />
                </span>
              </li>
              <li>
                <span onClick={ this.handleClickOnButton.bind(this, 'config') }>
                  <i className='fa fa-cog fa-2x' />
                </span>
              </li>
           </ul>
         </div>
        </div>
        <div className='menu-center noselect'>
          <div className='menu-logo noselect'>
            <i className='fa fa-paint-brush noselect'/>
          </div>
        </div>
      </div>
    )
  }

}

export default Menu;
