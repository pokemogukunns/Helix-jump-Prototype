// ゲーム設定
// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 4,
    radius: 20,  // ボールのサイズ
    color: 'blue',
    dx: 0,
    dy: 5,
    gravity: 0.5,
    bounce: 0.7,
    isInvincible: false
};

let groundPieces = [];
const groundRadius = Math.min(canvas.width, canvas.height) / 3;  // 地面のサイズをcanvasに合わせる
let groundRotation = 0;
const groundSpeed = 0.03;
const pieceCount = 12;
const pieceWidth = (2 * Math.PI * groundRadius) / pieceCount;
const pieceHeight = 30;
const redPieceIndices = [2, 5, 8];  // 赤い部分のインデックス

for (let i = 0; i < pieceCount; i++) {
    groundPieces.push({
        angle: (i * 2 * Math.PI) / pieceCount,
        color: redPieceIndices.includes(i) ? 'red' : 'green'
    });
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawGround() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);  // 地面を中央に描く
    ctx.rotate(groundRotation);  // 地面を回転させる
    groundPieces.forEach(piece => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, groundRadius, piece.angle, piece.angle + (2 * Math.PI) / pieceCount);
        ctx.lineTo(0, 0);
        ctx.fillStyle = piece.color;
        ctx.fill();
        ctx.closePath();
    });
    ctx.restore();
}

function update() {
    // ボールの重力計算と跳ね返り処理
    ball.dy += ball.gravity;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height - groundRadius) {
        ball.dy = -ball.dy * ball.bounce;
        ball.y = canvas.height - groundRadius - ball.radius;
    }

    // 地面の回転
    groundRotation += groundSpeed;

    // ゲームオーバー判定（赤い地面に触れたとき）
    const ballAngle = (Math.atan2(ball.y - canvas.height / 2, ball.x - canvas.width / 2) + Math.PI * 2) % (Math.PI * 2);
    const currentGroundPiece = groundPieces.find(piece => ballAngle >= piece.angle && ballAngle < piece.angle + (2 * Math.PI) / pieceCount);

    if (currentGroundPiece && currentGroundPiece.color === 'red' && !ball.isInvincible) {
        cancelAnimationFrame(animationId);
        setTimeout(() => {
            alert('ゲームオーバー！');
            resetGame();
        }, 10);
    }
}

function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 4;
    ball.dy = 5;
    groundRotation = 0;
    ball.isInvincible = false;
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawGround();
    update();
    animationId = requestAnimationFrame(animate);
}

let animationId;
resetGame();

// 画面リサイズ対応
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resetGame();
});
