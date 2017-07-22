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
    window.addEventListener('resize', () => this.initBoard(), false);
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

    let onPaint = () => this.draw(lastMouse, mouse);

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
      this.moveLine(lastMouse, mouse, 'source-over', this.ctx);
      this.moveLine(lastMouse, mouse, 'source-over', this.inMemCtx);
    } else if (this.state.tool === 'eraser') {
      this.moveLine(lastMouse, mouse, 'destination-out', this.ctx);
      this.moveLine(lastMouse, mouse, 'destination-out', this.inMemCtx);
    }
    this.ctx.closePath();
    this.ctx.stroke();
    this.inMemCtx.closePath();
    this.inMemCtx.stroke();
  }

  moveLine(lastMouse, mouse, operation, ctx) {
    ctx.globalCompositeOperation = operation;
    ctx.moveTo(lastMouse.x, lastMouse.y);
    ctx.lineTo(mouse.x, mouse.y);
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

    this.setBrushOptions(size, this.lineJoin, this.lineCap, this.state.color, this.ctx);
    this.setBrushOptions(size, this.lineJoin, this.lineCap, this.state.color, this.inMemCtx);
  }

  setBrushOptions(size, lineJoin, lineCap, color, ctx) {
    ctx.lineWidth   = size;
    ctx.lineJoin    = lineJoin;
    ctx.lineCap     = lineCap;
    ctx.strokeStyle = color;
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
