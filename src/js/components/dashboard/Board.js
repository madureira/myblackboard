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
      brushSize: 2,
      eraserSize: 30,
      color: 'white'
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tool: nextProps.tool,
      brushSize: nextProps.brushSize,
      eraserSize: nextProps.eraserSize,
      color: nextProps.color
    }, () => {
      this.updateBrush();
    });
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    this.ctx    = this.canvas.getContext('2d');

    this.createInMemoryCanvas();

    window.addEventListener('resize', () => {
      this.initBoard();
    }, false);

    this.initBoard();
  }

  createInMemoryCanvas() {
    let { width, height } = this.getScreenSize();

    this.inMemCanvas = document.createElement('canvas');
    this.inMemCanvas.width  = width;
    this.inMemCanvas.height = height;
    this.inMemCtx = this.inMemCanvas.getContext('2d');

    this.updateBrush();
  }

  initBoard() {
    let _this             = this;
    let mouse             = { x: 0, y: 0 };
    let lastMouse         = { x: 0, y: 0 };
    let { width, height } = this.getScreenSize();

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(this.inMemCanvas, 0, 0);
    this.updateBrush();

    let onPaint = () => {
      this.draw(lastMouse, mouse);
    };

    let setPosition = (screen, context) => {
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
      mouse.x = screen.pageX - context.offsetLeft;
      mouse.y = screen.pageY - context.offsetTop;
    }

    this.canvas.addEventListener('mousemove', function(e) {
      setPosition(e, this);
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

    this.canvas.addEventListener('touchstart', function(e) {
      if (e.targetTouches.length === 1) {
        setPosition(e.targetTouches[0], this);
        _this.props.hideMenu();
        _this.canvas.addEventListener('touchmove', onPaint, false);
      }
    }, false);

    this.canvas.addEventListener('touchmove', function(e) {
      e.preventDefault();
      if (e.targetTouches.length === 1) {
        setPosition(e.targetTouches[0], this);
      }
    }, false);

    this.canvas.addEventListener('touchleave', (e) => {
      this.canvas.removeEventListener('touchmove', onPaint, false);
    }, false);
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
    let brushSize   = this.state.brushSize;
    let eraserSize  = this.state.eraserSize;
    let tool        = this.state.tool;
    let size        = 4;

    if (tool === 'brush') {
      if (brushSize === 2) {
        size = 4;
      } else if (brushSize === 3) {
        size = 10;
      } else if (brushSize === 4) {
        size = 15;
      } else if (brushSize === 5) {
        size = 25;
      } else if (brushSize === 6) {
        size = 35;
      } else {
        size = brushSize;
      }
    } else if (tool === 'eraser') {
      if (eraserSize === 2) {
        size = 8;
      } else if (eraserSize === 3) {
        size = 15;
      } else if (eraserSize === 4) {
        size = 30;
      } else if (eraserSize === 5) {
        size = 45;
      } else if (eraserSize === 6) {
        size = 60;
      } else {
        size = eraserSize;
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
