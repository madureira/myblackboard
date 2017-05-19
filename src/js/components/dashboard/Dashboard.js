import React, { Component } from 'react';
import Board                from './Board';
import Menu                 from '../menu/Menu';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.mouse = { x: 0, y: 0 };
    this.state = {
      menu: {
        show: false,
        x: 0,
        y: 0
      }
    };
  }

  componentDidMount() {
    const _this = this;

    document.getElementById('canvas').addEventListener('mousemove', function(e) {
      _this.mouse.x = (e.pageX - this.offsetLeft);
      _this.mouse.y = (e.pageY - this.offsetTop) - 100;
    }, false);

    window.oncontextmenu = () => {
      this.setState({
        menu: {
          show: true,
          x: _this.mouse.x,
          y: _this.mouse.y
        }
      });
      return false;
    };
  }

  hideMenu() {
    this.setState({ menu: { show: false, x: 0, y: 0 } });
  }

  render() {
    return (
      <section id='app-content'>
        <Board hideMenu={ this.hideMenu.bind(this) } />
        <Menu { ...this.state.menu }/>
      </section>
    )
  }

}

export default Dashboard;
