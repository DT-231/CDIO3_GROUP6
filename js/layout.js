// layout.js 
// Lắng nghe sự kiện load DOM
document.addEventListener("DOMContentLoaded", function () {
  // Tải header
  fetch("./components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-container").innerHTML = data;
    })
    .catch((error) => console.error("Không thể tải header:", error));

  // Tải footer
  fetch("./components/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-container").innerHTML = data;
    })
    .catch((error) => console.error("Không thể tải footer:", error));
});
