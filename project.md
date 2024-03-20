# Project (coop-snake)

## Description

This project is a game that is played by two players. The game is a snake game where the two snakes are controlled by two players on two different mobile devices. The game can be played on iOS and Android. The game can also be played in a web browser and the game is synced over websockets.

## Tech Stack

- React Native
  - [react-native-game-engine](https://github.com/bberak/react-native-game-engine)
- Java Spring Boot
  - websockets
  - REST API
- Redis
  - key-value database for highscores
- Docker

## MVP

- two snakes that die if they run into each other or themselves
- control snake through mobile app
- sync over websockets
- high-score of a team will be saved to a key-value database

## Stretch Goals

- add more players
- add power-ups
- add different game modes
- add different maps
- add different skins
- add different game mechanics
- add different game modes

## User Stories

- As a player, I want to be able to play the game on my mobile device
- As a player, I want to be able to play the game on my web browser
- As a player, I want to be able to play the game with a friend

## Wireframes

- [Wireframes](./wireframes/wireframes.pdf)
