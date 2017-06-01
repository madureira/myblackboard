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
      this.setState({ showSubmenu: false, tool: button });
    } else if (this.state.tool === 'config' && !button) {
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
    let _this = this;
    let tool = this.state.tool;
    let clazz = ((tool === 'brush' || tool === 'eraser') ? '' : 'hide');
    clazz += (tool === 'brush' ? 'flip-circle' : '');

    return (
      <div className={ `menu-circle ${clazz}` }>
        {
          [1,2,3,4,5,6].map((number, i) => {
            return (
              <div
                key={ i }
                className={ `ball ball-size ball-size-${number}` }
                onClick={ _this.handleSelectSize.bind(_this, number) }
              />
            );
          })
        }
      </div>
    );
  }

  renderColorOptions() {
    let colors = ['white', 'red', 'blue', 'green', 'yellow', 'black'];

    return (
      <div className={ 'menu-circle' + (this.state.tool === 'color' ? '' : ' hide') }>
        {
          colors.map((color, i) => {
            return (
              <div
                key={ i }
                className={ `ball ball-color ball-color-${i+1}` }
                onClick={ this.handleSelectColor.bind(this, color) }
              />
            );
          })
        }
      </div>
    );
  }

  render() {
    let position = { top: `${this.props.y}px`, left: `${this.props.x}px` };
    let show = (this.props.show ? ' menu-open' : '');
    let showSubmenu = (this.state.showSubmenu ? 'submenu-open' : '');
    let options = [
      { name: 'brush',  icon: 'pencil' },
      { name: 'eraser', icon: 'eraser' },
      { name: 'color',  icon: 'tint' },
      { name: 'config', icon: 'cog' }
    ];

    return (
      <div id='menu' className={ 'menu noselect' + show } style={ position }>
        <div className='menu-board noselect'>
          <div className='main-menu noselect'>
            <ul>
              {
                options.map((tool, i) => {
                  let clickEvent = (tool.name === 'config' ? this.handleClickConfig.bind(this) : ()=>{});
                  return (
                    <li key={ i } className={ (this.state.tool === tool.name ? 'button-active' : '') }>
                      <span onClick={ clickEvent }
                        onMouseOver={ this.onMouseOverButton.bind(this, tool.name) }
                        onMouseOut={ this.onMouseOutButton.bind(this) }
                      >
                        <i className={ `fa fa-${tool.icon} fa-2x` } />
                      </span>
                    </li>
                  );
                })
              }
           </ul>
         </div>
        </div>
        <div className={ 'menu-center noselect ' + showSubmenu }
          onMouseOver={ this.onMouseOverButton.bind(this, null) }
          onMouseOut={ this.onMouseOutButton.bind(this) }
        >
          { this.renderSizeOptions() }
          { this.renderColorOptions() }
          <div className='menu-logo noselect'>
            <span className='logo'/>
          </div>
        </div>
      </div>
    )
  }

}

export default Menu;
