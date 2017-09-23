# myblackboard
[![GitHub version](https://badge.fury.io/gh/madureira%2Fblackboard.svg)](https://badge.fury.io/gh/madureira%2Fblackboard)

A tool used to explore your creativity, draw and sketch some ideas.

![Caption for the picture.](https://raw.githubusercontent.com/madureira/myblackboard/master/src/images/screenshot-myblackboard.png)


[Live Demo](https://madureira.github.io/myblackboard/)

To start drawing is really simple, just click and handle the **left button** of your mouse and drag on the screen.

To open the brush selection menu, click on **right button** of your mouse.

> **IMPORTANT**

> To improve your experience and precision, use some pen tablets like Wacom&reg; or another.

## Features

- Draw
- Erase
- Change brush size
- Change brush color
- Support touch screen devices

## TODO

- Implement *undo action*
- Implement *clean screen*
- Implement *print image*
- Implement *drag image*
- Implement *straight line support*

---

## Development
If you want to fork this project and run it in development mode, see the instructions below.

#### Run desktop mode:
```sh
$ npm start
```

#### Run desktop mode and watch for modifications and auto compile.
```sh
$ npm run watch
```

#### Build the project:
```sh
$ npm run build
```

#### Build the project with minified assets:
```sh
$ npm run build:prod
```

#### Build the desktop app:
```sh
$ npm run packager
```
To use the desktop app, navigate to `myblackboard/release/myblackboard-SO-plataform/` and run the executable file.

#### Browser mode:
If you want to open the app on your browser, you can build the project and get the html file inside `myblackboard/dist/`
