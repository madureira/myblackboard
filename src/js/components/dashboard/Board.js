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
  }

  componentDidMount() {
    let _this = this;

    this.createInMemoryCanvas();

    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    this.onResizeBoard(canvas, ctx);

    window.addEventListener('resize', () => {
      _this.onResizeBoard(canvas, ctx);
    }, false);
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

    //this.inMemCtx.drawImage(canvas, 0, 0);
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(this.inMemCanvas, 0, 0);

    let mouse = {x: 0, y: 0};
  	let lastMouse = {x: 0, y: 0};

    this.updateBrush(ctx);

  	/* Mouse Capturing Work */
  	canvas.addEventListener('mousemove', function(e) {
      var self = this;
  		lastMouse.x = mouse.x;
  		lastMouse.y = mouse.y;

  		mouse.x = e.pageX - self.offsetLeft;
  		mouse.y = e.pageY - self.offsetTop;
  	}, this);

  	canvas.addEventListener('mousedown', (e) => {
  		canvas.addEventListener('mousemove', onPaint, false);
  	}, false);

  	canvas.addEventListener('mouseup', () => {
  		canvas.removeEventListener('mousemove', onPaint, false);
  	}, false);

  	let onPaint = () => {
  		ctx.beginPath();
  		ctx.moveTo(lastMouse.x, lastMouse.y);
  		ctx.lineTo(mouse.x, mouse.y);
  		ctx.closePath();
  		ctx.stroke();

      this.inMemCtx.beginPath();
      this.inMemCtx.moveTo(lastMouse.x, lastMouse.y);
      this.inMemCtx.lineTo(mouse.x, mouse.y);
      this.inMemCtx.closePath();
      this.inMemCtx.stroke();
  	};
  }

  getScreenSize() {
    let sketch_style = window.getComputedStyle(document.querySelector('.board'));
    let w = parseInt(sketch_style.getPropertyValue('width'));
    let h = parseInt(sketch_style.getPropertyValue('height'));
    return { width: w, height: h };
  }

  updateBrush(context) {
    context.lineWidth   = this.lineWidth;
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
