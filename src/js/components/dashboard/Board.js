import React, { Component } from 'react';

class Board extends Component {

  constructor(props) {
    super(props);
    this.inMemCanvas = null;
    this.inMemCtx = null;
    this.canvas = null;
    this.ctx = null;

    this.lineJoin = 'round';
    this.lineCap = 'round';
    this.keyBrush = 'b';
    this.keyEraser = 'e';
    this.keyIncreaseBrush = '+';
    this.keyDecreaseBrush = '-';
    this.state = {
      tool: 'brush',
      size: 2,
      color: 'white'
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.tool || !nextProps.size || !nextProps.color) return;

    this.setState({ tool: nextProps.tool, size: nextProps.size, color: nextProps.color }, () => {
      this.updateBrush();
    });
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    this.ctx    = this.canvas.getContext('2d');

    this.createInMemoryCanvas();

    window.addEventListener('resize', () => {
      this.onResizeBoard();
    }, false);

    this.onResizeBoard();
  }

  createInMemoryCanvas() {
    let { width, height } = this.getScreenSize();

    this.inMemCanvas = document.createElement('canvas');
    this.inMemCanvas.width  = width;
    this.inMemCanvas.height = height;
    this.inMemCtx = this.inMemCanvas.getContext('2d');

    this.updateBrush();
  }

  onResizeBoard() {
    let { width, height } = this.getScreenSize();

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(this.inMemCanvas, 0, 0);
    this.updateBrush();

    let mouse = {x: 0, y: 0};
    let lastMouse = {x: 0, y: 0};

    this.canvas.addEventListener('mousemove', function(e) {
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
    }, false);

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.props.hideMenu();
        this.canvas.addEventListener('mousemove', onPaint, false);
      }
    }, false);

    this.canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.canvas.removeEventListener('mousemove', onPaint, false);
      }
    }, false);

    let onPaint = () => {
      this.draw(lastMouse, mouse);
    };
  }

  draw(lastMouse, mouse) {
    this.ctx.beginPath();
    this.inMemCtx.beginPath();
    if (this.state.tool === 'brush') {
      this.ctx.globalCompositeOperation='source-over';
      this.ctx.moveTo(lastMouse.x, lastMouse.y);
      this.ctx.lineTo(mouse.x, mouse.y);

      this.inMemCtx.globalCompositeOperation='source-over';
      this.inMemCtx.moveTo(lastMouse.x, lastMouse.y);
      this.inMemCtx.lineTo(mouse.x, mouse.y);
    } else if (this.state.tool === 'eraser') {
      this.ctx.globalCompositeOperation='destination-out';
      this.ctx.moveTo(lastMouse.x, lastMouse.y);
      this.ctx.lineTo(mouse.x, mouse.y);

      this.inMemCtx.globalCompositeOperation='destination-out';
      this.inMemCtx.moveTo(lastMouse.x, lastMouse.y);
      this.inMemCtx.lineTo(mouse.x, mouse.y);
    }
    this.ctx.closePath();
    this.ctx.stroke();
    this.inMemCtx.closePath();
    this.inMemCtx.stroke();
  }

  getScreenSize() {
    let sketch_style = window.getComputedStyle(document.querySelector('.board'));
    return {
      width: parseInt(sketch_style.getPropertyValue('width')),
      height: parseInt(sketch_style.getPropertyValue('height'))
    };
  }

  updateBrush() {
    let size  = this.state.size;
    let tool    = this.state.tool;

    if (tool === 'brush') {
      if (size === 2) {
        size = 4;
      } else if (size === 3) {
        size = 10;
      } else if (size === 4) {
        size = 15;
      } else if (size === 5) {
        size = 25;
      } else if (size === 6) {
        size = 35;
      }
    } else if (tool === 'eraser') {
      if (size === 2) {
        size = 8;
      } else if (size === 3) {
        size = 15;
      } else if (size === 4) {
        size = 30;
      } else if (size === 5) {
        size = 45;
      } else if (size === 6) {
        size = 60;
      }
    }

    this.ctx.lineWidth   = size;
    this.ctx.lineJoin    = this.lineJoin;
    this.ctx.lineCap     = this.lineCap;
    this.ctx.strokeStyle = this.state.color;

    this.inMemCtx.lineWidth   = size;
    this.inMemCtx.lineJoin    = this.lineJoin;
    this.inMemCtx.lineCap     = this.lineCap;
    this.inMemCtx.strokeStyle = this.state.color;
  }

  render() {
    return (
      <div className='board'>
        <canvas id='canvas'/>
      </div>
    )
  }

}

export default Board;
