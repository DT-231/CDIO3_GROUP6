
const spanText = document.getElementById("hideShowPassword");
const errorMesageValueLogin = document.getElementById("errorMesageValueLogin");
const errorMesagePassword = document.getElementById("errorMesagePassword");
const passwordField = document.getElementById("password");

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

const validateValueLogin = () => {
  const valueLogin = document.getElementById("valueLogin");

  const isCheckEmail = isValidateEmail(valueLogin.value);
  const isCheckPhoneNumber = isValidPhoneNumber(valueLogin.value);

  if (!isCheckEmail && !isCheckPhoneNumber) {
    errorMesageValueLogin.textContent = "Sai định dạng";
    valueLogin.classList.add("outline-red-500", "outline-3");
    return false;
  }
  return true;
};

const validatePassword = () => {
  const passwordField = document.getElementById("password");

  if (passwordField.value.length < 8) {
    errorMesagePassword.textContent = "Mật khẩu phải ít nhất 8 chữ số";
    passwordField.classList.add("outline-red-500", "outline-3");
  }
};

const handleSubmit = () => {
  let check = validateValueLogin();
  let checkPassword = validatePassword();

  // Nếu cả 2 điều kiện đều hợp lệ, cho phép submit
  if (check && checkPassword) {
    console.log("Form hợp lệ, tiến hành submit");
    // Gửi form hoặc tiếp tục xử lý
  } else {
    console.log("Form không hợp lệ");
  }
};
