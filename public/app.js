(() => {
  const $ = id => document.getElementById(id);
  let currentCaseId = 1;
  let currentCase = null;
  let unlocked = new Set();
  const connection = $("connection");

  async function api(url, options = {}) {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
    return body;
  }

  async function loadCase(caseId) {
    try {
      const data = await api("/api/game/start", {
        method: "POST",
        body: JSON.stringify({ caseId })
      });
      currentCaseId = caseId;
      currentCase = data.case;
      unlocked = new Set(data.progress.unlockedClues || []);
      renderCase();
      connection.textContent = "CASE ARCHIVE CONNECTED";
      connection.style.color = "#8fd3a2";
      $("result").textContent = "";
    } catch (err) {
      connection.textContent = "DATABASE CONNECTION ERROR";
      connection.style.color = "#e38a80";
      $("case-title").textContent = "Case files unavailable";
      $("story").textContent = `${err.message}. Check the server logs and MongoDB connection settings.`;
    }
  }

  function renderCase() {
    $("case-title").textContent = `#${currentCase.caseId} — ${currentCase.title}`;
    $("difficulty").textContent = currentCase.difficulty;
    $("story").textContent = currentCase.story;
    $("suspects").replaceChildren();
    $("suspect-choice").replaceChildren(new Option("Choose a suspect", ""));
    currentCase.suspects.forEach(s => {
      const article = document.createElement("div");
      article.className = "suspect";
      const name = document.createElement("strong");
      name.textContent = s.name;
      const details = document.createElement("small");
      details.textContent = `${s.occupation || "Suspect"} · “${s.statement || "No statement recorded."}”`;
      article.append(name, details);
      $("suspects").append(article);
      $("suspect-choice").add(new Option(s.name, s.name));
    });
    $("clues").replaceChildren();
    $("evidence-choice").replaceChildren();
    currentCase.clues.forEach(clue => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "clue-button";
      button.textContent = unlocked.has(clue.title) ? `✓ ${clue.title}` : `▣ ${clue.title}`;
      button.addEventListener("click", () => revealClue(clue.title));
      $("clues").append(button);
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = clue.title;
      checkbox.disabled = !unlocked.has(clue.title);
      label.append(checkbox, document.createTextNode(clue.title));
      $("evidence-choice").append(label);
    });
    $("clue-detail").textContent = "Open an evidence box to inspect its contents.";
  }

  async function revealClue(title) {
    try {
      const data = await api("/api/game/clue", {
        method: "POST",
        body: JSON.stringify({ caseId: currentCaseId, clueTitle: title })
      });
      unlocked.add(title);
      renderCase();
      $("clue-detail").textContent = `${data.clue.title}: ${data.clue.description}`;
    } catch (err) { $("result").textContent = err.message; }
  }

  $("verdict-form").addEventListener("submit", async event => {
    event.preventDefault();
    const suspect = $("suspect-choice").value;
    const evidence = [...$("evidence-choice").querySelectorAll("input:checked")].map(el => el.value);
    if (!suspect) return;
    const button = $("verdict-form").querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      const result = await api("/api/game/accuse", {
        method: "POST",
        body: JSON.stringify({ caseId: currentCaseId, suspect, evidence })
      });
      $("result").className = result.correct ? "success" : "failure";
      $("result").textContent = `${result.message} Score: ${result.score}% · Stars: ${result.stars} · Attempts left: ${result.attemptsRemaining}. ${result.explanation}`;
    } catch (err) {
      $("result").className = "failure";
      $("result").textContent = err.message;
    } finally { button.disabled = false; }
  });

  $("next-case").addEventListener("click", () => loadCase(currentCaseId >= 20 ? 1 : currentCaseId + 1));
  $("reset").addEventListener("click", () => loadCase(currentCaseId));
  loadCase(1);
})();
