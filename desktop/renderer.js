function sendQuestion() {
  window.electronAPI.sendNotification("Question time!", "What is the capital of France?");
}
