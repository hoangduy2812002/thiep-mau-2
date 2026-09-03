// Khởi động khi load: tên khách mời + hiệu ứng trái tim
document.addEventListener('DOMContentLoaded', () => {
  getName();
  initFallingHearts();
  loadMessages();
});


// ── SỔ LƯU BÚT ─────────────────────────────────────

async function loadMessages() {
  const listElement = document.getElementById("gbList");
  if (!listElement) return;

  listElement.innerHTML = '<p class="gb-loading">⏳ Đang tải lời chúc...</p>';

  const response = await fetch("/api/data");
  try {
    const data = await response.json();

    if (data.length === 0) {
      listElement.innerHTML = `
                <div class="empty">
                Hãy là người đầu tiên gửi lời chúc! 💌
                </div>
            `;

      return;
    }
    console.log('-->',data)
    listElement.innerHTML = "";
   // ------------------------------
    // Hiển thị từng lời chúc
    // ------------------------------
    data.forEach(item => {
      const element = document.createElement("div");
      element.className = "loi-chuc border rounded-xl p-4 transition-all duration-300 shadow-sm bg-[#fdfbf6]/80";

      const baseline = document.createElement("div");
      baseline.className= "flex items-baseline justify-between mb-1.5 gap-2";

      const truncateH4 = document.createElement("h4");
      truncateH4.className = "font-serif text-base sm:text-lg font-bold truncate";
      baseline.appendChild(truncateH4);

      const whitespace = document.createElement("p");
      whitespace.className = "text-xs sm:text-sm font-serif leading-relaxed whitespace-pre-wrap opacity-90";

      element.appendChild(baseline);
      element.appendChild(whitespace);


    });


    // result?.data?.forEach(e => list.appendChild(buildEntry(e)));

    // const btn = gbForm.querySelector(".gb-btn");

    // if (result?.data?.length > CONFIG.limit_loiChuc) {
    //   btn.disabled = true;
    // }

  } catch (error) {
    listElement.innerHTML =
      '<p class="gb-empty">⚠️ Không thể tải lời chúc. Vui lòng thử lại sau.</p>';
  }
}

// ========================================
// LƯU
// ========================================

async function saveEntry(name, message) {
  try {

    // =================================
    // THÊM
    // =================================
    const response = await fetch("/api/data", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name: name,

        message: message
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Không thể thêm");
    } else {
      await loadMessages();
    }


  } catch (error) {
    console.error("SAVE ERROR:", error);

    showStatus("Lỗi: " + error.message);
  } finally {
  }
}

// Gắn sự kiện form
const gbForm = document.getElementById("gbForm");
if (gbForm) {
  gbForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("gbName").value.trim();
    const message = document.getElementById("gbMessage").value.trim();
    console.log(name)
    console.log(message)
    if (!name || !message) return;
    if (name.length > 100 || message.length > 500) {
      alert("Tên tối đa 100 ký tự, lời chúc tối đa 500 ký tự.");
      return;
    }
    const btn = gbForm.querySelector(".gb-btn");
    btn.disabled = true;
    btn.textContent = "⏳ Đang gửi...";

    // saveEntry(name, message)
    //   .then(() => {
    //     gbForm.reset();
    //     document.getElementById("gbName").focus();
    //   })
    //   .catch(() => alert("Không thể gửi lời chúc. Vui lòng thử lại!"))
    //   .finally(() => {
    //     btn.disabled = false;
    //     btn.textContent = "🪄 GỬi LỜI CHÚC";
    //   });
  });
}


function getName() {
  document.querySelectorAll(".chu-re").forEach(el => {
    el.textContent = CONFIG.chuRe;
  });

  document.querySelectorAll(".co-dau").forEach(el => {
    el.textContent = CONFIG.coDau;
  });
  document.querySelectorAll(".ngay-cuoi").forEach(el => {
    el.textContent = CONFIG.ngayCuoi;
  });

  document.querySelectorAll(".ba-chu-re").forEach(el => {
    el.textContent = CONFIG.baChuRe;
  });

  document.querySelectorAll(".me-chu-re").forEach(el => {
    el.textContent = CONFIG.meChuRe;
  });

  document.querySelectorAll(".ba-co-dau").forEach(el => {
    el.textContent = CONFIG.baCoDau;
  });

  document.querySelectorAll(".me-co-dau").forEach(el => {
    el.textContent = CONFIG.meCodau;
  });

  document.querySelectorAll(".dia-chi-phuong-chu-re").forEach(el => {
    el.textContent = CONFIG.diaChiPhuongChuRe;
  });

  // document.querySelectorAll(".dia-chi-tp-chu-re").forEach(el => {
  //   el.textContent = CONFIG.diaChiTPChuRe;
  // });

  document.querySelectorAll(".dia-chi-phuong-co-dau").forEach(el => {
    el.textContent = CONFIG.diaChiPhuongCoDau;
  });

  // document.querySelectorAll(".dia-chi-tp-co-dau").forEach(el => {
  //   el.textContent = CONFIG.diaChiTPCoDau;
  // });

  document.querySelectorAll(".danh-xung-chu-re").forEach(el => {
    el.textContent = CONFIG.danhXungChuRe;
  });

  document.querySelectorAll(".danh-xung-co-dau").forEach(el => {
    el.textContent = CONFIG.danhXungCoDau;
  });

  // document.querySelectorAll(".chu-re-full").forEach(el => {
  //   el.textContent = CONFIG.chuReFull;
  // });

  // document.querySelectorAll(".co-dau-full").forEach(el => {
  //   el.textContent = CONFIG.coDauFull;
  // });

  // document.querySelectorAll(".tiec-cuoi-tai").forEach(el => {
  //   el.textContent = CONFIG.tiecCuoiTai;
  // });

  document.querySelectorAll(".ten-nha-hang").forEach(el => {
    el.textContent = CONFIG.tenNhaHang;
  });

  // document.querySelectorAll(".dia-chi-phuong-tiec-cuoi").forEach(el => {
  //   el.textContent = CONFIG.diaChiPhuongTiecCuoi;
  // });

  // document.querySelectorAll(".dia-chi-tp-tiec-cuoi").forEach(el => {
  //   el.textContent = CONFIG.diaChiTpTiecCuoi;
  // });

  document.querySelectorAll(".gio-tiec-cuoi-dien-ra").forEach(el => {
    el.textContent = CONFIG.gioTiecCuoiDienRa;
  });

  document.querySelectorAll(".thu-tiec-cuoi-dien-ra").forEach(el => {
    el.textContent = CONFIG.thuTiecCuoiDienRa;
  });

  document.querySelectorAll(".ngay-tiec-cuoi-dien-ra").forEach(el => {
    el.textContent = CONFIG.ngayTiecCuoiDienRa;
  });

  document.querySelectorAll(".thang-tiec-cuoi-dien-ra").forEach(el => {
    el.textContent = CONFIG.thangTiecCuoiDienRa;
  });

  document.querySelectorAll(".nam-tiec-cuoi-dien-ra").forEach(el => {
    el.textContent = CONFIG.namTiecCuoiDienRa;
  });

  document.querySelectorAll(".nham-ngay-tiec-cuoi-dien-ra").forEach(el => {
    el.textContent = CONFIG.nhamNgayTiecCuoiDienRa;
  });

  // // co ben dao hay khong
  //
}


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
const HEART_CHARS = ['♥', '♥', '♥', '♡', '❤'];  // tỉ lệ ♥ nhiều hơn
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

  const size = (Math.random() * 26 + 10).toFixed(1);   // 10–36 px
  const leftPct = (Math.random() * 98).toFixed(1);         // 0–98%
  const duration = (Math.random() * 5 + 5).toFixed(2);    // 5–10 s
  const delay = (Math.random() * 1.5).toFixed(2);        // 0–1.5 s
  const swing = ((Math.random() - 0.5) * 60).toFixed(1) + 'px'; // lắc ngang
  const swingEnd = ((Math.random() - 0.5) * 80).toFixed(1) + 'px';
  const rotMid = ((Math.random() - 0.5) * 40).toFixed(1) + 'deg';
  const rotEnd = ((Math.random() - 0.5) * 60).toFixed(1) + 'deg';
  const opacity = (Math.random() * 0.45 + 0.25).toFixed(2);
  const colorTpl = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
  const color = colorTpl.replace('VAL', opacity);

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

// ── HỘP MỪNG CƯỚI ────────────────────────────
function toggleGift() {
  const envelope = document.getElementById("giftEnvelope");
  const content = document.getElementById("giftContent");
  const isHidden =
    content.style.display === "none" || content.style.display === "";

  if (isHidden) {
    envelope.style.display = "none";
    content.style.display = "block";

    // Kiểm tra ảnh QR
    const qrImg = content.querySelector(".qr-img");
    const qrNote = document.getElementById("qrNote");
    if (qrImg && qrNote) {
      if (!qrImg.complete || qrImg.naturalWidth === 0) {
        qrImg.style.display = "none";
        qrNote.style.display = "flex";
      }
    }
  } else {
    content.style.display = "none";
    envelope.style.display = "block";
  }
}



// check F12
let devtoolsOpen = false;

const checkDevTools = () => {
  const threshold = 160;

  const widthDiff = window.outerWidth - window.innerWidth;
  const heightDiff = window.outerHeight - window.innerHeight;

  if (widthDiff > threshold || heightDiff > threshold) {
    window.location = "https://www.youtube.com/"
  }

  document.addEventListener("keydown", function (event) {

    // Chặn F12
    if (event.key === "F12") {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Windows / Linux
    if (
      event.ctrlKey &&
      event.shiftKey &&
      ["I", "J", "C"].includes(event.key.toUpperCase())
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Mac
    if (
      event.metaKey &&
      event.altKey &&
      ["I", "J", "C"].includes(event.key.toUpperCase())
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  // Chặn chuột phải
  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });
};

// setInterval(checkDevTools, 500);
