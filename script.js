// Khởi động khi load: tên khách mời + hiệu ứng trái tim
document.addEventListener('DOMContentLoaded', () => {
    initFallingHearts();
});

// Hieu ung chay lai trang
const items = document.querySelectorAll(".section_item");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.2
  }
);

items.forEach(item => {
  observer.observe(item);
});

function openCard() {
  // Ẩn ảnh bìa
  document.getElementById("cover").style.display = "none";
  // Hiện 4 div còn lại
  document.querySelectorAll(".content").forEach((div, index) => {
    setTimeout(() => {
      div.classList.add("show");
    }, index * 300);
    playMusic(); 
  });
}


// ── TRÁI TIM RƠI ────────────────────────────────
const HEART_CHARS  = ['♥', '♥', '♥', '♡', '❤'];  // tỉ lệ ♥ nhiều hơn
const HEART_COLORS = [
    'rgba(255, 120, 120, VAL)',   // hồng đỏ
    'rgba(255, 160, 160, VAL)',   // hồng nhạt
    'rgba(220,  80,  80, VAL)',   // đỏ
    'rgba(201, 162,  39, VAL)',   // vàng
    'rgba(240, 200,  80, VAL)',   // vàng nhạt
];

let heartInterval = null;

function initFallingHearts() {
    const container = document.getElementById('coverHearts');
    if (!container) return;

    // Tạo loạt đầu tiên ngay lập tức
    for (let i = 0; i < 18; i++) {
        setTimeout(() => spawnHeart(container), i * 200);
    }

    // Tiếp tục sinh trái tim đều đặn
    heartInterval = setInterval(() => spawnHeart(container), 450);
}

function spawnHeart(container) {
    const el = document.createElement('span');
    el.className = 'falling-heart';
    el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];

    const size      = (Math.random() * 26 + 10).toFixed(1);   // 10–36 px
    const leftPct   = (Math.random() * 98).toFixed(1);         // 0–98%
    const duration  = (Math.random() * 5  + 5).toFixed(2);    // 5–10 s
    const delay     = (Math.random() * 1.5).toFixed(2);        // 0–1.5 s
    const swing     = ((Math.random() - 0.5) * 60).toFixed(1) + 'px'; // lắc ngang
    const swingEnd  = ((Math.random() - 0.5) * 80).toFixed(1) + 'px';
    const rotMid    = ((Math.random() - 0.5) * 40).toFixed(1) + 'deg';
    const rotEnd    = ((Math.random() - 0.5) * 60).toFixed(1) + 'deg';
    const opacity   = (Math.random() * 0.45 + 0.25).toFixed(2);
    const colorTpl  = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    const color     = colorTpl.replace('VAL', opacity);

    el.style.cssText = [
        `left: ${leftPct}%`,
        `font-size: ${size}px`,
        `color: ${color}`,
        `animation-duration: ${duration}s`,
        `animation-delay: ${delay}s`,
        `--swing: ${swing}`,
        `--swing-end: ${swingEnd}`,
        `--rot-mid: ${rotMid}`,
        `--rot-end: ${rotEnd}`,
    ].join(';');

    container.appendChild(el);

    // Xoá khỏi DOM sau khi animation kết thúc
    const totalMs = (parseFloat(duration) + parseFloat(delay)) * 1000 + 200;
    setTimeout(() => el.remove(), totalMs);
}

// Dừng tạo trái tim khi đóng bìa
function stopFallingHearts() {
    if (heartInterval) { clearInterval(heartInterval); heartInterval = null; }
}


// ── NHẠC NỀN ─────────────────────────────────
function playMusic() {
    const audio = document.getElementById("bgMusic");
    const btn = document.getElementById("musicBtn");
    if (!audio) return;
    audio
      .play()
      .then(() => {
        if (btn) {
          btn.classList.add("playing");
          btn.title = "Tắt nhạc";
        }
      })
      .catch(() => { }); // Trình duyệt có thể chặn – người dùng bấm nút để bật
  }
  

function toggleMusic() {
    const audio = document.getElementById("bgMusic");
    const btn = document.getElementById("musicBtn");
    if (!audio) return;
  
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          btn.textContent = "🎵";
          btn.title = "Tắt nhạc";
          btn.classList.add("playing");
          btn.classList.remove("muted");
        })
        .catch(() => { });
    } else {
      audio.pause();
      btn.textContent = "🔇";
      btn.title = "Bật nhạc";
      btn.classList.remove("playing");
      btn.classList.add("muted");
    }
  }