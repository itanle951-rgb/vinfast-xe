// Logic tương tác cho Website VinFast Hà Nội - Số 1 Nguyễn Văn Linh (Mr. Tùng - 0982.068.820)

document.addEventListener("DOMContentLoaded", () => {
  const formatVND = (num) => {
    return new Intl.NumberFormat("vi-VN").format(Math.round(num)) + " ₫";
  };

  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // 2. Hiệu ứng 3D Parallax & Slider 4D cho Hero Showcase
  const heroVisual = document.querySelector(".hero-visual");
  const heroFrame = document.querySelector(".hero-3d-frame");
  if (heroVisual && heroFrame) {
    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroFrame.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    });
    heroVisual.addEventListener("mouseleave", () => {
      heroFrame.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".slider-dot");
  const prevBtn = document.getElementById("slider-prev");
  const nextBtn = document.getElementById("slider-next");
  const sliderTitle = document.getElementById("slider-title");
  const slideTitles = [
    "VinFast VF 8 — SUV Điện Hạng Sang",
    "VinFast VF 9 — Flagship 7 Chỗ Đẳng Cấp",
    "VinFast VF 7 — Crossover Thể Thao Cá Tính",
    "VinFast VF Wild — Bán Tải Điện Đột Phá"
  ];
  let currentSlide = 0;
  let slideTimer = null;

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === currentSlide));
    dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
    if (sliderTitle && slideTitles[currentSlide]) {
      sliderTitle.textContent = slideTitles[currentSlide];
    }
  }

  function startAutoSlide() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(currentSlide + 1), 4500);
  }

  if (slides.length) {
    if (prevBtn) prevBtn.addEventListener("click", () => { showSlide(currentSlide - 1); startAutoSlide(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { showSlide(currentSlide + 1); startAutoSlide(); });
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        showSlide(Number(dot.dataset.index || 0));
        startAutoSlide();
      });
    });
    startAutoSlide();
  }

  // 3. Render Danh Mục 14 Dòng Xe & Lọc Theo Tab
  const carsGrid = document.getElementById("cars-grid");
  const filterTabs = document.querySelectorAll(".filter-tab");

  function renderCars(filter = "all") {
    if (!carsGrid) return;
    const filtered =
      filter === "all"
        ? VINFAST_CARS
        : VINFAST_CARS.filter((car) => car.category === filter);

    carsGrid.innerHTML = filtered
      .map(
        (car) => `
      <article class="car-card" data-id="${car.id}">
        <div>
          <div class="car-card-top">
            <span class="car-segment">${car.segment}</span>
            <span class="car-badge">${car.badge}</span>
          </div>
          <div class="car-img-box">
            <img src="${car.img}" alt="${car.name} VinFast Hà Nội" loading="lazy" />
          </div>
          <h3 class="car-name">${car.name}</h3>
          <p class="car-desc">${car.desc}</p>
          <div class="car-specs">
            <span>⚡ NEDC: ${car.nedc}</span>
            <span>💺 ${car.seats}</span>
          </div>
        </div>
        <div>
          <div class="car-pricing">
            <div class="car-price-main">
              <span>Giá từ:</span>
              <strong>${car.priceText}</strong>
            </div>
            <div class="car-price-sub">
              <span>Trả góp chỉ từ:</span>
              <strong>${car.installmentText}</strong>
            </div>
            <div class="car-promo">🎁 ${car.promoText}</div>
          </div>
          <div class="car-actions">
            <button type="button" class="btn btn-outline js-calc-car" data-id="${car.id}">
              Tính lăn bánh
            </button>
            <button type="button" class="btn btn-primary js-quote-car" data-name="${car.name}">
              Nhận báo giá
            </button>
          </div>
        </div>
      </article>
    `
      )
      .join("");

    // Gắn sự kiện cho các nút trên thẻ xe
    carsGrid.querySelectorAll(".js-calc-car").forEach((btn) => {
      btn.addEventListener("click", () => {
        const carId = btn.dataset.id;
        const calcSelect = document.getElementById("calc-car");
        if (calcSelect) {
          calcSelect.value = carId;
          updateCalculator();
          document.getElementById("du-toan").scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    carsGrid.querySelectorAll(".js-quote-car").forEach((btn) => {
      btn.addEventListener("click", () => {
        const leadCar = document.getElementById("lead-car");
        if (leadCar) {
          leadCar.value = btn.dataset.name;
        }
        document.getElementById("lien-he").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderCars(tab.dataset.filter);
    });
  });

  renderCars("all");

  // 4. Sân Khấu 3D Showroom Tương Tác
  const stageBox = document.getElementById("stage-3d-box");
  const stageCarWrap = document.getElementById("stage-car-wrap");
  const stageCarImg = document.getElementById("stage-car-img");
  const stageCarName = document.getElementById("stage-car-name");
  const stageCarSegment = document.getElementById("stage-car-segment");
  const stageCarNedc = document.getElementById("stage-car-nedc");
  const stageCarPrice = document.getElementById("stage-car-price");
  const stageCarInstallment = document.getElementById("stage-car-installment");
  const stageCarSelect = document.getElementById("stage-car-select");
  const stageCalcBtn = document.getElementById("stage-calc-btn");
  const swatchesWrap = document.getElementById("stage-color-swatches");
  const stageColorName = document.getElementById("stage-color-name");

  let activeStageCar = VINFAST_CARS.find((c) => c.id === "vf-7") || VINFAST_CARS[0];

  if (stageCarSelect) {
    stageCarSelect.innerHTML = VINFAST_CARS.map(
      (c) =>
        `<option value="${c.id}" ${c.id === activeStageCar.id ? "selected" : ""}>${c.name} (${c.segment}) - ${c.priceText}</option>`
    ).join("");

    stageCarSelect.addEventListener("change", (e) => {
      const found = VINFAST_CARS.find((c) => c.id === e.target.value);
      if (found) {
        activeStageCar = found;
        updateStageUI();
      }
    });
  }

  function renderStageSwatches(car) {
    if (!swatchesWrap) return;
    const colors = car.colors && car.colors.length ? car.colors : [{ name: "Tiêu chuẩn hãng", hex: "#1464f4", img: car.img }];
    swatchesWrap.innerHTML = colors
      .map((col, idx) => {
        const bg = col.hex2 ? `linear-gradient(135deg, ${col.hex2} 45%, ${col.hex} 46%)` : col.hex;
        return `<button type="button" class="swatch-btn ${idx === 0 ? "active" : ""}" style="background:${bg};" data-idx="${idx}" title="${col.name}"></button>`;
      })
      .join("");

    if (stageColorName) stageColorName.textContent = colors[0].name;
    if (stageCarImg) {
      stageCarImg.style.filter = "drop-shadow(0 28px 26px rgba(0, 0, 0, 0.65))";
      stageCarImg.src = colors[0].img;
    }

    swatchesWrap.querySelectorAll(".swatch-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const col = colors[Number(btn.dataset.idx || 0)];
        if (!col) return;
        swatchesWrap.querySelectorAll(".swatch-btn").forEach((s) => s.classList.remove("active"));
        btn.classList.add("active");
        if (stageCarImg) stageCarImg.src = col.img;
        if (stageColorName) stageColorName.textContent = col.name;
      });
    });
  }

  function updateStageUI() {
    if (!activeStageCar) return;
    if (stageCarImg) stageCarImg.src = activeStageCar.img;
    if (stageCarName) stageCarName.textContent = activeStageCar.name;
    if (stageCarSegment) stageCarSegment.textContent = activeStageCar.segment;
    if (stageCarNedc) stageCarNedc.textContent = `NEDC: ${activeStageCar.nedc}`;
    if (stageCarPrice) stageCarPrice.textContent = activeStageCar.priceText;
    if (stageCarInstallment) stageCarInstallment.textContent = activeStageCar.installmentText;
    renderStageSwatches(activeStageCar);
  }

  updateStageUI();

  if (stageCalcBtn) {
    stageCalcBtn.addEventListener("click", () => {
      const calcSelect = document.getElementById("calc-car");
      if (calcSelect && activeStageCar) {
        calcSelect.value = activeStageCar.id;
        updateCalculator();
        document.getElementById("du-toan").scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Hiệu ứng 4D nghiêng theo chuột & ánh sáng studio trên ảnh thực tế
  if (stageBox && stageCarWrap) {
    stageBox.addEventListener("mousemove", (e) => {
      const rect = stageBox.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      stageCarWrap.style.transform = `rotateY(${x * 26}deg) rotateX(${-y * 12}deg) scale(1.05)`;
    });
    stageBox.addEventListener("mouseleave", () => {
      stageCarWrap.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    });
  }

  // 5. Máy Tính Giá Lăn Bánh Hà Nội & Trả Góp 85%
  const calcCarSelect = document.getElementById("calc-car");
  const downRange = document.getElementById("down-range");
  const yearRange = document.getElementById("year-range");
  const downLabel = document.getElementById("down-label");
  const yearLabel = document.getElementById("year-label");

  if (calcCarSelect) {
    calcCarSelect.innerHTML = VINFAST_CARS.map(
      (c) => `<option value="${c.id}">${c.name} — ${c.priceText}</option>`
    ).join("");
  }

  function updateCalculator() {
    if (!calcCarSelect) return;
    const car = VINFAST_CARS.find((c) => c.id === calcCarSelect.value) || VINFAST_CARS[0];
    const downPct = Number(downRange ? downRange.value : 20);
    const years = Number(yearRange ? yearRange.value : 5);

    if (downLabel) downLabel.textContent = `${downPct}%`;
    if (yearLabel) yearLabel.textContent = `${years} năm`;

    // Chi phí lăn bánh tại Hà Nội (xe điện miễn 100% lệ phí trước bạ)
    const plateFee = car.id === "ec-van" ? 500000 : 20000000;
    const fixedFees = 2160000; // Đăng kiểm + phí đường bộ 1 năm + BH TNDS
    const totalRolling = car.price + plateFee + fixedFees;

    const downAmount = (car.price * downPct) / 100 + plateFee + fixedFees;
    const loanAmount = car.price - (car.price * downPct) / 100;
    const months = years * 12;
    const monthlyRate = 0.075 / 12; // Lãi suất tham khảo ~7.5%/năm
    const monthlyPay =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    document.getElementById("sum-price").textContent = formatVND(car.price);
    document.getElementById("sum-tax").textContent = "0 ₫ (Miễn 100% xe điện)";
    document.getElementById("sum-plate").textContent = formatVND(plateFee);
    document.getElementById("sum-other").textContent = formatVND(fixedFees);
    document.getElementById("sum-total").textContent = formatVND(totalRolling);
    document.getElementById("sum-down").textContent = formatVND(downAmount);
    document.getElementById("sum-monthly").textContent = formatVND(monthlyPay) + "/tháng";
  }

  if (calcCarSelect) calcCarSelect.addEventListener("change", updateCalculator);
  if (downRange) downRange.addEventListener("input", updateCalculator);
  if (yearRange) yearRange.addEventListener("input", updateCalculator);
  updateCalculator();

  // 6. Form Đăng Ký Lái Thử / Nhận Báo Giá
  const leadCarSelect = document.getElementById("lead-car");
  if (leadCarSelect) {
    leadCarSelect.innerHTML = VINFAST_CARS.map(
      (c) => `<option value="${c.name}">${c.name} (${c.priceText})</option>`
    ).join("");
  }

  const leadForm = document.getElementById("lead-form");
  const leadFeedback = document.getElementById("lead-feedback");
  if (leadForm && leadFeedback) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("lead-name").value.trim();
      const phone = document.getElementById("lead-phone").value.trim();
      const car = document.getElementById("lead-car").value;
      const need = document.getElementById("lead-need").value;

      leadFeedback.style.display = "block";
      leadFeedback.innerHTML = `✅ Cảm ơn anh/chị <strong>${name}</strong> (${phone})! Yêu cầu <strong>${need}</strong> dòng xe <strong>${car}</strong> đã được ghi nhận. Mr. Tùng (0982.068.820) tại Số 1 Nguyễn Văn Linh sẽ liên hệ ngay trong ít phút!`;
      leadForm.reset();
    });
  }
});
