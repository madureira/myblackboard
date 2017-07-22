import React, { Component } from 'react';

class Menu extends Component {

  static brushColors() {
    return ['white', 'red', 'blue', 'green', 'yellow', 'black'];
  }

  constructor(props) {
    super(props);
    this.state = {
      showSubmenu: false,
      tool: 'brush',
      brushSize: 2,
      eraserSize: 4,
      color: 'white'
    };
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

  handleClickConfig() {
    // TODO: Implement configuration
  }

  handleClickBrush() {
    let state = this.state;
    this.setState({ tool: 'brush' }, () => {
      this.props.selectTool('brush', state.brushSize, state.eraserSize, state.color);
    });
  }

  handleClickEraser() {
    let state = this.state;
    this.setState({ tool: 'eraser' }, () => {
      this.props.selectTool('eraser', state.brushSize, state.eraserSize, state.color);
    });
  }

  handleSelectSize(size) {
    let state   = this.state;
    let option  = {
      brush: state.brushSize,
      eraser: state.eraserSize
    };

    if (state.tool === 'brush') {
      option.brush = size;
    } else {
      option.eraser = size;
    }

    this.setState({ brushSize: option.brush, eraserSize: option.eraser }, () => {
      this.props.selectTool(state.tool, option.brush, option.eraser, state.color);
    });
  }

  handleSelectColor(color) {
    this.setState({ color: color }, () => {
      this.props.selectTool('brush', this.state.brushSize, this.state.eraserSize, color);
    });
  }

  renderSizeOptions() {
    let _this = this;
    let tool  = this.state.tool;
    let clazz = ((tool === 'brush' || tool === 'eraser') ? '' : 'hide');
    clazz += (tool === 'brush' ? 'flip-circle' : '');

    return (
      <div className={ `menu-circle ${clazz}` }>
        {
          [1,2,3,4,5,6].map((number, i) => {
            return (
              <div key={ i }
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
    return (
      <div className={ 'menu-circle' + (this.state.tool === 'color' ? '' : ' hide') }>
        {
          Menu.brushColors().map((color, i) => {
            return (
              <div key={ i }
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
                  let clickEvent = () => {};

                  if (tool.name === 'config') {
                    clickEvent = this.handleClickConfig.bind(this);
                  } else if (tool.name === 'brush') {
                    clickEvent = this.handleClickBrush.bind(this);
                  } else if (tool.name === 'eraser') {
                    clickEvent = this.handleClickEraser.bind(this);
                  }

                  return (
                    <li key={ i } className={ (this.state.tool === tool.name ? 'button-active' : '') }>
                      <span
                        onMouseOver={ this.onMouseOverButton.bind(this, tool.name) }
                        onMouseOut={ this.onMouseOutButton.bind(this) }
                        onClick={ clickEvent }
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
