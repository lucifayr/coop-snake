import { GameConstants, SnakeBodyDirection } from "./GameConstants";

export const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const GameLoop = (entities: { head: any; food: any; tail: any }, e: { touches: any; dispatch: any; events: any }) => {
  let head = entities.head;
  let food = entities.food;
  let tail = entities.tail;

  if (e.events.length) {
    for (let i = 0; i < e.events.length; i++) {
      if (e.events[i].type === "move-down" && head.yspeed != -1) {
        head.rotation = SnakeBodyDirection.DOWN;
        head.yspeed = 1;
        head.xspeed = 0;
      } else if (e.events[i].type === "move-up" && head.yspeed != 1) {
        head.rotation = SnakeBodyDirection.UP;
        head.yspeed = -1;
        head.xspeed = 0;
      } else if (e.events[i].type === "move-left" && head.xspeed != 1) {
        head.rotation = SnakeBodyDirection.LEFT;
        head.yspeed = 0;
        head.xspeed = -1;
      } else if (e.events[i].type === "move-right" && head.xspeed != -1) {
        head.rotation = SnakeBodyDirection.RIGHT;
        head.yspeed = 0;
        head.xspeed = 1;
      }
    }
  }

  head.nextMove -= 1;

  if (head.nextMove === 0) {
    head.nextMove = head.updateFrequency;
    // console.log(head);
    if (
      head.position[0] + head.xspeed < 0 ||
      head.position[0] + head.xspeed >= GameConstants.GRID_SIZE ||
      head.position[1] + head.yspeed < 0 ||
      head.position[1] + head.yspeed >= GameConstants.GRID_SIZE
    ) {
      // snake hits the wall
      e.dispatch({ type: "game-over" });
    } else {
      // move the tail
      let newTail = [[head.position[0], head.position[1]]];
      tail.elements = newTail.concat(tail.elements).slice(0, -1);
      // update rotation in tail elements
      for (let i = 0; i < tail.elements.length; i++) {
        if (i === 0) tail.elements[i].push(head.rotation);
        else tail.elements[i].push(tail.elements[i - 1][2]);
      }

      // snake moves
      head.position[0] += head.xspeed;
      head.position[1] += head.yspeed;

      // check if it hits the tail
      for (let i = 0; i < tail.elements.length; i++) {
        if (tail.elements[i][0] === head.position[0] && tail.elements[i][1] === head.position[1]) {
          e.dispatch({ type: "game-over" });
        }
      }

      if (head.position[0] === food.position[0] && head.position[1] === food.position[1]) {
        // eating Food
        tail.elements = [[food.position[0], food.position[1]]].concat(tail.elements);

        food.position[0] = randomBetween(0, GameConstants.GRID_SIZE - 1);
        food.position[1] = randomBetween(0, GameConstants.GRID_SIZE - 1);
      }
    }
  }

  return entities;
};

export { GameLoop };
