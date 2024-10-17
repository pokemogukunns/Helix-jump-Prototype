// ゲーム設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 4,
  radius: 20,
  dy: 5, // ボールの速度
  color: "#3498db",
  isInvincible: false, // 無敵状態
  fallCount: 0 // 連続で落ちる回数
};

let platform = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 150,
  height: 20,
  holeWidth: 50,
  redZoneWidth: 30,
  angle: 0
};

let gameOver = false;

// ボールの描画
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.isInvincible ? "gold" : ball.color; // 無敵なら金色
  ctx.fill();
  ctx.closePath();
}

// プラットフォームの描画
function drawPlatform() {
  ctx.save();
  ctx.translate(platform.x, platform.y);
  ctx.rotate(platform.angle);

  // 通常の部分
  ctx.fillStyle = "#2ecc71";
  ctx.fillRect(-platform.width / 2, -platform.height / 2, platform.width, platform.height);

  // 穴
  ctx.clearRect(-platform.holeWidth / 2, -platform.height / 2, platform.holeWidth, platform.height);

  // 赤い部分
  ctx.fillStyle = "red";
  ctx.fillRect(-platform.redZoneWidth / 2, -platform.height / 2, platform.redZoneWidth, platform.height);

  ctx.restore();
}

// ゲームの更新処理
function update() {
  // ボールの移動
  ball.y += ball.dy;

  if (ball.y + ball.radius > canvas.height) {
    gameOver = true; // 画面外に落ちたらゲームオーバー
  }

  // ボールが3回連続で地面に触れずに落下
  if (ball.fallCount >= 3) {
    ball.isInvincible = true; // 無敵状態
  }

  // プラットフォームの回転
  platform.angle += 0.02; // ゆっくり回転
}

// ゲームのメインループ
function gameLoop() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPlatform();

    update();

    requestAnimationFrame(gameLoop);
  } else {
    alert("Game Over!");
  }
}

// ゲーム開始
gameLoop();
