// ゲーム設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 4,
  radius: 20,
  dy: 5, // ボールの速度（上下運動）
  gravity: 0.2, // 重力
  jumpPower: -8, // 跳ねる力
  color: "#3498db",
  isInvincible: false, // 無敵状態
  fallCount: 0 // 連続で落ちる回数
};

let platform = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 150,
  height: 20,
  holeWidth: 50,
  redZoneWidth: 30,
  angle: 0
};

let gameOver = false;
let score = 0;

// マウスの位置による回転制御
canvas.addEventListener("mousemove", function (event) {
  const mouseX = event.clientX;
  const centerX = canvas.width / 2;
  const angle = (mouseX - centerX) * 0.01; // マウスの位置に応じて回転角度を調整
  platform.angle = angle;
});

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
  // ボールの上下運動（重力を適用）
  ball.dy += ball.gravity;
  ball.y += ball.dy;

  // ボールが画面外に出たらゲームオーバー
  if (ball.y + ball.radius > canvas.height) {
    gameOver = true; 
  }

  // ボールがプラットフォームに当たったか確認
  if (ball.y + ball.radius >= platform.y - platform.height / 2 &&
      ball.x >= platform.x - platform.width / 2 &&
      ball.x <= platform.x + platform.width / 2) {
    
    // ボールが赤い部分に当たったらゲームオーバー
    if (ball.x >= platform.x - platform.redZoneWidth / 2 &&
        ball.x <= platform.x + platform.redZoneWidth / 2) {
      gameOver = true; // ゲームオーバー
    } else {
      // 緑の部分に当たったら跳ねる
      ball.dy = ball.jumpPower;
      score++; // スコアを加算
      ball.fallCount++;

      // 3回連続で落下したら無敵状態
      if (ball.fallCount >= 3) {
        ball.isInvincible = true;
        ball.fallCount = 0; // カウントをリセット
      }
    }
  }
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
    alert("Game Over! スコア: " + score);
  }
}

// ゲーム開始
gameLoop();
