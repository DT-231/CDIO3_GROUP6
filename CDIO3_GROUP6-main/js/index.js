// index.js
const inputQtyPerson = document.getElementById("inputQtyPerson");

// Giảm số lượng người
const handleDecrement = () => {
  let currentValue = parseInt(inputQtyPerson.value, 10);

  if (currentValue > 1) {
    currentValue--;
    inputQtyPerson.value = currentValue;
  } else {
    alert("Số lượng người không thể ít hơn 1");
  }
};

// Tăng số lượng người ở
const handleIncrement = () => {
  let currentValue = parseInt(inputQtyPerson.value, 10);
  currentValue++;
  inputQtyPerson.value = currentValue;
};

const inputcheckIn = document.getElementById("InputcheckIn");
const inputcheckOut = document.getElementById("InputcheckOut");

window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  inputcheckIn.min = today;
  inputcheckIn.value = today;
  inputcheckOut.min = today;
});

const validateDateRange = () => {
  if (!inputcheckIn.value || !inputcheckOut.value) {
    // Không kiểm tra nếu chưa chọn đủ 2 ngày
    return;
  }

  const checkIn = new Date(inputcheckIn.value);
  const checkOut = new Date(inputcheckOut.value);

  if (checkIn > checkOut) {
    inputcheckOut.value = "";
    alert("Ngày check out phải trễ hơn check int");
  }
};

const validateCheckIn = () => {
  const checkIn = new Date(inputcheckIn.value);
  const formattedToday = new Date().toISOString().split("T")[0];
  if (checkIn < formattedToday) {
    inputcheckIn.value = "";
    alert("Bạn đang chọn ngày trong quá khứ ");
  }
};

const btnSearch = document.getElementById("btnSearch");

const handleSubmit = () => {
  let searchLocation = document.getElementById("searchLocation");
  if (searchLocation.value.trim() === "") {
    return;
  }
  if (!inputcheckIn.value || !inputcheckOut.value) {
    return;
  }
  if (inputQtyPerson <= 0) {
    return;
  }
  console.log(searchLocation.value);
};
