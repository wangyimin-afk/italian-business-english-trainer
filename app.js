const transcriptInput = document.querySelector("#transcriptInput");
const sensitiveInput = document.querySelector("#sensitiveInput");
const contextInput = document.querySelector("#contextInput");
const analyzeBtn = document.querySelector("#analyzeBtn");
const copyCleanedBtn = document.querySelector("#copyCleanedBtn");
const exportBtn = document.querySelector("#exportBtn");
const copyLibraryBtn = document.querySelector("#copyLibraryBtn");
const categoryTabs = document.querySelector("#categoryTabs");
const sentenceLibrary = document.querySelector("#sentenceLibrary");
const toast = document.querySelector("#toast");

const state = {
  cleanedText: "",
  notes: "",
  activeCategory: "全部",
};

const sentenceBank = [
  { category: "会议开场", en: "To me, the first point is to align on the objective of this meeting.", zh: "我认为第一点是先对齐这次会议的目标。" },
  { category: "会议开场", en: "Actually, before going into the detail, I would like to clarify the background.", zh: "其实在进入细节之前，我想先澄清一下背景。" },
  { category: "会议开场", en: "The idea today is not to decide everything, but to understand the main direction.", zh: "今天的思路不是把所有事情都定下来，而是先理解主要方向。" },
  { category: "会议开场", en: "Maybe we can start from the current situation, then we go to the open points.", zh: "也许我们可以先从当前情况开始，然后再看未解决的问题。" },
  { category: "会议开场", en: "If you agree, I will explain first the logic behind this request.", zh: "如果你同意，我先解释这个要求背后的逻辑。" },
  { category: "会议开场", en: "I think we need to separate facts from assumptions in this discussion.", zh: "我认为这次讨论里我们需要把事实和假设分开。" },
  { category: "会议开场", en: "For me, the important thing is to have a common understanding before action.", zh: "对我来说，重要的是行动前先形成共同理解。" },
  { category: "会议开场", en: "Let us first check what is confirmed and what is still under discussion.", zh: "我们先检查哪些已经确认，哪些还在讨论中。" },
  { category: "会议开场", en: "I would propose to go point by point, otherwise we mix too many topics.", zh: "我建议逐点讨论，否则会把太多话题混在一起。" },
  { category: "会议开场", en: "At the end, we should have clear owners and clear timing.", zh: "最后我们应该有明确的负责人和明确的时间安排。" },

  { category: "确认理解", en: "Just to be sure, when you say this, you mean the final decision is not yet taken, correct?", zh: "我确认一下，你的意思是最终决定还没有做，对吗？" },
  { category: "确认理解", en: "Can I understand that this point is a recommendation, not a confirmed instruction?", zh: "我可以理解为这点是建议，而不是已经确认的指令吗？" },
  { category: "确认理解", en: "Sorry, I want to repeat it in my words to see if I understood correctly.", zh: "不好意思，我想用自己的话复述一下，看我是否理解正确。" },
  { category: "确认理解", en: "So the point is not the price only, but also the risk behind the price.", zh: "所以重点不只是价格，还有价格背后的风险。" },
  { category: "确认理解", en: "When you say urgent, do you mean this week or simply before the next review?", zh: "你说紧急，是指本周内，还是只是在下次评审前？" },
  { category: "确认理解", en: "Do you mean this is valid for all projects, or only for this specific case?", zh: "你的意思是这适用于所有项目，还是只适用于这个具体案例？" },
  { category: "确认理解", en: "Let me confirm the logic: first we solve the short term issue, then we work on the long term solution.", zh: "我确认一下逻辑：先解决短期问题，再做长期方案。" },
  { category: "确认理解", en: "If I understand well, the main concern is not technical, it is commercial.", zh: "如果我理解得对，主要顾虑不是技术，而是商务层面的。" },
  { category: "确认理解", en: "Can you please separate what is mandatory from what is only preferred?", zh: "你能不能把必须项和偏好项分开说明？" },
  { category: "确认理解", en: "Before we move on, I want to confirm the exact action expected from our side.", zh: "继续之前，我想确认一下你期望我们这边具体做什么。" },

  { category: "数字成本", en: "More or less, the number is in line with what we discussed before.", zh: "大体上，这个数字和我们之前讨论的是一致的。" },
  { category: "数字成本", en: "This is not the final cost; it is an average based on the current information.", zh: "这不是最终成本，而是基于当前信息的平均估算。" },
  { category: "数字成本", en: "The difference is small in percentage, but it becomes important when the volume is high.", zh: "百分比差异不大，但量大时就会变得重要。" },
  { category: "数字成本", en: "We should not compare only unit price; we should compare the total impact.", zh: "我们不应该只比较单价，而应该比较整体影响。" },
  { category: "数字成本", en: "Because why? The visible cost is one part, but the hidden cost is another part.", zh: "为什么呢？可见成本是一部分，隐藏成本是另一部分。" },
  { category: "数字成本", en: "If the quantity changes, the price logic will change as well.", zh: "如果数量变化，价格逻辑也会变化。" },
  { category: "数字成本", en: "For the moment, I would treat this number as a working assumption.", zh: "目前我会把这个数字当作工作假设。" },
  { category: "数字成本", en: "We need to check if this number is monthly, yearly, or only for the first batch.", zh: "我们需要确认这个数字是月度、年度，还是只针对首批。" },
  { category: "数字成本", en: "The saving is clear, but we need to understand the risk to get this saving.", zh: "节省是清楚的，但我们需要理解为了获得这个节省要承担什么风险。" },
  { category: "数字成本", en: "From cost point of view, it makes sense, but from timing point of view it is more difficult.", zh: "从成本角度看有道理，但从时间角度看会更困难。" },

  { category: "采购供应", en: "The idea is to keep more than one option, so we are not blocked by one partner.", zh: "思路是保留不止一个选项，这样不会被一个合作方卡住。" },
  { category: "采购供应", en: "If one option is cheaper but less flexible, we must decide what risk we accept.", zh: "如果一个选项更便宜但不够灵活，我们必须决定接受什么风险。" },
  { category: "采购供应", en: "A local option is not always cheaper, but sometimes it gives a faster reaction.", zh: "本地选项不一定更便宜，但有时响应会更快。" },
  { category: "采购供应", en: "The question is not who is better, but which option fits which situation.", zh: "问题不是谁更好，而是哪种选项适合哪种情况。" },
  { category: "采购供应", en: "We can use one partner for stability and another one for flexibility.", zh: "我们可以用一个合作方保证稳定，用另一个保证灵活性。" },
  { category: "采购供应", en: "If demand goes up suddenly, the normal plan may not be enough.", zh: "如果需求突然上升，正常计划可能不够。" },
  { category: "采购供应", en: "We need to understand the capacity before we commit to the customer.", zh: "在向客户承诺之前，我们需要先理解产能。" },
  { category: "采购供应", en: "The commercial decision should consider cost, timing, capacity, and risk together.", zh: "商务决策应该同时考虑成本、时间、产能和风险。" },
  { category: "采购供应", en: "It is safer to have a backup plan, even if we do not use it every day.", zh: "有备选方案更安全，即使不是每天都会用到。" },
  { category: "采购供应", en: "For me, the important point is continuity of supply, not only the lowest price.", zh: "对我来说，重要的是供应连续性，而不只是最低价格。" },

  { category: "交期风险", en: "Actually, the main risk is not the plan, but the reaction when the plan changes.", zh: "其实主要风险不是计划本身，而是计划变化时的反应能力。" },
  { category: "交期风险", en: "If the lead time is long, we need to decide earlier and with better forecast.", zh: "如果交期很长，我们就需要更早决策，并且预测要更准确。" },
  { category: "交期风险", en: "The delay is manageable if we know it in advance.", zh: "如果提前知道，延迟是可以管理的。" },
  { category: "交期风险", en: "The problem is when the delay appears at the last moment.", zh: "问题在于延迟在最后一刻才出现。" },
  { category: "交期风险", en: "We need a buffer, otherwise every small issue becomes urgent.", zh: "我们需要缓冲，否则每个小问题都会变成紧急问题。" },
  { category: "交期风险", en: "If the schedule is too tight, the quality risk will increase.", zh: "如果时间表太紧，质量风险会增加。" },
  { category: "交期风险", en: "I am not saying it is impossible, I am saying it is risky.", zh: "我不是说不可能，我是说有风险。" },
  { category: "交期风险", en: "We can recover the delay only if the next steps are very clear.", zh: "只有下一步非常清楚，我们才能追回延迟。" },
  { category: "交期风险", en: "The earlier we freeze the decision, the easier it is to protect the timing.", zh: "越早冻结决策，越容易保护时间进度。" },
  { category: "交期风险", en: "Please consider that flexibility has a cost, but no flexibility can cost more.", zh: "请考虑，灵活性有成本，但没有灵活性可能成本更高。" },

  { category: "变更问题", en: "This change looks small, but the impact can be bigger than expected.", zh: "这个变更看起来小，但影响可能比预期更大。" },
  { category: "变更问题", en: "Before changing the process, we need to understand who is affected.", zh: "改变流程之前，我们需要理解谁会受到影响。" },
  { category: "变更问题", en: "If we change one point, we must check if other documents need to be updated.", zh: "如果改一个点，我们必须检查其他文件是否也需要更新。" },
  { category: "变更问题", en: "The temporary solution is acceptable only if we define the final solution.", zh: "只有定义了最终方案，临时方案才是可以接受的。" },
  { category: "变更问题", en: "We should avoid having two versions without clear control.", zh: "我们应避免在没有清晰控制的情况下出现两个版本。" },
  { category: "变更问题", en: "The issue is not only to make the change, but to make it consistent.", zh: "问题不只是做变更，而是要让变更保持一致。" },
  { category: "变更问题", en: "For this reason, I prefer to confirm the rule before we start execution.", zh: "因此，我更倾向于在开始执行前先确认规则。" },
  { category: "变更问题", en: "If the drawing is updated, the related instruction should be updated as well.", zh: "如果图纸更新，相关说明也应该同步更新。" },
  { category: "变更问题", en: "We need to close the open points before releasing the new version.", zh: "发布新版本前，我们需要关闭未解决的问题。" },
  { category: "变更问题", en: "The change is possible, but we need a clear cutover date.", zh: "变更是可以做的，但需要明确切换日期。" },

  { category: "谈判表达", en: "We are open to discuss, but we need to understand the business reason.", zh: "我们愿意讨论，但需要理解业务原因。" },
  { category: "谈判表达", en: "I cannot promise it today, but I can check internally and come back.", zh: "我今天不能承诺，但可以内部确认后回复。" },
  { category: "谈判表达", en: "If we accept this condition, we need compensation on another point.", zh: "如果我们接受这个条件，需要在另一个点上得到补偿。" },
  { category: "谈判表达", en: "The proposal is interesting, but we need to test if it works in practice.", zh: "这个提案有意思，但我们需要验证实际是否可行。" },
  { category: "谈判表达", en: "We should not close the discussion only on price.", zh: "我们不应该只围绕价格结束讨论。" },
  { category: "谈判表达", en: "From our side, the position is flexible, but not unlimited.", zh: "从我们这边看，立场是灵活的，但不是无限制的。" },
  { category: "谈判表达", en: "If you need a faster answer, we need a more precise request.", zh: "如果你需要更快答复，我们需要更精确的要求。" },
  { category: "谈判表达", en: "I understand your pressure, but we also have constraints on our side.", zh: "我理解你的压力，但我们这边也有限制。" },
  { category: "谈判表达", en: "Let us find a solution that is acceptable for both sides.", zh: "我们找一个双方都能接受的方案。" },
  { category: "谈判表达", en: "Maybe we can agree on the principle first, and then work on the details.", zh: "也许我们可以先对原则达成一致，然后再处理细节。" },

  { category: "责任跟进", en: "Who will take the action to check this point?", zh: "谁负责跟进检查这个点？" },
  { category: "责任跟进", en: "I suggest we write down the owner, otherwise the point remains open.", zh: "我建议写下负责人，否则这个点会一直悬而未决。" },
  { category: "责任跟进", en: "Can we agree that this action is on our side and the next input is on your side?", zh: "我们是否可以确认，这个行动在我们这边，下一步输入在你们那边？" },
  { category: "责任跟进", en: "Please send the confirmation by email, so we avoid different interpretations.", zh: "请通过邮件确认，这样可以避免不同理解。" },
  { category: "责任跟进", en: "After the meeting, I will summarize the open points and the owners.", zh: "会后我会总结未解决点和负责人。" },
  { category: "责任跟进", en: "If there is no objection, I will take this as the agreed direction.", zh: "如果没有异议，我会把这个当作已同意的方向。" },
  { category: "责任跟进", en: "We need one single list of actions, not parallel discussions.", zh: "我们需要一个统一的行动清单，而不是多头并行讨论。" },
  { category: "责任跟进", en: "The follow-up is more important than the meeting itself.", zh: "后续跟进比会议本身更重要。" },
  { category: "责任跟进", en: "Please tell me if I missed any important action.", zh: "如果我漏掉任何重要行动，请告诉我。" },
  { category: "责任跟进", en: "We can review the status again in the next meeting.", zh: "我们可以在下次会议再次评审状态。" },

  { category: "意式口头禅", en: "To me, this is the most pragmatic way to manage the situation.", zh: "我认为这是管理当前情况最务实的方式。" },
  { category: "意式口头禅", en: "Actually, the point is a little bit different.", zh: "其实重点有一点不一样。" },
  { category: "意式口头禅", en: "More or less, we are aligned, but there are still some details.", zh: "大体上我们是一致的，但还有一些细节。" },
  { category: "意式口头禅", en: "As a matter of fact, this was already discussed before.", zh: "事实上，这个之前已经讨论过。" },
  { category: "意式口头禅", en: "The idea is to avoid problems before they become urgent.", zh: "思路是在问题变紧急前先避免它。" },
  { category: "意式口头禅", en: "Because why? If we wait too long, we lose flexibility.", zh: "为什么呢？如果等太久，我们就失去灵活性。" },
  { category: "意式口头禅", en: "Of course, this is only my first view, and we can discuss.", zh: "当然，这只是我的初步看法，我们可以讨论。" },
  { category: "意式口头禅", en: "For some reason, the information is not fully consistent.", zh: "由于某些原因，这些信息并不完全一致。" },
  { category: "意式口头禅", en: "Let us say that this is the working direction for now.", zh: "我们暂且把这个作为目前的工作方向。" },
  { category: "意式口头禅", en: "I would say yes in principle, but we need to check the detail.", zh: "原则上我会说可以，但我们需要检查细节。" },

  { category: "听力确认", en: "Could you say again the last number?", zh: "你能再说一遍最后那个数字吗？" },
  { category: "听力确认", en: "Sorry, I missed the name of the owner.", zh: "不好意思，我没听清负责人名字。" },
  { category: "听力确认", en: "Can you repeat the timing, please?", zh: "你能重复一下时间安排吗？" },
  { category: "听力确认", en: "When you say next week, do you mean early next week or end of next week?", zh: "你说下周，是指下周初还是下周末？" },
  { category: "听力确认", en: "Let me check if I captured the three main points.", zh: "我确认一下我是否抓住了三个主要点。" },
  { category: "听力确认", en: "Can you spell the project name, please?", zh: "你能拼一下项目名吗？" },
  { category: "听力确认", en: "I understood the general logic, but I need help on the detail.", zh: "我理解了大体逻辑，但细节上需要你帮忙确认。" },
  { category: "听力确认", en: "Is this a decision, a proposal, or only an option?", zh: "这是决定、提案，还是只是一个选项？" },
  { category: "听力确认", en: "Could you write this point in the chat?", zh: "你能把这个点写在聊天里吗？" },
  { category: "听力确认", en: "I want to avoid misunderstanding, so I will confirm it once more.", zh: "我想避免误解，所以我再确认一次。" },

  { category: "汇报总结", en: "In summary, there are three open points and one confirmed action.", zh: "总结一下，有三个未解决点和一个已确认行动。" },
  { category: "汇报总结", en: "The conclusion is clear, but the implementation plan is still open.", zh: "结论是清楚的，但执行计划还未确定。" },
  { category: "汇报总结", en: "The risk is acceptable only if the timeline is protected.", zh: "只有时间线能被保护时，这个风险才可接受。" },
  { category: "汇报总结", en: "The next step is to collect the missing information and come back with a proposal.", zh: "下一步是收集缺失信息，并带着提案回来。" },
  { category: "汇报总结", en: "We agreed on the principle, but not yet on the detailed condition.", zh: "我们已就原则达成一致，但具体条件还没定。" },
  { category: "汇报总结", en: "The main message is that we need a decision before execution.", zh: "核心信息是执行前需要先有决定。" },
  { category: "汇报总结", en: "The discussion was useful because it clarified the real constraint.", zh: "这次讨论有用，因为它澄清了真正的限制。" },
  { category: "汇报总结", en: "I will send a short summary with actions, owners, and timing.", zh: "我会发送一份简短总结，包含行动、负责人和时间。" },
  { category: "汇报总结", en: "If there is any correction, please reply before the end of the day.", zh: "如果有任何更正，请在今天结束前回复。" },
  { category: "汇报总结", en: "From my side, the meeting is closed unless there is another urgent point.", zh: "从我这边看，如果没有其他紧急点，会议就可以结束。" },

  { category: "发音线索", en: "When they say 'cost', listen also for the sentence after it, because it may explain the reason.", zh: "当他们说 cost 时，也要听后面一句，因为后面可能解释原因。" },
  { category: "发音线索", en: "When you hear 'actually', do not stop there; the real point usually comes after it.", zh: "听到 actually 不要停在那里，真正重点通常在后面。" },
  { category: "发音线索", en: "When you hear 'more or less', prepare for an estimate or an uncertain number.", zh: "听到 more or less 时，准备听一个估算或不确定数字。" },
  { category: "发音线索", en: "When you hear 'the idea is', prepare for the strategy, not only the action.", zh: "听到 the idea is 时，准备听策略，而不只是行动。" },
  { category: "发音线索", en: "When you hear 'because why', the speaker is probably going to explain the business logic.", zh: "听到 because why 时，说话人很可能要解释业务逻辑。" },
  { category: "发音线索", en: "When the sentence is long, catch the nouns first: decision, number, owner, timing, risk.", zh: "句子很长时，先抓名词：决定、数字、负责人、时间、风险。" },
  { category: "发音线索", en: "If the grammar is not clean, focus on the direction: yes, no, risk, cost, timing.", zh: "如果语法不清楚，关注方向：同意、不同意、风险、成本、时间。" },
  { category: "发音线索", en: "Do not translate every word; translate the business intention.", zh: "不要翻译每个词，要翻译业务意图。" },
  { category: "发音线索", en: "Numbers are often the safest anchor in a difficult accent.", zh: "在难懂口音里，数字通常是最可靠的锚点。" },
  { category: "发音线索", en: "If you miss the verb, use the context to ask a confirmation question.", zh: "如果没听清动词，就用上下文问确认句。" },
];

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

function getLibraryCategories() {
  return ["全部", ...new Set(sentenceBank.map((item) => item.category))];
}

function renderCategoryTabs() {
  categoryTabs.innerHTML = "";
  getLibraryCategories().forEach((category) => {
    const button = document.createElement("button");
    button.className = `tab-btn${category === state.activeCategory ? " active" : ""}`;
    button.type = "button";
    button.textContent = category;
    button.addEventListener("click", () => {
      state.activeCategory = category;
      renderCategoryTabs();
      renderSentenceLibrary();
    });
    categoryTabs.appendChild(button);
  });
}

function renderSentenceLibrary() {
  const items =
    state.activeCategory === "全部"
      ? sentenceBank
      : sentenceBank.filter((item) => item.category === state.activeCategory);

  sentenceLibrary.innerHTML = "";
  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "sentence-card";

    const category = document.createElement("strong");
    category.textContent = `${index + 1}. ${item.category}`;

    const english = document.createElement("p");
    english.className = "en";
    english.textContent = item.en;

    const chinese = document.createElement("p");
    chinese.className = "zh";
    chinese.textContent = item.zh;

    card.append(category, english, chinese);
    sentenceLibrary.appendChild(card);
  });
}

function formatLibraryText() {
  return sentenceBank
    .map((item, index) => `${index + 1}. [${item.category}]\n${item.en}\n${item.zh}`)
    .join("\n\n");
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

analyzeBtn?.addEventListener("click", analyze);
copyCleanedBtn?.addEventListener("click", () => copyText(state.cleanedText, "先生成清洗文本。"));
exportBtn?.addEventListener("click", exportNotes);
copyLibraryBtn?.addEventListener("click", () => copyText(formatLibraryText(), "句库还没有加载。"));

renderCategoryTabs();
renderSentenceLibrary();
