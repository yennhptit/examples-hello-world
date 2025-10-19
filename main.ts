// main.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("critique-form");
  const input = document.getElementById("text-input");
  const resultDiv = document.getElementById("result");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) {
      alert("Vui lòng nhập văn bản để polish!");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Đang xử lý...";

    try {
      const response = await fetch("/api/polish-critique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (response.ok) {
        resultDiv.textContent = data.polishedText;
      } else {
        resultDiv.textContent = `❌ Lỗi: ${data.error || "Không xác định"}`;
      }
    } catch (err) {
      console.error("Error:", err);
      resultDiv.textContent = `❌ Lỗi kết nối: ${err.message}`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Gửi";
    }
  });
});
