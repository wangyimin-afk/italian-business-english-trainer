const transcriptInput = document.querySelector("#transcriptInput");
const sensitiveInput = document.querySelector("#sensitiveInput");
const contextInput = document.querySelector("#contextInput");
const analyzeBtn = document.querySelector("#analyzeBtn");
const copyCleanedBtn = document.querySelector("#copyCleanedBtn");
const exportBtn = document.querySelector("#exportBtn");
const toast = document.querySelector("#toast");

const state = {
  cleanedText: "",
  notes: "",
};

const domainTerms = [
  ["decision", "决定/结论"],
  ["action", "行动项"],
  ["owner", "负责人"],
  ["deadline", "截止时间"],
  ["timeline", "时间线"],
  ["priority", "优先级"],
  ["budget", "预算"],
  ["price", "价格"],
  ["cost", "成本"],
  ["client", "客户/合作方"],
  ["partner", "合作方"],
  ["project", "项目"],
  ["quality", "质量"],
  ["delivery", "交付"],
  ["delay", "延迟"],
  ["risk", "风险"],
  ["issue", "问题"],
  ["solution", "解决方案"],
  ["proposal", "提案"],
  ["agreement", "一致意见"],
  ["follow up", "跟进"],
  ["next step", "下一步"],
];

const fillerPhrases = [
  ["to me", "我认为。通常后面是他的判断，不一定是最终决定。"],
  ["actually", "实际上。很多欧洲商务英语里也只是填充词。"],
  ["more or less", "大概。后面常跟估算数字或不确定判断。"],
  ["as a matter of fact", "事实上。后面可能进入背景解释。"],
  ["the idea was", "原来的方案/思路是。注意后面通常是策略。"],
  ["because why", "为什么呢。意大利人有时会这样自问自答。"],
  ["of course", "当然。经常用于补充，不一定是重点。"],
  ["for some reason", "由于某些原因。后面可能是风险或异常。"],
  ["we are more than willing", "我们愿意配合。常用于商务让步或支持。"],
];

const storylineRules = [
  {
    keys: ["decision"],
    text: "先抓对方的结论：这段话可能在说明一个决定、建议或需要确认的方向。",
  },
  {
    keys: ["action"],
    text: "识别行动项：记录谁负责、要做什么、什么时候完成。",
  },
  {
    keys: ["deadline"],
    text: "时间点是复听重点：确认截止日期、阶段节点和是否存在延期风险。",
  },
  {
    keys: ["cost"],
    text: "成本或价格是关键信号：需要区分事实数字、估算数字和谈判判断。",
  },
  {
    keys: ["risk"],
    text: "风险类表达通常跟在原因解释后面：重点听延迟、质量、预算、责任或交付风险。",
  },
  {
    keys: ["issue"],
    text: "如果对方在描述问题，先拆成现象、原因、影响和下一步。",
  },
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function getSensitiveTerms() {
  return sensitiveInput.value
    .split(/\n|,|，/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1);
}

function redactText(text) {
  let cleaned = text;
  getSensitiveTerms().forEach((term, index) => {
    const replacement = `[Entity ${index + 1}]`;
    cleaned = cleaned.replace(new RegExp(escapeRegExp(term), "gi"), replacement);
  });
  return cleaned;
}

function findTerms(text, dictionary) {
  const lower = text.toLowerCase();
  return dictionary
    .filter(([term]) => lower.includes(term))
    .map(([term, meaning]) => ({ term, meaning }));
}

function findNumbers(text) {
  const matches = text.match(/\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b|\b\d+(?:\.\d+)?\s?(?:%|percent|weeks?|months?|days?)\b/gi);
  return [...new Set(matches || [])];
}

function buildStoryline(text) {
  const lower = text.toLowerCase();
  const hits = storylineRules
    .filter((rule) => rule.keys.some((key) => lower.includes(key)))
    .map((rule) => rule.text);

  if (hits.length) return hits;

  return [
    "先判断这段话是在讨论决定、问题、原因、责任、时间还是下一步。",
    "把人物、数字、时间和动作拆开记录，不需要逐词翻译。",
    "用确认句把不确定点钉住，尤其是数字、日期和责任方。",
  ];
}

function buildQuestions(text) {
  const lower = text.toLowerCase();
  const questions = [
    "Just to confirm, what is the main decision here?",
    "Who is the owner for the next action?",
    "When you mention this number, what exactly does it refer to?",
  ];

  if (lower.includes("deadline") || lower.includes("timeline") || lower.includes("date")) {
    questions.unshift("Could you confirm the exact timeline and deadline?");
  }
  if (lower.includes("cost") || lower.includes("price") || lower.includes("budget")) {
    questions.unshift("Do you mean this is a confirmed cost or only an estimate?");
  }
  if (lower.includes("risk") || lower.includes("issue") || lower.includes("delay")) {
    questions.unshift("So the main concern is risk and impact, correct?");
  }
  if (lower.includes("proposal") || lower.includes("solution")) {
    questions.unshift("Can I understand this as the proposed solution?");
  }

  return [...new Set(questions)].slice(0, 7);
}

function renderChips(containerId, items, className = "") {
  const container = document.querySelector(containerId);
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = `<span class="chip ${className}">暂无明显信号</span>`;
    return;
  }
  items.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = `chip ${className}`;
    chip.textContent = typeof item === "string" ? item : `${item.term} · ${item.meaning}`;
    container.appendChild(chip);
  });
}

function renderCards(containerId, items) {
  const container = document.querySelector(containerId);
  container.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "phrase-card";
    if (Array.isArray(item)) {
      card.innerHTML = `<strong>${item[0]}</strong><p>${item[1]}</p>`;
    } else {
      card.innerHTML = `<p>${item}</p>`;
    }
    container.appendChild(card);
  });
}

function renderList(containerId, items) {
  const container = document.querySelector(containerId);
  container.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
}

function makeNotes(cleaned, storyline, terms, numbers, phrases, questions) {
  return [
    "# 意大利商务英语听力训练笔记",
    "",
    "## 清洗后文本",
    cleaned,
    "",
    "## 业务主线",
    ...storyline.map((item, index) => `${index + 1}. ${item}`),
    "",
    "## 关键词",
    terms.map((item) => `- ${item.term}: ${item.meaning}`).join("\n") || "- 暂无",
    "",
    "## 数字与时间",
    numbers.map((item) => `- ${item}`).join("\n") || "- 暂无",
    "",
    "## 意大利式表达",
    phrases.map((item) => `- ${item[0]}: ${item[1]}`).join("\n") || "- 暂无",
    "",
    "## 会议确认句",
    questions.map((item) => `- ${item}`).join("\n"),
  ].join("\n");
}

function analyze() {
  const raw = transcriptInput.value.trim();
  if (!raw) {
    showToast("先粘贴一段会议转写。");
    return;
  }

  const cleaned = redactText(raw);
  const words = cleaned.match(/[A-Za-z]+(?:'[A-Za-z]+)?|\d+/g) || [];
  const terms = findTerms(cleaned, domainTerms);
  const numbers = findNumbers(cleaned);
  const phrases = findTerms(cleaned, fillerPhrases).map((item) => [item.term, item.meaning]);
  const storyline = buildStoryline(`${cleaned}\n${contextInput.value}`);
  const questions = buildQuestions(cleaned);

  state.cleanedText = cleaned;
  state.notes = makeNotes(cleaned, storyline, terms, numbers, phrases, questions);

  document.querySelector("#cleanedOutput").textContent = cleaned;
  document.querySelector("#cleanedOutput").classList.remove("empty");
  renderList("#storylineOutput", storyline);
  renderChips("#keywordOutput", terms);
  renderChips("#numbersOutput", numbers, "number");
  renderCards("#phraseOutput", phrases.length ? phrases : [["暂无明显口头禅", "这段可能比较短，建议加入更完整的会议语流。"]]);
  renderCards("#questionsOutput", questions);

  document.querySelector("#wordCount").textContent = words.length;
  document.querySelector("#keywordCount").textContent = terms.length;
  document.querySelector("#numberCount").textContent = numbers.length;
  document.querySelector("#phraseCount").textContent = phrases.length;

  document.querySelector("#passOne").textContent = storyline[0] || "先抓结论。";
  document.querySelector("#passTwo").textContent = numbers.length
    ? `重点复听这些数字：${numbers.slice(0, 6).join("、")}。`
    : "这一段数字不明显，复听时优先抓人物、时间和责任方。";
  document.querySelector("#passThree").textContent =
    "复听所有 because、actually、the idea was 后面的内容，通常那里藏着原因或策略。";

  showToast("训练内容已生成。");
}

async function copyText(value, fallbackMessage) {
  if (!value) {
    showToast(fallbackMessage);
    return;
  }
  await navigator.clipboard.writeText(value);
  showToast("已复制。");
}

function exportNotes() {
  if (!state.notes) {
    showToast("先生成训练内容。");
    return;
  }
  const blob = new Blob([state.notes], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "listening-training-notes.md";
  anchor.click();
  URL.revokeObjectURL(url);
}

analyzeBtn.addEventListener("click", analyze);
copyCleanedBtn.addEventListener("click", () => copyText(state.cleanedText, "先生成清洗文本。"));
exportBtn.addEventListener("click", exportNotes);
