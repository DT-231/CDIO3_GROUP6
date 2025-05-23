const initToast = async () => {
  const toastModule = await import("./ToastNotification.js");
  toast = toastModule.toast;
  return toast;
};

// Call this to initialize toast
initToast();
const email = document.getElementById("email"); // radio email
const spanRadioEmail = document.getElementById("spanRadioEmail");

const sdt = document.getElementById("sdt"); // radio sdt
const spanRadioSdt = document.getElementById("spanRadioSdt");

const valueRegister = document.getElementById("valueRegister"); // input email/sdt
const LableValueRegister = document.getElementById("LableValueRegister"); // label input email/sdt
const errorMesageValueRegister = document.getElementById(
  "errorMesageValueRegister"
); // input email/sdt

// xử lý chọn nhập email hay số điện thoại
const handleOnChangeInputRegister = () => {
  // Reset input và label
  valueRegister.value = "";
  valueRegister.placeholder = sdt.checked ? "Nhập số điện thoại" : "Nhập email";
  LableValueRegister.textContent = sdt.checked
    ? "Nhập số điện thoại"
    : "Nhập email";
  errorMesageValueRegister.textContent = "";
  // Đổi màu text cho label radio
  if (sdt.checked) {
    spanRadioEmail.classList.remove("text-primary");
    spanRadioEmail.classList.add("text-black");
    spanRadioSdt.classList.add("text-primary");
    spanRadioSdt.classList.remove("text-black");
  } else {
    spanRadioEmail.classList.add("text-primary");
    spanRadioEmail.classList.remove("text-black");
    spanRadioSdt.classList.remove("text-primary");
    spanRadioSdt.classList.add("text-black");
  }
};

// nghe sự kiện chọn radio
sdt.addEventListener("change", handleOnChangeInputRegister);
email.addEventListener("change", handleOnChangeInputRegister);

// Xử lý chọn hình thức đăng ký (Email / SĐT)
// Reset input, đổi label, đổi placeholder, đổi màu label radio

// kiểm tra email
const isValidateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return false;
  return pattern.test(email);
};
// kiểm tra số điện thoại
const isValidPhoneNumber = (phoneNumber) => {
  const pattern = /^[0-9]{9,11}$/;
  if (!phoneNumber) return false;
  return pattern.test(phoneNumber);
};

const handleValidateValueRegister = () => {
  let check = sdt.checked
    ? isValidPhoneNumber(valueRegister.value)
    : isValidateEmail(valueRegister.value);
  let message = "";
  if (!check) {
    if (sdt.checked) {
      message = `Sai định dạng số điện thoại`;
    } else {
      message = `Sai định dạng Email`;
    }
  }
  console.log(message);

  errorMesageValueRegister.textContent = message;
  return check;
};

const handleBlurAndInput = (fieldInput, labelMessage) => {
  fieldInput.addEventListener("blur", () => {
    // Nếu không nhập gì (bỏ trống)
    if (fieldInput.value.trim() === "") {
      labelMessage.textContent = "Trường này không được để trống";
      fieldInput.classList.add("outline-red-500", "outline-3");
    }
  });

  fieldInput.addEventListener("input", () => {
    if (fieldInput.value.trim() !== "") {
      labelMessage.textContent = "";
      fieldInput.classList.remove("outline-red-500", "outline-3");
    }
  });
};

handleBlurAndInput(valueRegister, errorMesageValueRegister);
// Validate input (Email hoặc SĐT tuỳ radio đang chọn)
// Nếu sai định dạng thì hiện lỗi ở dưới input
valueRegister.addEventListener("input", handleValidateValueRegister);

// Reset lỗi khi người dùng nhập lại (ẩn lỗi + xoá viền đỏ)
// (gộp chung vào listener validate để tránh trùng code)
document.addEventListener("DOMContentLoaded", function () {
  if (valueRegister) {
    valueRegister.addEventListener("input", () => {
      // errorMesageValueRegister.textContent = "";
      valueRegister.classList.remove("outline-red-500", "outline-3");
    });
  }
});

//
const firstName = document.getElementById("firstName");
const errorMesageFirstName = document.getElementById("errorMesageFirstName");
const lastName = document.getElementById("lastName");
const errorMesageLastName = document.getElementById("errorMesageLastName");

// password
const password = document.getElementById("password"); //input password
const spanPassword = document.getElementById("hideShowPassword"); // span of password -> listen handle 'click'->hide/show password

const errorMesagePassword = document.getElementById("errorMesagePassword");
// repassword
const rePassword = document.getElementById("RePassword");
const spanRePassword = document.getElementById("hideShowRePassword");
const errorMesageRePassword = document.getElementById("errorMesageRePassword");

// GỌI 1 LẦN KHI LOAD TRANG

// hiện / ẩn mật khẩukhẩu
const togglePassword = (fieldInput, spanToggle) => {
  if (fieldInput.type === "password") {
    fieldInput.type = "text";
    spanToggle.textContent = "😳";
  } else {
    fieldInput.type = "password";
    spanToggle.textContent = "🫣";
  }
};

const handleOnChangePassword = (fieldInput, spanToggle) => {
  const passwordValue = fieldInput.value;
  if (passwordValue.trim() === "") {
    spanToggle.textContent = "";
  } else {
    fieldInput.type = "password";
    spanToggle.textContent = "🫣";
  }
};

const setupPassword = (fieldInput, spanToggle, errorMessageLabel) => {
  fieldInput.addEventListener("input", () => {
    errorMessageLabel.textContent = "";
    fieldInput.classList.remove("outline-red-500", "outline-3");
    handleOnChangePassword(fieldInput, spanToggle);
  });

  spanToggle.addEventListener("click", () => {
    togglePassword(fieldInput, spanToggle);
  });
};

const checkRePasswordLikePassword = () => {
  const valuePassword = password.value;
  const valueRePassword = rePassword.value;

  if (valueRePassword !== valuePassword) {
    rePassword.classList.add("outline-red-500", "outline-3");
    errorMesageRePassword.textContent = "Chưa khớp với mật khẩu";
    return false;
  }
  return true;
};

// password blur trước (1)

handleBlurAndInput(password, errorMesagePassword);
handleBlurAndInput(rePassword, errorMesageRePassword);
// set up passwod (2)
setupPassword(password, spanPassword, errorMesagePassword);
setupPassword(rePassword, spanRePassword, errorMesageRePassword);
// lắng nghe nhập (3)
rePassword.addEventListener("input", checkRePasswordLikePassword);

handleOnChangeInputRegister();

handleBlurAndInput(firstName, errorMesageFirstName);
handleBlurAndInput(lastName, errorMesageLastName);

const postData = async (body) => {
  let url1 = "https://backend-cdio3.onrender.com";
  let url2 = "http://127.0.0.1:8000";
  const response = await fetch(`${url1}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    // Lỗi server hoặc validate, ném lỗi ra ngoài
    const error = await response.text();
    throw new Error(error);
  }

  const data = await response.json();
  return data;
};

const handleSubmit = async () => {
  let check =
    firstName.value.trim() !== "" &&
    lastName.value.trim() !== "" &&
    password.value.trim() !== "" &&
    rePassword.value.trim() !== "";
  if (!check) {
    return;
  }
  body = {
    firstName: firstName.value,
    lastName: lastName.value,
    password: password.value,
    roleId: 1,
  };

  if (sdt.checked) {
    body["phoneNumber"] = valueRegister.value;
    // body["email"] = "";
  } else {
    // body["phoneNumber"] = "";
    body["email"] = valueRegister.value;
  }

  // fetch data cho server
  const result = await postData(body);
  if (+result.code === 0) {
    toast.success(result.message);
    window.location.href = "/login.html";
  } else {
    toast.error(result.message);
  }
};
