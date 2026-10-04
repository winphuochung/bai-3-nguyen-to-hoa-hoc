/**
 * APPLICATION CONTROLLER - BÀI 3: NGUYÊN TỐ HÓA HỌC
 */

// Cấu hình kết nối Google Apps Script LMS mặc định của Thầy Thắng (Phiên bản 1 dòng chuẩn hóa)
const DEFAULT_GAS_URL = "https://script.google.com/macros/s/AKfycby5fJGZQCsL1U1kOxl3oPEuRHdHejM28d-TKiBorjIzZV5YyGisZzDQ9zQRMJjCOka2/exec";
localStorage.setItem("chemistry_gas_url", DEFAULT_GAS_URL);
let GAS_API_URL = DEFAULT_GAS_URL;

// Trạng thái ứng dụng
const AppState = {
  isLoggedIn: false,
  role: "student", // 'student' | 'teacher'
  studentName: "",
  currentTab: "home",
  
  // Trắc nghiệm
  quiz: {
    currentIndex: 0,
    answers: {},
    isSubmitted: false,
    score: 0
  },

  // Game Triệu Phú
  millionaire: {
    currentLevel: 0,
    isOver: false,
    used5050: false,
    usedAudience: false,
    totalPrize: "0 đ"
  },

  // Giáo viên lưu dữ liệu offline / mock
  teacherRecords: JSON.parse(localStorage.getItem("chemistry_records") || "[]")
};

// ===================== KHỞI TẠO HỆ THỐNG & PHIÊN ĐĂNG NHẬP =====================
document.addEventListener("DOMContentLoaded", () => {
  checkExistingSession();
  setupNavigation();
  renderElementsGrid(ELEMENTS_DATA);
  renderBodyComposition();
  initQuiz();
  renderTeacherDashboard();

  // Sự kiện tìm kiếm & lọc nguyên tố
  const searchInput = document.getElementById("elemSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterElements(e.target.value);
    });
  }

  // Tải cấu hình Webhook URL
  const gasInput = document.getElementById("gasUrlInput");
  if (gasInput && GAS_API_URL) {
    gasInput.value = GAS_API_URL;
  }
});

// ===================== ĐIỀU HƯỚNG VÀ CHUYỂN TAB =====================
function setupNavigation() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tabId) {
  AppState.currentTab = tabId;
  document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));

  const targetSec = document.getElementById(`section-${tabId}`);
  const targetBtn = document.querySelectorAll(`.nav-btn[data-tab="${tabId}"]`);
  if (targetSec) targetSec.classList.add("active");
  targetBtn.forEach(b => b.classList.add("active"));

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Bật/tắt thanh menu di động
function toggleMobileNav() {
  const navLinks = document.getElementById("mainNavLinks");
  if (navLinks) {
    navLinks.classList.toggle("mobile-open");
  }
}

function handleNavClick(tabId) {
  switchTab(tabId);
  const navLinks = document.getElementById("mainNavLinks");
  if (navLinks && navLinks.classList.contains("mobile-open")) {
    navLinks.classList.remove("mobile-open");
  }
}

// Kiểm tra phiên đăng nhập đã lưu trong sessionStorage
function checkExistingSession() {
  const savedSession = sessionStorage.getItem("chem7_session");
  if (savedSession) {
    try {
      const sess = JSON.parse(savedSession);
      applyLoginSession(sess.role, sess.name);
      return;
    } catch (e) {
      sessionStorage.removeItem("chem7_session");
    }
  }

  // Chưa đăng nhập -> Hiện cổng đăng nhập riêng, ẩn nội dung bên trong
  document.getElementById("loginPortalScreen").style.display = "flex";
  document.getElementById("mainAppWrapper").style.display = "none";
}

// Chuyển đổi tab chọn Học sinh / Giáo viên trong Portal
function selectLoginRole(role) {
  const btnStudent = document.getElementById("tabSelectStudent");
  const btnTeacher = document.getElementById("tabSelectTeacher");
  const formStudent = document.getElementById("studentLoginForm");
  const formTeacher = document.getElementById("teacherLoginForm");
  const errorBox = document.getElementById("teacherLoginError");

  if (errorBox) errorBox.style.display = "none";

  if (role === "student") {
    btnStudent.classList.add("active");
    btnTeacher.classList.remove("active");
    formStudent.style.display = "block";
    formTeacher.style.display = "none";
  } else {
    btnTeacher.classList.add("active");
    btnStudent.classList.remove("active");
    formTeacher.style.display = "block";
    formStudent.style.display = "none";
    document.getElementById("teacherPasswordInput").focus();
  }
}

// Ẩn / Hiện mật khẩu bảo mật (Không hiển thị text ra ngoài mặc định)
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

// Xử lý nộp form Học sinh
function handleStudentSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById("studentNameInput");
  const name = nameInput.value.trim();
  if (!name) return;

  applyLoginSession("student", name);
}

// Xử lý nộp form Giáo viên (Admin)
function handleTeacherSubmit(e) {
  e.preventDefault();
  const user = document.getElementById("teacherUsername").value.trim();
  const pass = document.getElementById("teacherPasswordInput").value;
  const errorBox = document.getElementById("teacherLoginError");

  // Kiểm tra tài khoản & mật khẩu bảo mật (Mật khẩu không bao giờ in ra ngoài)
  if (pass === "123456") {
    if (errorBox) errorBox.style.display = "none";
    applyLoginSession("teacher", "Thầy/Cô Giáo (Admin)");
  } else {
    if (errorBox) {
      errorBox.style.display = "block";
      errorBox.innerText = "Mật khẩu quản trị viên không chính xác!";
    }
  }
}

// Kích hoạt phiên đăng nhập thành công
function applyLoginSession(role, name) {
  AppState.isLoggedIn = true;
  AppState.role = role;
  AppState.studentName = name;

  sessionStorage.setItem("chem7_session", JSON.stringify({ role, name }));

  // Ẩn portal đăng nhập, hiện ứng dụng
  document.getElementById("loginPortalScreen").style.display = "none";
  document.getElementById("mainAppWrapper").style.display = "flex";

  // Phân quyền giao diện:
  const teacherTabItem = document.getElementById("navTabTeacherItem");
  const badge = document.getElementById("userDisplayBadge");

  if (role === "teacher") {
    // Giáo viên (Admin)
    if (teacherTabItem) teacherTabItem.style.display = "inline-block";
    if (badge) badge.innerHTML = `👨‍🏫 <strong>${name}</strong>`;
    switchTab("teacher"); // Vào thẳng trang Quản trị Admin
  } else {
    // Học sinh
    if (teacherTabItem) teacherTabItem.style.display = "none";
    if (badge) badge.innerHTML = `👤 <strong>${name}</strong>`;
    switchTab("home");
  }
}

// Đăng xuất khỏi ứng dụng
function logoutApp() {
  if (confirm("Bạn có muốn đăng xuất khỏi ứng dụng?")) {
    sessionStorage.removeItem("chem7_session");
    AppState.isLoggedIn = false;
    AppState.role = "student";
    AppState.studentName = "";

    // Reset các input mật khẩu
    const passInput = document.getElementById("teacherPasswordInput");
    if (passInput) passInput.value = "";

    document.getElementById("mainAppWrapper").style.display = "none";
    document.getElementById("loginPortalScreen").style.display = "flex";
    selectLoginRole("student");
  }
}

// ===================== BẢNG 3.1 NGUYÊN TỐ HÓA HỌC =====================
function renderElementsGrid(data) {
  const grid = document.getElementById("elementsGridContainer");
  if (!grid) return;

  grid.innerHTML = data.map(el => {
    let badgeClass = "badge-metal";
    if (el.type === "Phi kim") badgeClass = "badge-nonmetal";
    if (el.type === "Á kim") badgeClass = "badge-metalloid";
    if (el.type === "Khí hiếm") badgeClass = "badge-gas";

    return `
      <div class="elem-card" onclick="openElementDetail(${el.z})">
        <span class="elem-z">Z = ${el.z}</span>
        <span class="elem-type-badge ${badgeClass}">${el.type}</span>
        <div class="elem-symbol">${el.symbol}</div>
        <div class="elem-name">${el.name}</div>
        <div class="elem-mass">M: ${el.mass} amu</div>
      </div>
    `;
  }).join("");
}

function filterElements(keyword) {
  const kw = keyword.toLowerCase().trim();
  const filtered = ELEMENTS_DATA.filter(el => 
    el.name.toLowerCase().includes(kw) ||
    el.symbol.toLowerCase().includes(kw) ||
    el.z.toString() === kw ||
    el.type.toLowerCase().includes(kw)
  );
  renderElementsGrid(filtered);
}

function filterByType(type) {
  document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");

  if (type === "all") {
    renderElementsGrid(ELEMENTS_DATA);
  } else {
    const filtered = ELEMENTS_DATA.filter(el => el.type === type);
    renderElementsGrid(filtered);
  }
}

function openElementDetail(z) {
  const el = ELEMENTS_DATA.find(e => e.z === z);
  if (!el) return;

  const detailBox = document.getElementById("elementDetailBody");
  detailBox.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <div style="font-size: 3.5rem; font-weight: 800; color: #0284c7; line-height: 1;">${el.symbol}</div>
      <h2 style="margin: 8px 0 4px;">${el.name}</h2>
      <p style="color: #64748b; font-style: italic;">Tên Latin: ${el.latin}</p>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 1.5rem;">
      <div style="background: #f8fafc; padding: 10px; border-radius: 8px;">
        <span style="font-size: 0.8rem; color: #64748b;">Số hiệu (Z / số proton):</span>
        <div style="font-size: 1.2rem; font-weight: bold; color: #0f172a;">${el.z}</div>
      </div>
      <div style="background: #f8fafc; padding: 10px; border-radius: 8px;">
        <span style="font-size: 0.8rem; color: #64748b;">Khối lượng nguyên tử:</span>
        <div style="font-size: 1.2rem; font-weight: bold; color: #0f172a;">${el.mass} amu</div>
      </div>
      <div style="background: #f8fafc; padding: 10px; border-radius: 8px;">
        <span style="font-size: 0.8rem; color: #64748b;">Phân loại:</span>
        <div style="font-size: 1rem; font-weight: 600; color: #0f172a;">${el.type}</div>
      </div>
      <div style="background: #f8fafc; padding: 10px; border-radius: 8px;">
        <span style="font-size: 0.8rem; color: #64748b;">Trạng thái đơn chất:</span>
        <div style="font-size: 1rem; font-weight: 600; color: #0f172a;">${el.state}</div>
      </div>
    </div>
    <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 12px; border-radius: 6px;">
      <strong>Ứng dụng & Vai trò:</strong>
      <p style="margin-top: 4px; font-size: 0.95rem; color: #166534;">${el.note}</p>
    </div>
  `;
  document.getElementById("elementDetailModal").classList.add("active");
}

function closeElementModal() {
  document.getElementById("elementDetailModal").classList.remove("active");
}

// ===================== HÌNH 3.2: CƠ THỂ NGƯỜI =====================
function renderBodyComposition() {
  const container = document.getElementById("bodyCompList");
  if (!container) return;

  container.innerHTML = BODY_COMPOSITION_DATA.map(item => `
    <div class="comp-item" style="border-left-color: ${item.color};">
      <div class="comp-circle" style="background-color: ${item.color};">${item.symbol}</div>
      <div class="comp-info">
        <div class="comp-name">${item.element}</div>
        <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">${item.role}</div>
      </div>
      <div class="comp-percent">${item.percent}%</div>
    </div>
  `).join("");
}

// ===================== MODULE LUYỆN TẬP TRẮC NGHIỆM =====================
function initQuiz() {
  renderQuestion(0);
}

function renderQuestion(index) {
  AppState.quiz.currentIndex = index;
  const q = QUIZ_QUESTIONS[index];
  const qTitle = document.getElementById("quizQuestionTitle");
  const optList = document.getElementById("quizOptionsList");
  const progressText = document.getElementById("quizProgress");
  const explanationBox = document.getElementById("quizExplanation");

  if (!qTitle || !optList) return;

  progressText.innerText = `Câu ${index + 1} / ${QUIZ_QUESTIONS.length}`;
  qTitle.innerText = `${index + 1}. ${q.question}`;

  explanationBox.style.display = "none";

  const savedAnswer = AppState.quiz.answers[q.id];

  optList.innerHTML = q.options.map((opt, i) => {
    let classes = "opt-btn";
    if (savedAnswer !== undefined) {
      if (i === q.correctIndex) classes += " correct";
      else if (i === savedAnswer) classes += " wrong";
    }

    return `
      <button class="${classes}" onclick="handleSelectOption(${q.id}, ${i})" ${savedAnswer !== undefined ? "disabled" : ""}>
        <span style="font-weight: 700; width: 24px;">${String.fromCharCode(65 + i)}.</span>
        <span>${opt}</span>
      </button>
    `;
  }).join("");

  // Nút Previous / Next
  document.getElementById("btnQuizPrev").disabled = index === 0;
  document.getElementById("btnQuizNext").style.display = index === QUIZ_QUESTIONS.length - 1 ? "none" : "inline-block";
  document.getElementById("btnQuizSubmit").style.display = index === QUIZ_QUESTIONS.length - 1 ? "inline-block" : "none";

  if (savedAnswer !== undefined) {
    explanationBox.style.display = "block";
    explanationBox.innerHTML = `<strong>💡 Giải thích chi tiết:</strong> ${q.explanation}`;
  }
}

function handleSelectOption(qId, selectedIdx) {
  AppState.quiz.answers[qId] = selectedIdx;
  renderQuestion(AppState.quiz.currentIndex);
}

function prevQuizQuestion() {
  if (AppState.quiz.currentIndex > 0) {
    renderQuestion(AppState.quiz.currentIndex - 1);
  }
}

function nextQuizQuestion() {
  if (AppState.quiz.currentIndex < QUIZ_QUESTIONS.length - 1) {
    renderQuestion(AppState.quiz.currentIndex + 1);
  }
}

function submitQuiz() {
  let correctCount = 0;
  const detailedAnswers = {};

  QUIZ_QUESTIONS.forEach(q => {
    const chosenIdx = AppState.quiz.answers[q.id];
    if (chosenIdx !== undefined) {
      const chosenChar = String.fromCharCode(65 + chosenIdx);
      const isCorrect = chosenIdx === q.correctIndex;
      if (isCorrect) correctCount++;
      detailedAnswers[q.id] = `${chosenChar} (${isCorrect ? "Đúng" : "Sai"})`;
    } else {
      detailedAnswers[q.id] = "Chưa làm";
    }
  });

  const total = QUIZ_QUESTIONS.length;
  const score = ((correctCount / total) * 10).toFixed(1);
  AppState.quiz.score = score;
  AppState.quiz.isSubmitted = true;

  const summary = `🎉 Chúc mừng bạn đã hoàn thành bài trắc nghiệm!\n\nKết quả:\n- Số câu đúng: ${correctCount}/${total}\n- Điểm số: ${score}/10`;
  alert(summary);

  // Ghi nhận dữ liệu theo format chuẩn các cột
  recordStudentResult({
    activityType: "Trắc nghiệm 10 câu",
    score: `${score}/10`,
    correctCount: `${correctCount}/${total}`,
    quizScore: `${score}/10`,
    quizCorrect: `${correctCount}/${total}`,
    quizAnswers: detailedAnswers,
    answers: AppState.quiz.answers
  });
}

// Nộp bài tự luận
function submitEssay() {
  const ans1 = document.getElementById("essayAns1").value;
  const ans2 = document.getElementById("essayAns2").value;
  const ans3 = document.getElementById("essayAns3").value;

  if (!ans1.trim() && !ans2.trim() && !ans3.trim()) {
    alert("Vui lòng nhập câu trả lời cho ít nhất một câu tự luận trước khi gửi!");
    return;
  }

  const essayPayload = {
    activityType: "Bài tự luận 3 câu",
    score: "Chờ chấm",
    correctCount: "3 câu nộp",
    essayAnswers: {
      cau1: ans1 || "(Chưa làm)",
      cau2: ans2 || "(Chưa làm)",
      cau3: ans3 || "(Chưa làm)"
    },
    answers: {
      cau1: ans1,
      cau2: ans2,
      cau3: ans3
    }
  };

  recordStudentResult(essayPayload);
  alert("Bài làm tự luận của bạn đã được gửi thành công đến Giáo viên!");
}

// ===================== GAME: AI LÀ TRIỆU PHÚ =====================
function startMillionaireGame() {
  AppState.millionaire = {
    currentLevel: 0,
    isOver: false,
    used5050: false,
    usedAudience: false,
    totalPrize: "0 đ"
  };

  document.getElementById("btn5050").disabled = false;
  document.getElementById("btnAudience").disabled = false;
  document.getElementById("gamePlayContainer").style.display = "grid";
  document.getElementById("gameStartBanner").style.display = "none";

  renderMillionaireLadder();
  loadMillionaireQuestion();
}

function renderMillionaireLadder() {
  const ladderEl = document.getElementById("gameLadderList");
  if (!ladderEl) return;

  ladderEl.innerHTML = MILLIONAIRE_QUESTIONS.map((q, idx) => {
    let classes = "ladder-step";
    if (q.milestone) classes += " milestone";
    if (idx === AppState.millionaire.currentLevel) classes += " current";

    return `
      <div class="${classes}">
        <span>${idx + 1}.</span>
        <span>${q.money}</span>
      </div>
    `;
  }).join("");
}

function loadMillionaireQuestion() {
  const q = MILLIONAIRE_QUESTIONS[AppState.millionaire.currentLevel];
  if (!q) {
    // Thắng chung cuộc 15 câu!
    endMillionaireGame(true);
    return;
  }

  renderMillionaireLadder();

  document.getElementById("gameQText").innerText = `Câu ${AppState.millionaire.currentLevel + 1}: ${q.question}`;
  
  const optGrid = document.getElementById("gameOptionsGrid");
  optGrid.innerHTML = q.options.map((opt, i) => `
    <button class="game-opt-btn" id="gameOpt${i}" onclick="answerMillionaire(${i})">
      <span style="color: #f59e0b; margin-right: 8px;">${String.fromCharCode(65 + i)}:</span> ${opt}
    </button>
  `).join("");
}

function answerMillionaire(selectedIdx) {
  const q = MILLIONAIRE_QUESTIONS[AppState.millionaire.currentLevel];
  const btn = document.getElementById(`gameOpt${selectedIdx}`);

  // Highlight lựa chọn
  btn.classList.add("selected");
  document.querySelectorAll(".game-opt-btn").forEach(b => b.disabled = true);

  setTimeout(() => {
    if (selectedIdx === q.correctIndex) {
      btn.classList.remove("selected");
      btn.classList.add("correct");
      AppState.millionaire.totalPrize = q.money;

      setTimeout(() => {
        AppState.millionaire.currentLevel++;
        if (AppState.millionaire.currentLevel >= MILLIONAIRE_QUESTIONS.length) {
          endMillionaireGame(true);
        } else {
          loadMillionaireQuestion();
        }
      }, 1000);

    } else {
      btn.classList.remove("selected");
      btn.classList.add("wrong");
      document.getElementById(`gameOpt${q.correctIndex}`).classList.add("correct");

      setTimeout(() => {
        endMillionaireGame(false);
      }, 1200);
    }
  }, 800);
}

function use5050() {
  if (AppState.millionaire.used5050) return;
  AppState.millionaire.used5050 = true;
  document.getElementById("btn5050").disabled = true;

  const q = MILLIONAIRE_QUESTIONS[AppState.millionaire.currentLevel];
  let removed = 0;
  for (let i = 0; i < 4; i++) {
    if (i !== q.correctIndex && removed < 2) {
      const btn = document.getElementById(`gameOpt${i}`);
      if (btn) btn.style.visibility = "hidden";
      removed++;
    }
  }
}

function useAudienceHelp() {
  if (AppState.millionaire.usedAudience) return;
  AppState.millionaire.usedAudience = true;
  document.getElementById("btnAudience").disabled = true;

  const q = MILLIONAIRE_QUESTIONS[AppState.millionaire.currentLevel];
  const correctLetter = String.fromCharCode(65 + q.correctIndex);
  alert(`📊 Ý kiến 100 khán giả trường quay:\n- ${correctLetter}: 78%\n- Các phương án còn lại: 22%\nKhán giả nghiêng về đáp án [${correctLetter}]!`);
}

function endMillionaireGame(isWin) {
  let msg = "";
  if (isWin) {
    msg = `🏆 XUẤT SẮC! BẠN ĐÃ TRỞ THÀNH TRIỆU PHÚ HÓA HỌC!\nPhần thưởng tối cao: 150.000.000 đ!`;
  } else {
    msg = `Rất tiếc! Câu trả lời chưa chính xác.\nBạn dừng bước ở câu ${AppState.millionaire.currentLevel + 1}.\nGiải thưởng mang về: ${AppState.millionaire.totalPrize}`;
  }
  alert(msg);

  recordStudentResult({
    activityType: "Ai là triệu phú Hóa học",
    score: `${AppState.millionaire.currentLevel}/15 câu`,
    correctCount: AppState.millionaire.totalPrize,
    answers: { stoppedAtLevel: AppState.millionaire.currentLevel + 1 }
  });

  document.getElementById("gamePlayContainer").style.display = "none";
  document.getElementById("gameStartBanner").style.display = "block";
}

// ===================== ĐỒNG BỘ DỮ LIỆU GOOGLE SHEETS & REAL-TIME =====================
function recordStudentResult(data) {
  const timestamp = new Date().toLocaleString("vi-VN");
  const record = {
    timestamp: timestamp,
    studentName: AppState.studentName,
    activityType: data.activityType,
    score: data.score,
    correctCount: data.correctCount,
    answers: data.answers
  };

  // 1. Lưu cục bộ (LocalStorage)
  AppState.teacherRecords.unshift(record);
  localStorage.setItem("chemistry_records", JSON.stringify(AppState.teacherRecords));
  renderTeacherDashboard();

  // 2. Gửi Real-time qua Google Apps Script Webhook nếu có cấu hình URL
  if (GAS_API_URL) {
    fetch(GAS_API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    }).then(() => {
      console.log("Đã gửi đồng bộ Google Sheet thành công!");
    }).catch(err => {
      console.error("Lỗi khi kết nối Google Apps Script:", err);
    });
  }
}

function saveGasUrl() {
  const url = document.getElementById("gasUrlInput").value.trim();
  GAS_API_URL = url;
  localStorage.setItem("chemistry_gas_url", url);
  alert("Đã lưu Webhook URL Google Apps Script thành công!");
}

function renderTeacherDashboard() {
  const tbody = document.getElementById("teacherTableBody");
  if (!tbody) return;

  if (AppState.teacherRecords.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 20px;">Chưa có dữ liệu bài làm nào được ghi nhận.</td></tr>`;
    return;
  }

  tbody.innerHTML = AppState.teacherRecords.map((r, i) => {
    const isEssay = r.activityType && r.activityType.includes("tự luận");
    const scoreColor = r.score === "Chờ chấm" ? "#ea580c" : "#0284c7";
    const scoreBadgeBg = r.score === "Chờ chấm" ? "#ffedd5" : "#e0f2fe";

    return `
      <tr>
        <td>${i + 1}</td>
        <td>${r.timestamp}</td>
        <td><strong>${r.studentName}</strong></td>
        <td><span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: 600;">${r.activityType}</span></td>
        <td>
          <span style="font-weight: 700; color: ${scoreColor}; background: ${scoreBadgeBg}; padding: 3px 8px; border-radius: 4px;">
            ${r.score}
          </span>
        </td>
        <td>
          ${isEssay ? `
            <button onclick="openGradingModal(${i})" style="padding: 5px 12px; border: 1.5px solid #0284c7; border-radius: 6px; cursor: pointer; background: #0284c7; color: white; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
              ✏️ Chấm điểm
            </button>
          ` : `
            <button onclick="viewDetailSubmission(${i})" style="padding: 5px 10px; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; background: white; color: #475569;">
              Xem chi tiết
            </button>
          `}
        </td>
      </tr>
    `;
  }).join("");
}

// Biến lưu trữ vị trí bài đang chấm
let currentGradingIndex = -1;

// Mở modal chấm điểm tự luận
function openGradingModal(index) {
  currentGradingIndex = index;
  const record = AppState.teacherRecords[index];
  if (!record) return;

  // Render thông tin học sinh
  const infoEl = document.getElementById("gradingStudentInfo");
  infoEl.innerHTML = `
    <div style="display: flex; justify-content: space-between; flex-wrap: gap: 8px;">
      <div><strong>Học sinh:</strong> <span style="color: #0284c7; font-size: 1.1rem; font-weight: bold;">${record.studentName}</span></div>
      <div><strong>Thời gian nộp:</strong> ${record.timestamp}</div>
    </div>
  `;

  // Render nội dung bài làm của học sinh
  const answers = record.answers || {};
  const contentEl = document.getElementById("gradingEssayContent");

  contentEl.innerHTML = ESSAY_QUESTIONS.map(q => {
    let studentAns = answers[`cau${q.id}`] || answers[`q${q.id}`] || answers[q.id] || "(Chưa có câu trả lời)";

    return `
      <div style="margin-bottom: 16px; background: white; border: 1px solid var(--border); border-radius: 8px; padding: 14px;">
        <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">${q.title}:</div>
        <div style="color: #475569; font-size: 0.9rem; margin-bottom: 8px; font-style: italic;">"${q.prompt}"</div>
        
        <div style="background: #f8fafc; border-left: 3px solid #0284c7; padding: 10px; border-radius: 4px; margin-bottom: 8px;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #0284c7; margin-bottom: 2px;">BÀI LÀM CỦA HỌC SINH:</div>
          <div style="color: #1e293b; font-size: 0.95rem; white-space: pre-wrap;">${studentAns}</div>
        </div>

        <details style="font-size: 0.85rem; color: #166534; background: #f0fdf4; padding: 8px 12px; border-radius: 6px; border: 1px solid #bbf7d0;">
          <summary style="cursor: pointer; font-weight: 600;">Xem đáp án gợi ý & biểu điểm chuẩn</summary>
          <div style="margin-top: 6px;">${q.sampleAnswer}</div>
        </details>
      </div>
    `;
  }).join("");

  // Điền điểm và nhận xét cũ nếu đã chấm trước đó
  const scoreInput = document.getElementById("gradingScoreInput");
  const commentInput = document.getElementById("gradingCommentInput");

  scoreInput.value = record.score !== "Chờ chấm" ? record.score.replace("/10", "") : "";
  commentInput.value = record.teacherComment || "";

  document.getElementById("gradingModal").classList.add("active");
}

function closeGradingModal() {
  document.getElementById("gradingModal").classList.remove("active");
  currentGradingIndex = -1;
}

// Lưu điểm và đồng bộ trực tiếp lên Google Sheet của Thầy Thắng
function saveAndSyncGrading() {
  if (currentGradingIndex < 0) return;
  const record = AppState.teacherRecords[currentGradingIndex];
  if (!record) return;

  const scoreVal = document.getElementById("gradingScoreInput").value.trim();
  const commentVal = document.getElementById("gradingCommentInput").value.trim();

  if (scoreVal === "" || isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
    alert("Vui lòng nhập điểm số hợp lệ từ 0 đến 10!");
    return;
  }

  const btn = document.getElementById("btnSaveGrading");
  btn.disabled = true;
  btn.innerText = "Đang đồng bộ lên Google Sheet...";

  // Cập nhật trạng thái cục bộ
  record.score = `${scoreVal}/10`;
  record.teacherComment = commentVal || "Đã chấm bởi Thầy Thắng";

  localStorage.setItem("chemistry_records", JSON.stringify(AppState.teacherRecords));
  renderTeacherDashboard();

  // Gói payload gửi lên Google Apps Script Webhook
  const payload = {
    studentName: record.studentName,
    activityType: "Chấm điểm Tự luận (Đã phê duyệt)",
    score: record.score,
    correctCount: "Đã chấm điểm",
    essayScore: record.score,
    essayAnswers: record.answers,
    teacherComment: record.teacherComment,
    gradingTimestamp: new Date().toLocaleString("vi-VN")
  };

  if (GAS_API_URL) {
    fetch(GAS_API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => {
      btn.disabled = false;
      btn.innerText = "Lưu & Đồng bộ lên Google Sheet 🚀";
      closeGradingModal();
      alert(`🎉 ĐÃ CHẤM ĐIỂM THÀNH CÔNG!\n\n- Học sinh: ${record.studentName}\n- Điểm số: ${record.score}\n- Lời phê: "${record.teacherComment}"\n\nKết quả đã được cập nhật trực tiếp vào dòng của học sinh trên Google Sheet!`);
    }).catch(err => {
      btn.disabled = false;
      btn.innerText = "Lưu & Đồng bộ lên Google Sheet 🚀";
      closeGradingModal();
      alert("Đã lưu điểm cục bộ thành công! (Vui lòng kiểm tra lại kết nối mạng)");
    });
  } else {
    btn.disabled = false;
    btn.innerText = "Lưu & Đồng bộ lên Google Sheet 🚀";
    closeGradingModal();
    alert("Đã lưu điểm thành công!");
  }
}

function viewDetailSubmission(index) {
  const r = AppState.teacherRecords[index];
  if (!r) return;
  alert(`Chi tiết bài nộp của ${r.studentName} (${r.activityType}):\n\n${JSON.stringify(r.answers, null, 2)}`);
}

function clearAllRecords() {
  if (confirm("Thầy/Cô có chắc chắn muốn xóa toàn bộ lịch sử điểm số trên máy này?")) {
    AppState.teacherRecords = [];
    localStorage.removeItem("chemistry_records");
    renderTeacherDashboard();
  }
}

// Chuyển đổi video bài giảng
function changeVideo(videoId) {
  const player = document.getElementById("mainVideoPlayer");
  if (player) {
    player.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
  }
}

