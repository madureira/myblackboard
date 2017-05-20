import React, { Component } from 'react';
import Board                from './Board';
import Menu                 from '../menu/Menu';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.mouse = { x: 0, y: 0 };
    this.state = {
      currentTool: 'brush',
      menu: {
        show: false,
        x: 0,
        y: 0
      },
    };
  }

  componentDidMount() {
    const _this = this;

    document.getElementById('canvas').addEventListener('mousemove', function(e) {
      _this.mouse.x = (e.pageX - this.offsetLeft);
      _this.mouse.y = (e.pageY - this.offsetTop) - 100;
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

  handleSelectOption(option) {
    let menu = this.state.menu;
    this.setState({ currentTool: option, menu: { show: false, x: menu.x, y: menu.y } });
  }

  render() {
    return (
      <section id='app-content'>
        <Board hideMenu={ this.hideMenu.bind(this) } currentTool={ this.state.currentTool }/>
        <Menu { ...this.state.menu } selectTool={ this.handleSelectOption.bind(this) }/>
      </section>
    )
  }

}

export default Dashboard;
