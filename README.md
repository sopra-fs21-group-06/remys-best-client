<h1 align="center">
  <br>
   <img src="./src/img/dog-x-remys.png" width="auto" height="128">
  <br>
  Remy's Best Client
  <br>
</h1>
<p align="center">
  <a href="https://github.com/sopra-fs21-group-06/remys-best-client/actions">
    <img src="https://github.com/sopra-fs21-group-06/remys-best-client/workflows/Deploy%20Project/badge.svg"
         alt="Deployment Status">
  </a>
  <a href="https://heroku-badge.herokuapp.com/?app=remys-best-client"><img src="https://heroku-badge.herokuapp.com/?app=remys-best-client&style=flat&svg=1"></a>
  <a href="https://sonarcloud.io/dashboard?id=sopra-fs21-group-06_remys-best-client">
      <img src="https://sonarcloud.io/api/project_badges/measure?project=sopra-fs21-group-06_remys-best-client&metric=alert_status">
  </a>
</p>

## Introduction

Brändi Dog is a fun card/board game created by [Stiftung Brändi](https://www.braendi.ch/). This repository is the front-end part of an online implementation for this board game.

## Technologies

The client is written in JavaScript using React. For styling, Scss is used.

To establish a connection between the front- and backend REST is used. When further proceeding in the game (joining a lobby), a websocket connection gets established.

## High-level Components

## Rücksprache Pascal

The [HomeView](src/views/auth/Home.js) displays is the first entry Point a user enters upon succesful login. This view is the central navigation point. The users can either navigate to a the single player mode, the create game mode, they can manage their friends or can update their userprofile. Furthermore a websocket connection has already been established at this point. The client is subscripted to two private topics. One for receiving gameinvitations and one for receiving a countdown that showcases the remaining time the request is pending.

The [Waiting-Room](src/views/auth/WaitingRoom.js) is our central entity to enable player to play in a single player fashion. The waitingroom which gets treated as a queue collects users until the usercount reaches 4 and a new game with all the users sitting in the waitingroom gets intialized. In the waitingroom two important websocket subscriptions are being established. One to receive the current userlist of the waitingroom everytime a user enters or leaves the waitingroom. And a second one to receive the gameId after either a game has been initialized after the usercount reached four or when the user got fetched by a host of a game-lobby who decided to fill-up his game with people from the waitingroom.

The [GameView](src/views/auth/Game.js) handles all in-game packages (card, marbles, move-requests etc). It recieves the game state and renders the view accordingly. An example of this is the [PlayerHand](src/components/ingame/hand/Hand.js). It displays the cards of the player. ??

Want to say something about forms and/or websocketprovider/consumer setup?

## Launch & Development

* `npm run dev`

  Runs the app in the development mode.<br />
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

  The page will reload if you make edits.<br />
  You will also see any lint errors in the console.

* `npm run build`

  Builds the app for production to the `build` folder.<br />
  It correctly bundles React in production mode and optimizes the build for the best performance.

  The build is minified and the filenames include the hashes.<br />
  Your app is ready to be deployed!

  See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Screenshots

Upon succesful login, the home screen appears where one can choose either to create a game, play singleplayer mode, manage friend or edit its profile.

![Main Menu](src/img/ReadMeScreenShots/Home-Screen.PNG)

When entering the waitingroom, the user needs to wait until either four player joined the waitingroom such that the server intializes a new game or until the users gets fetched by a host in a gamesession as fill-up. 

![Lobby List](src/img/ReadMeScreenShots/Waiting-Room.PNG)

When creating a game, the user now the host need to either invite people from his friendslist or fill-up the game-session with users from the waitingroom.

![Lobby Browser](src/img/ReadMeScreenShots/Create_Game-Screen.PNG)

Once a game has been initialized all the players need to decide which color they want to play.

![Ingame](src/img/ReadMeScreenShots/Choose-Color-Screen.PNG)

This view is where all the game takes place. Everything from the card handout, the card-exchange, to performing a move and eventually either winning or losing the game.

![Ingame](src/img/ReadMeScreenShots/Game-Screen.PNG)

## Roadmap

1. Implement emailverification
2. Minor bug fixes
3. Mobile version?

## Authors and Acknowledgements

### Members of the SoPra-group 09 2020:

[Andrina Vincenz](https://github.com/AndrinaVincenz), [Edouard Schmitz](https://github.com/edischmitz), [Pascal Emmenegger](https://github.com/pemmenegger), [Siddhant Sahu](https://github.com/iamsiddhantsahu), [Sandro Volontè](https://github.com/SandroVolonte)

### Acknowledgements

First of all we want to thank Stiftung Brändi for creating such an amazing game. We all had a fun time implementing the game, and also learned a lot.
Further we would like to thank our tutor Remy Egloff, who always provided useful advice to get cleaner code and more user-friendliness. We are also very grateful for our friends and families for testing our game extensively and also providing improvements in terms of user-friendlyness.