const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");

/* System prompt */
const systemPrompt = `
You are a helpful beauty assistant for L'Oréal.

You only answer questions about:
- L'Oréal products
- skincare
- makeup
- haircare
- beauty routines

If a question is not about beauty or L'Oréal, say:
"I'm here to help with L'Oréal beauty products and routines!"

Keep answers simple, friendly, and helpful.
`;

/* conversation memory (extra credit) */
let messages = [
  { role: "system", content: systemPrompt }
];

/* initial message */
chatWindow.innerHTML = `<div class="bot-msg"> Yo! Ask me anything about L'Oréal beauty products.</div>`;

/* Worker URL (REPLACE THIS) */
const WORKER_URL = "https://loreal-chatbot.jude-nadar4.workers.dev";

/* send message */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userText = userInput.value.trim();
  if (!userText) return;

  /* show latest question */
  latestQuestion.textContent = "You asked: " + userText;

  /* show user message */
  chatWindow.innerHTML += `<div class="user-msg">${userText}</div>`;
  userInput.value = "";

  /* save to memory */
  messages.push({ role: "user", content: userText });

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();

    const botReply = data.reply;

    /* save assistant reply */
    messages.push({ role: "assistant", content: botReply });

    /* show bot message */
    chatWindow.innerHTML += `<div class="bot-msg">${botReply}</div>`;

    chatWindow.scrollTop = chatWindow.scrollHeight;

  } catch (error) {
    console.error(error);
    chatWindow.innerHTML += `<div class="bot-msg"> theres an connecting to server.</div>`;
  }
});