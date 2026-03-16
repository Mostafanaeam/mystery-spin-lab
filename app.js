document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTS ---
  const wheel = document.getElementById("wheel");
  const spinBtn = document.getElementById("spinBtn");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalTag = document.getElementById("modal-tag");
  const modalText = document.getElementById("modal-text");
  const modalActionBtn = document.getElementById("modal-action-btn");
  const btnRules = document.getElementById("btn-rules");
  const btnTheme = document.getElementById("btn-theme");
  const cursorGlow = document.getElementById("cursor-glow");

  // Timer Elements
  const timerContainer = document.getElementById("timer-container");
  const timerFill = document.getElementById("timer-fill");
  const timerText = document.getElementById("timer-text");

  // --- STATE ---
  let gameData = null;
  let isSpinning = false;
  let currentRotation = 0;
  let audioContext = null;
  let themeIndex = 0;
  const themes = ["theme-matrix", "theme-ocean", "theme-cyber"];

  // Categories Mapping (Order on wheel: Say, Do, Explore, Try, Challenge)
  // 0: Say (Red), 1: Do (Green), 2: Explore (Blue), 3: Try (Orange), 4: Challenge (Purple)
  const categoryKeys = ["قول", "اعمل", "استكشف", "حاول", "تحدى"];

  // --- 1. SETUP & AUDIO ---

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Generate beep sound
  function playSound(type) {
    if (!audioContext) initAudio();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === "tick") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "win") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "event") {
      osc.type = "square";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  // --- 2. DATA LOADING ---
  async function loadData() {
    try {
      const res = await fetch("data.json");
      gameData = await res.json();
    } catch (e) {
      console.error("JSON Error", e);
      modalTitle.textContent = "خطأ";
      modalText.textContent = "يرجى تشغيل المشروع عبر خادم محلي (Localhost).";
      modal.classList.add("active");
    }
  }

  // --- 3. WHEEL LOGIC ---

  function spinWheel() {
    if (isSpinning || !gameData) return;

    // Init audio on first interaction
    initAudio();
    if (audioContext.state === "suspended") audioContext.resume();

    isSpinning = true;
    spinBtn.disabled = true;

    // Math for rotation
    const randomDegree = Math.floor(Math.random() * 360);
    const extraSpins = 360 * 6; // 6 full spins
    const totalDegree = currentRotation + extraSpins + randomDegree;

    // Apply visual rotation with transition
    wheel.style.transition = "transform 4s cubic-bezier(0.15, 0.85, 0.35, 1)";
    wheel.style.transform = `rotate(${totalDegree}deg)`;

    // Sound Simulation (Ticks)
    let count = 0;
    const totalTicks = 30; // Approximation
    const interval = setInterval(() => {
      count++;
      if (count > totalTicks) clearInterval(interval);
      // Play tick sound less frequently as it slows down
      if (Math.random() > count / totalTicks) playSound("tick");

      // Vibration (Haptic)
      if (navigator.vibrate) navigator.vibrate(10);
    }, 100);

    setTimeout(() => {
      isSpinning = false;
      spinBtn.disabled = false;
      currentRotation = totalDegree;
      playSound("win");
      handleResult(totalDegree);
    }, 4000);
  }

  // --- 4. RESULT HANDLING ---

  function handleResult(deg) {
    // Calculate Index
    const normalized = deg % 360;
    const pointerDeg = (360 - normalized) % 360;
    const segmentSize = 360 / 5;
    const index = Math.floor(pointerDeg / segmentSize);
    const categoryName = categoryKeys[index];
    const categoryItems = gameData.categories[categoryName];

    // 1. Check Event Card (20% Chance)
    if (Math.random() < 0.2) {
      const eventCard =
        gameData.eventCards[
          Math.floor(Math.random() * gameData.eventCards.length)
        ];
      showEventModal(eventCard, () => {
        // After Event, show Main Prompt
        showMainPrompt(categoryName, categoryItems);
      });
    } else {
      // No Event, direct Prompt
      showMainPrompt(categoryName, categoryItems);
    }
  }

  function showEventModal(card, callback) {
    playSound("event");
    modalTitle.textContent = "🎭 بطاقة حدث!";
    modalTitle.style.color = "#ffeb3b";
    modalTag.textContent = card.name;
    modalTag.style.display = "inline-block";
    modalText.textContent = card.description;
    timerContainer.classList.add("hidden");

    modal.classList.add("active");

    modalActionBtn.onclick = () => {
      modal.classList.remove("active");
      setTimeout(callback, 300); // Wait for close anim
    };
  }

  function showMainPrompt(catName, items) {
    const item = items[Math.floor(Math.random() * items.length)];

    modalTitle.textContent = catName;
    modalTitle.style.color = "var(--primary)";

    modalTag.textContent = item.topic.replace("_", " ");
    modalTag.style.display = "inline-block";

    modalText.textContent = item.prompt;

    // Timer Logic for 'Do' and 'Challenge'
    if (catName === "اعمل" || catName === "تحدى") {
      startTimer(20);
    } else {
      timerContainer.classList.add("hidden");
    }

    modalActionBtn.textContent = "استمرار / تدوير";
    modalActionBtn.onclick = () => {
      modal.classList.remove("active");
    };

    modal.classList.add("active");
  }

  // --- 5. TIMER SYSTEM ---
  function startTimer(seconds) {
    timerContainer.classList.remove("hidden");
    timerFill.style.width = "100%";
    timerText.textContent = `${seconds}s`;

    let timeLeft = seconds;

    // Clear existing interval if any (not implemented globally for simplicity, but safe here)
    const interval = setInterval(() => {
      timeLeft--;
      timerText.textContent = `${timeLeft}s`;
      timerFill.style.width = `${(timeLeft / seconds) * 100}%`;

      if (timeLeft <= 0) {
        clearInterval(interval);
        timerText.textContent = "انتهى الوقت!";
        modalActionBtn.textContent = "تم التنفيذ؟";
        playSound("event"); // Alarm sound
      }
    }, 1000);

    // Clear timer on close
    const oldOnclick = modalActionBtn.onclick;
    modalActionBtn.onclick = () => {
      clearInterval(interval);
      modal.classList.remove("active");
    };
  }

  // --- 6. THEMES & UI ---

  // Theme Switcher
  btnTheme.addEventListener("click", () => {
    document.body.classList.remove(themes[themeIndex]);
    themeIndex = (themeIndex + 1) % themes.length;
    document.body.classList.add(themes[themeIndex]);
    playSound("tick");
  });

  // Rules Modal
  btnRules.addEventListener("click", () => {
    modalTitle.textContent = "قواعد اللعبة";
    modalTag.style.display = "none";
    modalText.innerHTML = `
            1. اضغط SPIN لتدوير العجلة.<br>
            2. نفذ المهمة التي تظهر لك.<br>
            3. فئة "اعمل" و "تحدى" لها وقت محدد (20 ثانية).<br>
            4. بطاقات الأحداث تظهر عشوائياً (20%).<br>
            5. استمتع وطور نفسك!
        `;
    timerContainer.classList.add("hidden");
    modalActionBtn.textContent = "فهمت";
    modalActionBtn.onclick = () => modal.classList.remove("active");
    modal.classList.add("active");
  });

  // Mouse Glow Effect
  document.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";
  });

  // Spin Trigger
  spinBtn.addEventListener("click", spinWheel);

  // Init
  loadData();
});
