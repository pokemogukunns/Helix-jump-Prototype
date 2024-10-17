// ゲーム設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 4,
  radius: 20,
  dy: 5,
  gravity: 0.2,
  jumpPower: -8,
  color: "#3498db",
  isInvincible: false,
  fallCount: 0
};

let platforms = [];
const platformSpacing = 150; // 地面の間隔
let score = 0;
let level = 1;
let gameOver = false;
let canRevive = true;

function createPlatform(y) {
  const platform = {
    x: canvas.width / 2,
    y: y,
    width: 150,
    height: 20,
    holeWidth: 50,
    redZoneWidth: 30,
    angle: 0,
    broken: false // 地面が割れたかどうか
  };
  platforms.push(platform);
}

// 最初の地面を作成
for (let i = 0; i < 10; i++) {
  createPlatform(canvas.height - i * platformSpacing);
}

// ボールの描画
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.isInvincible ? "orange" : ball.color;
  ctx.fill();
  ctx.closePath();
}

// プラットフォームの描画
function drawPlatforms() {
  platforms.forEach(platform => {
    if (!platform.broken) {
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
  });
}

// スコアとレベルアップの描画
function drawScoreAndLevel() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 20, 40);
  ctx.fillText(`Level: ${level}`, 20, 70);
}

// 地面が割れて消える
function breakPlatform(platform) {
  platform.broken = true;
  setTimeout(() => {
    platforms = platforms.filter(p => p !== platform); // 割れた地面を削除
  }, 1000); // 1秒後に消える
}

// ゲームの更新処理
function update() {
  ball.dy += ball.gravity;
  ball.y += ball.dy;

  // 地面の生成
  if (platforms[platforms.length - 1].y > canvas.height - platformSpacing) {
    createPlatform(platforms[platforms.length - 1].y - platformSpacing);
  }

  // すべてのプラットフォームをチェック
  platforms.forEach(platform => {
    // ボールが地面を超えたら割れる
    if (!platform.broken && ball.y + ball.radius >= platform.y - platform.height / 2 &&
        ball.x >= platform.x - platform.width / 2 &&
        ball.x <= platform.x + platform.width / 2) {

      // 赤い部分に当たったらゲームオーバー
      if (ball.x >= platform.x - platform.redZoneWidth / 2 &&
          ball.x <= platform.x + platform.redZoneWidth / 2) {
        gameOver = true;
      } else {
        // 緑の部分に当たったら跳ねる
        ball.dy = ball.jumpPower;
        score += 10;
        ball.fallCount++;

        // 地面を超えたら割れる
        breakPlatform(platform);

        // レベルアップ
        if (score % 100 === 0) {
          level++;
        }

        // 無敵状態の処理
        if (ball.fallCount >= 3) {
          ball.isInvincible = true;
          ball.fallCount = 0;
        }
      }
    }
  });

  // ボールが画面外に出たらゲームオーバー
  if (ball.y + ball.radius > canvas.height) {
    gameOver = true;
  }
}

// ゲームのメインループ
function gameLoop() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPlatforms();
    drawScoreAndLevel();

    update();

    requestAnimationFrame(gameLoop);
  } else {
    if (canRevive) {
      alert("広告を見ることで復活できます。");
      canRevive = false;
      revive();
    } else {
      alert(`Game Over! スコア: ${score}`);
    }
  }
}

// 広告後の復活処理
function revive() {
  ball.y = canvas.height / 4;
  ball.dy = 5;
  ball.isInvincible = false;
  ball.fallCount = 0;
  gameOver = false;
  gameLoop();
}

// ゲーム開始
gameLoop();
