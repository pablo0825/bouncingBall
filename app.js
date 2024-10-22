const c = document.getElementById("myCanvas");
const CanvasHeight = c.height;
const CanvasWidth = c.width; // 修正拼寫錯誤
const ctx = c.getContext("2d");
//球的參數
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSeed = 20;
let ySeed = 20;
//地板的參數
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
//放磚塊的arr
let brickArray = [];

let count = 0;

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchinBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

for (let i = 0; i < 5; i++) {
  new Brick(getRandomArbitrary(0, 959), getRandomArbitrary(0, 550));
}

document.addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft" || e.key == "a") {
    ground_x -= 20 * 2;
  } else if (e.key == "ArrowRight" || e.key == "d") {
    ground_x += 20 * 2;
  }
});

function drawCircle() {
  //磚塊有沒有打到球
  brickArray.forEach((brick, index) => {
    if (brick.visible && brick.touchinBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      //上下判斷
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySeed *= -1;
      }
      //左右判斷
      else if (circle_x <= brick.x || circle_x >= brick.x + brick.width) {
        xSeed *= -1;
      }

      //brickArray.splice(index, 1);

      if (count == 5) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });

  //確認是否打到地版
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 120 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySeed *= -1;
  }
  // 確認左右邊界是否撞到球
  if (circle_x >= CanvasWidth - radius || circle_x <= radius) {
    xSeed *= -1;
  }

  // 確認上下邊界是否撞到球
  if (circle_y >= CanvasHeight - radius || circle_y <= radius) {
    ySeed *= -1;
  }

  // 更新球的位置
  circle_x += xSeed;
  circle_y += ySeed;

  // 畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);

  //畫出全部方塊
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // 畫出球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();

  //畫出地板
  ctx.fillStyle = "yellow";
  ctx.fillRect(ground_x, ground_y, 120, ground_height);
}

let game = setInterval(drawCircle, 25);
