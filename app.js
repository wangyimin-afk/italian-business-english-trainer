const transcriptInput = document.querySelector("#transcriptInput");
const sensitiveInput = document.querySelector("#sensitiveInput");
const contextInput = document.querySelector("#contextInput");
const analyzeBtn = document.querySelector("#analyzeBtn");
const loadSampleBtn = document.querySelector("#loadSampleBtn");
const copyCleanedBtn = document.querySelector("#copyCleanedBtn");
const exportBtn = document.querySelector("#exportBtn");
const toast = document.querySelector("#toast");

const state = {
  cleanedText: "",
  notes: "",
};

const domainTerms = [
  ["tooling", "模具/工装"],
  ["tool update", "模具修改"],
  ["interim solution", "临时方案"],
  ["global action", "全球统一动作"],
  ["part number", "料号"],
  ["dual source", "双供应源"],
  ["two sources", "两个供应来源"],
  ["local source", "本地供应源"],
  ["china source", "中国供应源"],
  ["european source", "欧洲供应源"],
  ["volume", "采购量/预测量"],
  ["forecast", "预测"],
  ["cost", "成本"],
  ["average price", "平均价格"],
  ["sea freight", "海运"],
  ["lead time", "交期"],
  ["flexibility", "灵活性"],
  ["risk", "风险"],
  ["stock", "库存"],
  ["components", "零部件"],
  ["package", "套件/包装"],
  ["elevator", "升降/电梯相关套件"],
  ["range of products", "产品范围"],
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
    keys: ["global action", "europe", "china"],
    text: "对方可能在强调：某个变更不应只作用于单一区域，而应作为全球统一动作同步到欧洲和中国。",
  },
  {
    keys: ["tool", "update"],
    text: "存在模具或工装更新时间点，需要确认完成日期、影响料号和切换库存。",
  },
  {
    keys: ["two sources", "dual source", "same part number"],
    text: "会议核心可能涉及双供应源策略：同一料号保留两个来源，以平衡成本、风险和供应连续性。",
  },
  {
    keys: ["sea freight", "flexibility"],
    text: "对方在比较中国海运成本优势和本地供应灵活性，需求高峰时本地库存更容易救急。",
  },
  {
    keys: ["cost", "higher", "china"],
    text: "成本差异是谈判重点。需要确认欧洲来源相对中国来源高出的比例，以及是否能用风险降低来解释。",
  },
  {
    keys: ["volume", "pieces"],
    text: "数量信号需要单独确认：当前需求、年度预测、份额估算和订单包数量可能混在一起说。",
  },
];

const sampleTranscript = `To me this change should be a global action, not only for Europe. If the box is modified for Europe, it should be modified as well for China.

The importer in Central Europe may discuss buying from Supplier A because the current package is expensive. The possible volume is around 8,000 pieces, but we need to confirm if this is annual volume or current forecast.

For Europe this was considered an interim solution. We are still waiting for the tooling update, and the supplier needs a few weeks to modify the tool.

The idea was to have two sources for the same part number. One source can be local and one source can come from China. The European source may be 15 to 20 percent higher, but it gives flexibility, risk management, and faster reaction when sea freight is delayed or when there is a volume peak.`;

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
    const label = index % 3 === 0 ? "Supplier" : index % 3 === 1 ? "Customer" : "Project";
    const replacement = `[${label} ${Math.floor(index / 3) + 1}]`;
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
  const matches = text.match(/\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b|\b\d+(?:\.\d+)?\s?(?:%|percent|weeks?|months?|days?|pieces?|pcs|packages?)\b/gi);
  return [...new Set(matches || [])];
}

function buildStoryline(text) {
  const lower = text.toLowerCase();
  const hits = storylineRules
    .filter((rule) => rule.keys.every((key) => lower.includes(key)))
    .map((rule) => rule.text);

  if (hits.length) return hits;

  return [
    "先判断这段话是在讨论变更、成本、供应源、交期还是风险。",
    "把供应商、国家、数量、时间和动作拆开记录，不需要逐词翻译。",
    "用确认句把不确定点钉住，尤其是数字、日期和责任方。",
  ];
}

function buildQuestions(text) {
  const lower = text.toLowerCase();
  const questions = [
    "Just to confirm, what is the action owner for this change?",
    "When you mention this number, is it annual volume or current forecast?",
    "Can I understand this as a sourcing and risk-management decision?",
  ];

  if (lower.includes("global") || lower.includes("europe") || lower.includes("china")) {
    questions.unshift("Just to confirm, should this change apply globally, not only to one region?");
  }
  if (lower.includes("tool")) {
    questions.unshift("Do you mean the supplier is still waiting for the tooling update?");
  }
  if (lower.includes("source")) {
    questions.unshift("Can I understand this as a dual-source strategy for the same part number?");
  }
  if (lower.includes("sea freight")) {
    questions.unshift("So the main reason for the local source is flexibility when sea freight is delayed, correct?");
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
    : "这一段数字不明显，复听时优先抓供应商、国家和责任方。";
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

loadSampleBtn.addEventListener("click", () => {
  transcriptInput.value = sampleTranscript;
  sensitiveInput.value = "";
  contextInput.value = "欧洲采购会议；供应链风险；模具变更；双供应源策略。";
  analyze();
});

analyzeBtn.addEventListener("click", analyze);
copyCleanedBtn.addEventListener("click", () => copyText(state.cleanedText, "先生成清洗文本。"));
exportBtn.addEventListener("click", exportNotes);
