import React, { Component } from 'react';

class Menu extends Component {

  render() {
    let style = {
      display: (this.props.show ? 'block' : 'none'),
      top: `${this.props.y}px`,
      left: `${this.props.x}px`
    };

    return (
      <div id='menu' className='menu' style={ style }>
        <div className='menu-board'></div>
      </div>
    )
  }

}

export default Menu;
