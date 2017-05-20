import React, { Component } from 'react';

class Board extends Component {

  constructor(props) {
    super(props);
    this.inMemCanvas = null;
    this.inMemCtx = null;
    this.lineWidth = 5;
    this.lineJoin = 'round';
    this.lineCap = 'round';
    this.strokeStyle = '#fff';
    this.keyBrush = 'b';
    this.keyEraser = 'e';
    this.keyIncreaseBrush = '+';
    this.keyDecreaseBrush = '-';
    this.state = {
      currentTool: this.props.currentTool
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentTool: nextProps.currentTool });
  }

  componentDidMount() {
    this.createInMemoryCanvas();
    let canvas = document.getElementById('canvas');
    let ctx    = canvas.getContext('2d');

    window.addEventListener('resize', () => {
      this.onResizeBoard(canvas, ctx);
    }, false);

    this.onResizeBoard(canvas, ctx);
    this.keyboardEvents(ctx);
  }

  keyboardEvents(ctx) {
    document.onkeypress = (evt) => {
      evt = evt || window.event;
      let charCode = evt.keyCode || evt.which;
      let charStr = String.fromCharCode(charCode);

      if (charStr === this.keyIncreaseBrush) {
        this.lineWidth += 2;
        this.updateBrush(this.inMemCtx);
        this.updateBrush(ctx);
      } else if (charStr === this.keyDecreaseBrush) {
        this.lineWidth -= 2;
        this.updateBrush(this.inMemCtx);
        this.updateBrush(ctx);
      }
    };
  }

  createInMemoryCanvas() {
    let { width, height } = this.getScreenSize();

    this.inMemCanvas = document.createElement('canvas');
    this.inMemCanvas.width  = width;
    this.inMemCanvas.height = height;
    this.inMemCtx = this.inMemCanvas.getContext('2d');

    this.updateBrush(this.inMemCtx);
  }

  onResizeBoard(canvas, ctx) {
    let { width, height } = this.getScreenSize();

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(this.inMemCanvas, 0, 0);
    this.updateBrush(ctx);

    let mouse = {x: 0, y: 0};
  	let lastMouse = {x: 0, y: 0};

  	canvas.addEventListener('mousemove', function(e) {
  		lastMouse.x = mouse.x;
  		lastMouse.y = mouse.y;
  		mouse.x = e.pageX - this.offsetLeft;
  		mouse.y = e.pageY - this.offsetTop;
  	}, false);

  	canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.props.hideMenu();
  		  canvas.addEventListener('mousemove', onPaint, false);
      }
  	}, false);

  	canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
  		  canvas.removeEventListener('mousemove', onPaint, false);
      }
  	}, false);

  	let onPaint = () => {
      this.draw(ctx, lastMouse, mouse);
  	};
  }

  draw(ctx, lastMouse, mouse) {
    ctx.beginPath();
    this.inMemCtx.beginPath();
    if (this.state.currentTool === 'brush') {
      ctx.globalCompositeOperation='source-over';
      ctx.moveTo(lastMouse.x, lastMouse.y);
      ctx.lineTo(mouse.x, mouse.y);

      this.inMemCtx.globalCompositeOperation='source-over';
      this.inMemCtx.moveTo(lastMouse.x, lastMouse.y);
      this.inMemCtx.lineTo(mouse.x, mouse.y);
    } else if (this.state.currentTool === 'eraser') {
      ctx.globalCompositeOperation='destination-out';
      ctx.moveTo(lastMouse.x, lastMouse.y);
      ctx.lineTo(mouse.x, mouse.y);

      this.inMemCtx.globalCompositeOperation='destination-out';
      this.inMemCtx.moveTo(lastMouse.x, lastMouse.y);
      this.inMemCtx.lineTo(mouse.x, mouse.y);
    }
    ctx.closePath();
    ctx.stroke();
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

  updateBrush(context) {
    context.lineWidth   = (this.lineWidth > 1 ? this.lineWidth : 1);
    context.lineJoin    = this.lineJoin;
    context.lineCap     = this.lineCap;
    context.strokeStyle = this.strokeStyle;
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
