/* Scent finder quiz */
(function (E) {
  const QUIZ_STEPS = [
    {
      id: "gender",
      question: "Who is this fragrance for?",
      options: [
        { label: "Men", value: "Men", scores: { Men: 3 } },
        { label: "Women", value: "Women", scores: { Women: 3 } },
        { label: "Anyone / Unisex", value: "Unisex", scores: { Unisex: 3 } }
      ]
    },
    {
      id: "occasion",
      question: "When will you wear it most?",
      options: [
        { label: "Office & daily", value: "daily", scores: { Fresh: 2, Citrus: 2 } },
        { label: "Evening & dates", value: "evening", scores: { Oriental: 2, Gourmand: 1 } },
        { label: "Special occasions", value: "special", scores: { Oriental: 2, Niche: 1 } }
      ]
    },
    {
      id: "family",
      question: "Which scent mood appeals to you?",
      options: [
        { label: "Fresh & clean", value: "Fresh", scores: { Fresh: 4, Citrus: 2 } },
        { label: "Warm & woody", value: "Woody", scores: { Woody: 4, Oriental: 1 } },
        { label: "Floral & elegant", value: "Floral", scores: { Floral: 4 } },
        { label: "Sweet & gourmand", value: "Gourmand", scores: { Gourmand: 4, Oriental: 1 } }
      ]
    },
    {
      id: "budget",
      question: "Your budget for a 50 ml bottle?",
      options: [
        { label: "Under ₹3,000", value: "low", maxPrice: 3000 },
        { label: "₹3,000 – ₹8,000", value: "mid", minPrice: 3000, maxPrice: 8000 },
        { label: "₹8,000+", value: "high", minPrice: 8000 }
      ]
    },
    {
      id: "intensity",
      question: "How bold should the scent be?",
      options: [
        { label: "Soft & close", value: "soft", preferSillage: ["Soft", "Moderate", "Fresh"] },
        { label: "Noticeable", value: "moderate", preferSillage: ["Moderate", "Strong", "Elegant"] },
        { label: "Beast mode", value: "bold", preferSillage: ["Strong", "Heavy", "Beast mode"] }
      ]
    }
  ];

  let quizAnswers = {};
  let quizStep = 0;

  function scoreProducts() {
    const familyScores = {};
    let genderPref = "Unisex";
    let minPrice = 0;
    let maxPrice = Infinity;

    QUIZ_STEPS.forEach((step) => {
      const answer = quizAnswers[step.id];
      if (!answer) return;
      const opt = step.options.find((o) => o.value === answer);
      if (!opt) return;
      if (opt.scores) {
        Object.entries(opt.scores).forEach(([k, v]) => {
          familyScores[k] = (familyScores[k] || 0) + v;
        });
      }
      if (step.id === "gender") genderPref = answer;
      if (step.id === "budget") {
        minPrice = opt.minPrice || 0;
        maxPrice = opt.maxPrice ?? Infinity;
      }
    });

    const ranked = E.perfumes.map((p) => {
      const profile = getScentProfile(p.id);
      let score = familyScores[profile.family] || 0;
      if (p.gender === genderPref || p.gender === "Unisex" || genderPref === "Unisex") score += 2;
      if (p.price >= minPrice && p.price <= maxPrice) score += 3;
      else score -= 1;
      return { p, score };
    }).sort((a, b) => b.score - a.score);

    return ranked.slice(0, 3).map((r) => r.p);
  }

  function renderQuizStep() {
    const body = document.getElementById("quizBody");
    const progress = document.getElementById("quizProgress");
    if (!body) return;
    const step = QUIZ_STEPS[quizStep];
    if (progress) {
      progress.style.width = `${((quizStep + 1) / QUIZ_STEPS.length) * 100}%`;
    }
    if (!step) {
      const picks = scoreProducts();
      const fallback = E.buildFallbackImage("Perfume");
      body.innerHTML = `
        <h3>Your signature matches</h3>
        <p class="quiz-result-intro">Based on your answers, we recommend these three fragrances.</p>
        <div class="quiz-results">
          ${picks.map((p) => `
            <a href="product.html?id=${p.id}" class="quiz-result-card">
              <img src="${E.getSafeProductImage(p)}" alt="" width="80" height="100"
                onerror="this.onerror=null;this.src='${fallback}';" />
              <div>
                <strong>${p.name}</strong>
                <span>${getScentProfile(p.id).family} · ${E.formatINR(p.price)}</span>
              </div>
            </a>`).join("")}
        </div>
        <button type="button" class="btn btn--outline" id="quizRestart">Retake quiz</button>
        <a href="index.html#products" class="btn">Browse all</a>`;
      document.getElementById("quizRestart")?.addEventListener("click", () => {
        quizAnswers = {};
        quizStep = 0;
        renderQuizStep();
      });
      return;
    }
    body.innerHTML = `
      <p class="quiz-step-count">Question ${quizStep + 1} of ${QUIZ_STEPS.length}</p>
      <h3>${step.question}</h3>
      <div class="quiz-options">
        ${step.options.map((o) => `
          <button type="button" class="quiz-option" data-value="${o.value}">${o.label}</button>
        `).join("")}
      </div>`;
    body.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        quizAnswers[step.id] = btn.dataset.value;
        quizStep += 1;
        renderQuizStep();
      });
    });
  }

  E.openQuiz = function () {
    const modal = document.getElementById("quizModal");
    if (!modal) return;
    quizAnswers = {};
    quizStep = 0;
    modal.classList.remove("hidden");
    renderQuizStep();
  };

  E.setupQuiz = function () {
    document.getElementById("openQuizBtn")?.addEventListener("click", E.openQuiz);
    document.getElementById("closeQuiz")?.addEventListener("click", () => {
      document.getElementById("quizModal")?.classList.add("hidden");
    });
    document.getElementById("quizModal")?.addEventListener("click", (e) => {
      if (e.target.id === "quizModal") e.target.classList.add("hidden");
    });
  };
})(window.Eclat);
