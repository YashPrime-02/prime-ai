const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",

  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify({
    model: "qwen2.5:1.5b",
    prompt: "hello",
    stream: false,
  }),
});

const data = await response.json();

console.log(data.response);
