const logos = {
  ksa: "ksa.jpg",
  uae: "uae.jpg",
  school: "uae.jpg",
  police: "police.webp",
  oman: "oman-ecity.png",
  guard: "guard.png",
  dhr: "dhr.jpg",
  sedd: "sedd.png",
  dewa: "dewa-clean.jpg",
  aramco: "aramco.jpg",
  eand: "eand.png",
  hrsd: "hrsd.webp"
};

for (const badge of document.querySelectorAll("[data-logo]")) {
  const filename = logos[badge.dataset.logo];
  if (!filename) continue;

  const image = new Image();
  image.alt = "";
  image.addEventListener("load", () => {
    badge.replaceChildren(image);
  }, { once: true });
  image.src = `logos/${filename}`;
}

const courses = [...document.querySelectorAll('.course-card')];
const organizationGroups = new Map();
const organizationGrid = document.querySelector('.org-grid');
for (const course of courses) {
  const organization = course.dataset.org;
  let group = organizationGroups.get(organization);
  if (!group) {
    group = document.createElement('article');
    group.className = 'org organization-group';
    group.dataset.org = organization;
    const header = course.querySelector('header');
    const courseList = document.createElement('div');
    courseList.className = 'organization-courses';
    group.append(header, courseList);
    organizationGrid.append(group);
    organizationGroups.set(organization, group);
  } else {
    course.querySelector('header').remove();
  }
  course.classList.remove('org');
  course.querySelector('.course-tag').remove();
  group.querySelector('.organization-courses').append(course);
}

const chatToggle = document.querySelector('#ai-chat-toggle');
const chatPanel = document.querySelector('#ai-chat-panel');
const chatClose = document.querySelector('#ai-chat-close');
const chatForm = document.querySelector('#ai-chat-form');
const chatInput = document.querySelector('#ai-chat-input');
const chatMessages = document.querySelector('#ai-chat-messages');
const chatCopy = {
  en: {
    label: 'Ask AI about Ahmed',
    kicker: 'Portfolio assistant',
    title: 'Ask AI about Ahmed',
    welcome: 'Hi! Ask me about Ahmed’s experience, projects, or training.',
    close: 'Close chat',
    placeholder: 'Ask a question...',
    inputLabel: 'Your question',
    send: 'Send',
    note: "AI responses need a secure server connection. Messages aren't sent or stored yet.",
    notConnected: "Your message wasn't sent because the AI service isn't connected yet."
  },
  ar: {
    label: 'اسأل الذكاء الاصطناعي عن أحمد',
    kicker: 'مساعد الملف المهني',
    title: 'اسأل الذكاء الاصطناعي عن أحمد',
    welcome: 'مرحبًا! اسألني عن خبرة أحمد أو مشاريعه أو تدريبه.',
    close: 'إغلاق المحادثة',
    placeholder: 'اكتب سؤالك...',
    inputLabel: 'سؤالك',
    send: 'إرسال',
    note: 'الردود تحتاج إلى ربط آمن بخادم. لا تُرسل الرسائل أو تُحفظ حاليًا.',
    notConnected: 'لم تُرسل رسالتك لأن خدمة الذكاء الاصطناعي غير متصلة بعد.'
  }
};

function updateChatLanguage() {
  const copy = chatCopy[document.documentElement.lang === 'ar' ? 'ar' : 'en'];
  chatToggle.setAttribute('aria-label', copy.label);
  chatToggle.querySelector('.ai-chat-tooltip').textContent = copy.label;
  document.querySelector('#ai-chat-kicker').textContent = copy.kicker;
  document.querySelector('#ai-chat-title').textContent = copy.title;
  document.querySelector('#ai-chat-welcome').textContent = copy.welcome;
  chatClose.setAttribute('aria-label', copy.close);
  chatInput.setAttribute('aria-label', copy.inputLabel);
  chatInput.placeholder = copy.placeholder;
  document.querySelector('#ai-chat-send').textContent = copy.send;
  document.querySelector('#ai-chat-note').textContent = copy.note;
}

function setChatOpen(open) {
  chatPanel.hidden = !open;
  chatToggle.setAttribute('aria-expanded', String(open));
  if (open) chatInput.focus();
  else chatToggle.focus();
}

function appendChatMessage(text, type) {
  const message = document.createElement('p');
  message.className = `ai-chat-bubble ai-chat-${type}`;
  message.textContent = text;
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatToggle.addEventListener('click', () => setChatOpen(chatPanel.hidden));
chatClose.addEventListener('click', () => setChatOpen(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !chatPanel.hidden) setChatOpen(false);
});
document.addEventListener('portfolio-language', updateChatLanguage);
updateChatLanguage();

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  appendChatMessage(question, 'user');
  chatInput.value = '';
  const copy = chatCopy[document.documentElement.lang === 'ar' ? 'ar' : 'en'];
  appendChatMessage(copy.notConnected, 'assistant');
});
