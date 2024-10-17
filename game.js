// ゲーム設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let isGameOver = false; // ゲームオーバー状態
let rotationAngle = 0; // 地面の回転角度
let userRotationSpeed = 0; // ユーザーが回転させる速度
const rotationSpeed = 0.05; // 回転の基準速度
let score = 0; // スコア
let level = 0; // レベル

// ドーナツ状の地面設定
let donut = {
  innerRadius: 100,
  outerRadius: 150,
  segments: 12,
  redSegmentIndex: Math.floor(Math.random() * 12),
};

// ボール設定
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  dy: -10, // 初期ジャンプの勢い
  gravity: 0.5,
  jumpPower: -10,
  color: "#3498db",
  isInvincible: false,
  fallCount: 0,
};

// 柱の設定
const pillar = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 20,
  height: canvas.height,
  color: "#333",
};

// ゲームオーバー後のリセットボタン
function createRetryButton() {
  const button = document.createElement("button");
  button.innerText = "もう一度挑戦";
  button.style.position = "absolute";
  button.style.left = "50%";
  button.style.top = "50%";
  button.style.transform = "translate(-50%, -50%)";
  button.style.padding = "20px 40px";
  button.style.fontSize = "20px";
  button.style.backgroundColor = "#3498db";
  button.style.color = "white";
  button.style.border = "none";
  button.style.cursor = "pointer";
  document.body.appendChild(button);

  // クリックでリセット処理
  button.addEventListener("click", () => {
    document.body.removeChild(button); // ボタンを削除
    resetGame(); // ゲームをリセットして再開
  });
}

// ゲームのリセット処理
function resetGame() {
  isGameOver = false;
  score = 0;
  level = 0;
  ball.y = canvas.height / 2;
  ball.dy = -10;
  donut.redSegmentIndex = Math.floor(Math.random() * 12); // ランダムで赤い部分の位置を更新
  requestAnimationFrame(update); // ゲームの再開
}

// 地面の描画
function drawDonut() {
  rotationAngle += userRotationSpeed;

  for (let i = 0; i < donut.segments; i++) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotationAngle + (i * (2 * Math.PI / donut.segments)));

    if (i === donut.redSegmentIndex) {
      ctx.fillStyle = "red"; // 赤い部分
    } else {
      ctx.fillStyle = "green"; // 通常の部分
    }

    ctx.beginPath();
    ctx.arc(0, 0, donut.outerRadius, 0, Math.PI * 2 / donut.segments);
    ctx.arc(0, 0, donut.innerRadius, 0, Math.PI * 2 / donut.segments, true);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

// ボールの描画
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// ゲームオーバーの処理
function checkGameOver() {
  // 赤い地面に触れた場合の判定
  const angleIndex = Math.floor((rotationAngle / (2 * Math.PI)) * donut.segments) % donut.segments;
  if (angleIndex === donut.redSegmentIndex) {
    isGameOver = true;
    createRetryButton(); // ゲームオーバー時にボタンを表示
  }
}

// ゲームループ
function update() {
  if (isGameOver) return; // ゲームオーバー時には更新を停止

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ボールの物理計算
  ball.dy += ball.gravity;
  ball.y += ball.dy;

  if (ball.y + ball.radius > canvas.height) {
    ball.dy = ball.jumpPower; // ボールが落ちたらジャンプ
    score += 10; // スコアを加算
    if (score % 100 === 0) {
      level++; // 10回超えるごとにレベルアップ
    }
  }

  // ドーナツ地面とボールの描画
  drawDonut();
  drawBall();

  // 赤い地面に触れたかどうかをチェック
  checkGameOver();

  requestAnimationFrame(update); // 次のフレームで更新
}

// ユーザーの入力で回転を調整
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    userRotationSpeed = -rotationSpeed;
  } else if (e.key === "ArrowRight") {
    userRotationSpeed = rotationSpeed;
  }
});

// ゲーム開始
update();
