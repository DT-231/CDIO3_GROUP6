const sdt = document.getElementById("sdt");
const email = document.getElementById("email");
const LableValueLogin = document.getElementById("LableValueLogin");
const valueLogin = document.getElementById("valueLogin");
const passwordField = document.getElementById("password");
const spanText = document.getElementById("hideShowPassword");
const errorMesagePassword = document.getElementById("errorMesagePassword");

const handleOnChangeInputRegister = () => {
  valueLogin.value = "";
  valueLogin.placeholder = sdt.checked ? "Nhập số điện thoại" : "Nhập email";
  LableValueLogin.textContent = sdt.checked
    ? "Nhập số điện thoại"
    : "Nhập email";
};

// nghe sự kiện chọn radio
sdt.addEventListener("change", handleOnChangeInputRegister);
email.addEventListener("change", handleOnChangeInputRegister);

// GỌI 1 LẦN KHI LOAD TRANG
handleOnChangeInputRegister();

const isValidateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return false;
  return pattern.test(email);
};

const isValidPhoneNumber = (phoneNumber) => {
  const pattern = /^[0-9]{9,11}$/;
  if (!phoneNumber) return false;
  return pattern.test(phoneNumber);
};

const handleOnChangePassword = () => {
  const passwordValue = passwordField.value;
  if (passwordValue.trim() === "") {
    spanText.textContent = "";
    return;
  } else {
    passwordField.type = "password";
    spanText.textContent = "🫣";
  }
  // togglePassword(passwordField, spanText);
};

const togglePassword = () => {
  if (passwordField.type === "password") {
    passwordField.type = "text";
    spanText.textContent = "😳";
  } else {
    passwordField.type = "password";
    spanText.textContent = "🫣";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const valueLogin = document.getElementById("valueLogin");

  if (passwordField) {
    passwordField.addEventListener("input", () => {
      errorMesagePassword.textContent = "";
      passwordField.classList.remove("outline-red-500", "outline-3");
      handleOnChangePassword();
    });
  }

  if (valueLogin) {
    valueLogin.addEventListener("input", () => {
      errorMesageValueLogin.textContent = "";
      valueLogin.classList.remove("outline-red-500", "outline-3");
    });
  }
});
