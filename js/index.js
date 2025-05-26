const initToast = async () => {
  const toastModule = await import("./ToastNotification.js");
  toast = toastModule.toast;
  return toast;
};

initToast();
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
    toast.error("Chưa chọn ngày check out");
    return;
  }

  const checkIn = new Date(inputcheckIn.value);
  const checkOut = new Date(inputcheckOut.value);

  if (checkIn > checkOut) {
    inputcheckOut.value = "";
    toast.error("Ngày check out phải trễ hơn check int");
  }
};

const validateCheckIn = () => {
  const checkIn = new Date(inputcheckIn.value);
  const formattedToday = new Date().toISOString().split("T")[0];
  if (checkIn < formattedToday) {
    inputcheckIn.value = "";
    toast.error("Bạn đang chọn ngày trong quá khứ ");
  }
};

const btnSearch = document.getElementById("btnSearch");

const handleSubmit = () => {
  let searchLocation = document.getElementById("searchLocation");
  if (searchLocation.value.trim() === "") {
    toast.error("Mời nhập nơi đến");
    return;
  }
  if (!inputcheckIn.value || !inputcheckOut.value) {
    toast.error("Chưa chọn ngày checkOut");
    return;
  }
  if (inputcheckIn.value === inputcheckOut.value) {
    toast.error("Ngày check out phải lớn hơn ngày check in ");
    return;
  }
  if (inputQtyPerson.value <= 0) {
    return;
  }

  window.location.href = `search.html?searchLocation=${
    searchLocation.value
  }&personQty=${inputQtyPerson.value}&checkIn=${inputcheckIn.value}&checkOut=${
    inputcheckOut.value
  }&page=${1}`;
};
