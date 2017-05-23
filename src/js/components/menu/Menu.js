import React, { Component } from 'react';

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSubmenu: false,
      tool: 'brush',
      size: 1,
      color: 'white'
    };
  }

  handleClickConfig() {
    console.log('config');
  }

  onMouseOverButton(button, event) {
    event.stopPropagation();
    if (button && button !== 'config') {
      this.setState({ showSubmenu: true, tool: button });
    } else if (button === 'config') {
      this.setState({ showSubmenu: false, tool: null });
    } else if (!this.state.tool && !button) {
      this.setState({ showSubmenu: false });
    } else {
      this.setState({ showSubmenu: true });
    }
  }

  onMouseOutButton(event) {
    event.stopPropagation();
    this.setState({ showSubmenu: false });
  }

  handleSelectSize(size) {
    this.setState({ size: size }, () => {
      this.props.selectTool(this.state.tool, size, this.state.color);
    });
  }

  handleSelectColor(color) {
    this.setState({ color: color }, () => {
      this.props.selectTool('brush', this.state.size, color);
    });
  }

  renderSizeOptions() {
    let tool = this.state.tool;

    if (tool === 'brush' || tool === 'eraser') {
      return (
        <div className='menu-circle'>
          <div className='ball ball-size ball-size-1' onClick={ this.handleSelectSize.bind(this, 1) }></div>
          <div className='ball ball-size ball-size-2' onClick={ this.handleSelectSize.bind(this, 2) }></div>
          <div className='ball ball-size ball-size-3' onClick={ this.handleSelectSize.bind(this, 3) }></div>
          <div className='ball ball-size ball-size-4' onClick={ this.handleSelectSize.bind(this, 4) }></div>
          <div className='ball ball-size ball-size-5' onClick={ this.handleSelectSize.bind(this, 5) }></div>
          <div className='ball ball-size ball-size-6' onClick={ this.handleSelectSize.bind(this, 6) }></div>
        </div>
      );
    }
  }

  renderColorOptions() {
    let tool = this.state.tool;

    if (tool === 'color') {
      return (
        <div className='menu-circle'>
          <div className='ball ball-color ball-color-1' onClick={ this.handleSelectColor.bind(this, 'white') }></div>
          <div className='ball ball-color ball-color-2' onClick={ this.handleSelectColor.bind(this, 'red') }></div>
          <div className='ball ball-color ball-color-3' onClick={ this.handleSelectColor.bind(this, 'blue') }></div>
          <div className='ball ball-color ball-color-4' onClick={ this.handleSelectColor.bind(this, 'green') }></div>
          <div className='ball ball-color ball-color-5' onClick={ this.handleSelectColor.bind(this, 'yellow') }></div>
          <div className='ball ball-color ball-color-6' onClick={ this.handleSelectColor.bind(this, 'black') }></div>
        </div>
      );
    }
  }

  render() {
    let position = {
      top: `${this.props.y}px`,
      left: `${this.props.x}px`
    };

    let show = (this.props.show ? ' menu-open' : '');
    let showSubmenu = (this.state.showSubmenu ? 'submenu-open' : '');

    return (
      <div id='menu' className={ 'menu noselect' + show } style={ position }>
        <div className='menu-board noselect'>
          <div className='main-menu noselect'>
            <ul>
              <li className={ (this.state.tool === 'brush' ? 'button-active' : '') }>
                <span
                  onMouseOver={ this.onMouseOverButton.bind(this, 'brush') }
                  onMouseOut={ this.onMouseOutButton.bind(this) }
                >
                  <i className='fa fa-pencil fa-2x' />
                </span>
              </li>
              <li className={ (this.state.tool === 'eraser' ? 'button-active' : '') }>
                <span
                  onMouseOver={ this.onMouseOverButton.bind(this, 'eraser') }
                  onMouseOut={ this.onMouseOutButton.bind(this) }
                >
                  <i className='fa fa-eraser fa-2x' />
                </span>
              </li>
              <li className={ (this.state.tool === 'color' ? 'button-active' : '') }>
                <span
                  onMouseOver={ this.onMouseOverButton.bind(this, 'color') }
                  onMouseOut={ this.onMouseOutButton.bind(this) }
                >
                  <i className='fa fa-tint fa-2x' />
                </span>
              </li>
              <li className={ (this.state.tool === 'config' ? 'button-active' : '') }>
                <span
                  onClick={ this.handleClickConfig.bind(this) }
                  onMouseOver={ this.onMouseOverButton.bind(this, 'config') }
                  onMouseOut={ this.onMouseOutButton.bind(this) }
                >
                  <i className='fa fa-cog fa-2x' />
                </span>
              </li>
           </ul>
         </div>
        </div>
        <div
          className={ 'menu-center noselect ' + showSubmenu }
          onMouseOver={ this.onMouseOverButton.bind(this, null) }
          onMouseOut={ this.onMouseOutButton.bind(this) }
        >
          { this.renderSizeOptions() }
          { this.renderColorOptions() }
          <div className='menu-logo noselect'>
            <i className='fa fa-paint-brush noselect'/>
          </div>
        </div>
      </div>
    )
  }

}

export default Menu;
