const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");

/* System prompt (L'Oréal-only assistant) */
const systemPrompt = `
You are a helpful beauty assistant for L'Oréal.

You only answer questions about:
- L'Oréal products
- skincare
- makeup
- haircare
- fragrances
- beauty routines

If a user asks something unrelated, reply:
"I'm here to help with L'Oréal products and beauty advice."

Keep answers short, clear, and helpful.
`;

/* Conversation history */
let messages = [
  { role: "system", content: systemPrompt }
];

/* Initial message */
chatWindow.innerHTML = `<div class="bot-msg">Hi! Ask me anything about L'Oréal products 💄</div>`;

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userText = userInput.value.trim();
  if (!userText) return;

  /* show latest question */
  if (latestQuestion) {
    latestQuestion.textContent = "You asked: " + userText;
  }

  /* display user message */
  chatWindow.innerHTML += `<div class="user-msg">${userText}</div>`;

  userInput.value = "";

  /* save user message */
  messages.push({ role: "user", content: userText });

  try {
    const response = await fetch("https://loreal-chatbot.jude-nadar4.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();

    // Cloudflare returns OpenAI format:
    const botReply = data.choices?.[0]?.message?.content || "Sorry, something went wrong.";

    /* save assistant reply */
    messages.push({ role: "assistant", content: botReply });

    /* display bot message */
    chatWindow.innerHTML += `<div class="bot-msg">${botReply}</div>`;

    chatWindow.scrollTop = chatWindow.scrollHeight;

  } catch (error) {
    console.error(error);
    chatWindow.innerHTML += `<div class="bot-msg">Error connecting to chatbot.</div>`;
  }
});