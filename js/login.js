let data;
let user;
let spanText;
let errorMesageValueLogin;
let errorMesagePassword;
let passwordField;
let valueLogin;
let toast;

// Function to initialize Toast from module
const initToast = async () => {
  const toastModule = await import("./ToastNotification.js");
  toast = toastModule.toast;
  return toast;
};

// Call this to initialize toast
initToast();

// Initialize DOM references
const initDomElements = () => {
  spanText = document.getElementById("hideShowPassword");
  errorMesageValueLogin = document.getElementById("errorMesageValueLogin");
  errorMesagePassword = document.getElementById("errorMesagePassword");
  passwordField = document.getElementById("password");
  valueLogin = document.getElementById("valueLogin");
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
  if (!passwordField) passwordField = document.getElementById("password");
  if (!spanText) spanText = document.getElementById("hideShowPassword");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    spanText.textContent = "😳";
  } else {
    passwordField.type = "password";
    spanText.textContent = "🫣";
  }
};

const loadPage = () => {
  // Kiểm tra xem DOM đã sẵn sàng chưa
  if (document.readyState === "loading") {
    // Nếu chưa, đăng ký sự kiện để thực hiện sau
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    // Nếu đã sẵn sàng, thực hiện ngay
    initPage();
  }
};

const initPage = () => {
  initDomElements();
  let path = window.location.pathname;
  if (path.includes("/login.html")) {
    let checkUser = localStorage.getItem("user");
    if (checkUser) {
      window.location.href = "/index.html";
    } else {
      let account = localStorage.getItem("account");
      if (account) {
        account = JSON.parse(account);
        valueLogin.value = account.valueLogin;
        passwordField.value = account.password;
      }
    }
  }
};

// Gọi loadPage() ở đây vẫn ổn vì chúng ta đã thêm logic kiểm tra DOM
loadPage();
document.addEventListener("DOMContentLoaded", function () {
  initDomElements();
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
  if (!valueLogin) valueLogin = document.getElementById("valueLogin");
  if (!errorMesageValueLogin)
    errorMesageValueLogin = document.getElementById("errorMesageValueLogin");

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
  if (!passwordField) passwordField = document.getElementById("password");
  if (!errorMesagePassword)
    errorMesagePassword = document.getElementById("errorMesagePassword");

  if (passwordField.value.length < 8) {
    errorMesagePassword.textContent = "Mật khẩu phải ít nhất 8 chữ số";
    passwordField.classList.add("outline-red-500", "outline-3");
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (!valueLogin) valueLogin = document.getElementById("valueLogin");
  if (!passwordField) passwordField = document.getElementById("password");
  const rememberLogin = document.getElementById("rememberLogin");

  let check = validateValueLogin();
  let checkPassword = validatePassword();

  console.log("vao login");

  // Nếu cả 2 điều kiện đều hợp lệ, cho phép submit
  if (check && checkPassword) {
    let account = {
      valueLogin: valueLogin.value,
      password: passwordField.value,
    };
    if (rememberLogin.checked) {
      localStorage.setItem("account", JSON.stringify(account));
    }
    let body = {
      valueLogin: valueLogin.value,
      password: passwordField.value,
    };
    const result = await FetchLogin(body);
    if (+result.code === 0) {
      data = result.data;
      user = {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roleId: data.roleId,
      };
      localStorage.setItem("user", JSON.stringify(user));

      // Ensure toast is initialized before using it
      if (!toast) {
        const toastModule = await import("./ToastNotification.js");
        toast = toastModule.toast;
      }

      toast.success(result.message);
      let baseUrl =
        window.location.origin +
        window.location.pathname.split("/").slice(0, 2).join("/") +
        "/";
      //fix chỗ này
      console.log(baseUrl);

      window.location.href = "../";
    } else {
      if (!toast) {
        const toastModule = await import("./ToastNotification.js");
        toast = toastModule.toast;
      }
      toast.error(result.message);
    }
  } else {
    console.log("Form không hợp lệ");
  }
};

const FetchLogin = async (body) => {
  try {
    let url1 = "https://backend-cdio3.onrender.com";

    const response = await fetch(`${url1}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  } catch (error) {
    console.error("Login error:", error);
    return { code: -1, message: "Đã xảy ra lỗi khi đăng nhập" };
  }
};

// Make functions available globally
window.handleOnChangePassword = handleOnChangePassword;
window.togglePassword = togglePassword;
window.handleSubmit = handleSubmit;
