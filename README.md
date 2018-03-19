


# CTF.io

*This project is not finished. Please contribute!*

The main goals of this project are to:

* Create a 2d game, inspired by surviv.io, but with a capture-the-flag styled theme.
* Make an API capable of enabling people to easily create their own ctf.io server.
* Create a mobile client for iOS and Android.

**Depenencies:**<br>
Ruby on Rails server - http://rubyonrails.org/<br>
REDIS server - https://redis.io/topics/quickstart<br><br>
## Server
CTF.io uses Rails ActionCable to enable the game to have very low-latency, and nearly lag-free gameplay.<br>
REDIS server, listed in dependencies, also allows lightning fast game data storage.<br>
## Client
CTF.io uses HTML5 canvas, controlled by JavaScript, and minimalistic jQuery, split up into three main files:

 1. [canvas.js](https://github.com/bowwow15/ctf.io/blob/master/app/assets/javascripts/canvas.js) - initiates the canvas, and resizes, proportional to view.
 2. [game.js](https://github.com/bowwow15/ctf.io/blob/master/app/assets/javascripts/game.js) - all of the functionality within the game. Calls methods from gameObjects.js.
 3. [gameObjects.js](https://github.com/bowwow15/ctf.io/blob/master/app/assets/javascripts/gameObjects.js) - Self explanatory. Declares objects and methods used in game.

This game uses no game libraries. The only library used in the making of CTF.io is jQuery, which is not a canvas game library, and is used very -   minimalistically in the development of the game itself.

## In-Game
**CTF.io controls:**

Move: **W**,**A**,**S**,**D**.<br>
Sprint: Hold **shift** key.<br>
Crouch/Sneak: Hold **alt** key on PC/Linux, or **option** on Mac.<br>
Select Item from inventory: numbers **1**-**8** (no numpad).<br>
Keep player fixed in one spot in the screen: **C**.<br>

![In-game screenshot](https://github.com/bowwow15/ctf.io/blob/master/public/images/example3.png?raw=true)

![enter image description here](https://github.com/bowwow15/ctf.io/blob/master/public/images/example4.png?raw=true)

----------
Copyright 2018 Brooks Jeremiah Wibberding, 
All rights reserved.
