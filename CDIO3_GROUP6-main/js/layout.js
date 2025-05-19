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
// Xử lý nút tìm kiếm
function handleSubmit() {
  const location = document.getElementById("searchLocation").value;
  const persons = document.getElementById("inputQtyPerson").value;
  const checkIn = document.getElementById("InputcheckIn").value;
  const checkOut = document.getElementById("InputcheckOut").value;

  if (!location || !checkIn || !checkOut) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // Hiển thị dữ liệu đã nhập - bạn có thể thay đổi logic này để tìm kiếm thực tế
  console.log("Tìm kiếm:", {
    location,
    persons,
    checkIn,
    checkOut,
  });

  alert(
    `Tìm kiếm: ${location}, ${persons} người, từ ${checkIn} đến ${checkOut}`
  );
}
