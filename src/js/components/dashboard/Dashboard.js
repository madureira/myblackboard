import React, { Component } from 'react';
import Board                from './Board';
import Menu                 from '../menu/Menu';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.mouse = { x: 0, y: 0 };
    this.state = {
      tool: 'brush',
      menu: {
        show: false,
        x: 0,
        y: 0
      },
    };
  }

  componentDidMount() {
    let _this = this;
    let canvas = document.getElementById('canvas');

    let setPosition = (screen, context) => {
      _this.mouse.x = (screen.pageX - context.offsetLeft);
      _this.mouse.y = (screen.pageY - context.offsetTop) - 100;
    }

    canvas.addEventListener('mousemove', function(e) {
      setPosition(e, this);
    }, false);

    canvas.addEventListener('touchstart', function(e) {
      if (e.targetTouches.length > 1) {
        setPosition(e.targetTouches[0], this);
        _this.showMenu();
      }
    }, false);

    window.oncontextmenu = () => {
      if (_this.state.menu.show) {
        _this.hideMenu();
        setTimeout(() => { _this.showMenu(); }, 200);
      } else {
        _this.showMenu();
      }
      return false;
    };
  }

  showMenu() {
    this.setState({ menu: { show: true, x: this.mouse.x, y: this.mouse.y } });
  }

  hideMenu() {
    let menu = this.state.menu;
    this.setState({ menu: { show: false, x: menu.x, y: menu.y } });
  }

  handleSelectToolOptions(tool, brushSize, eraserSize, color) {
    let menu = this.state.menu;
    this.setState({
      tool: tool,
      brushSize: brushSize,
      eraserSize: eraserSize,
      color: color,
      menu: { show: false, x: menu.x, y: menu.y }
    });
  }

  render() {
    return (
      <section id='app-content'>
        <Board
          hideMenu={ this.hideMenu.bind(this) }
          tool={ this.state.tool }
          brushSize={ this.state.brushSize }
          eraserSize={ this.state.eraserSize }
          color={ this.state.color }
        />
        <Menu { ...this.state.menu } selectTool={ this.handleSelectToolOptions.bind(this) }/>
      </section>
    )
  }

}

export default Dashboard;
