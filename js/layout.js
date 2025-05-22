//layout.js

const checkLocalStorage = () => {
  let account = localStorage.getItem("user");
  if (account) {
    return JSON.parse(account);
  } else {
    return false;
  }
};

function renderUserBox() {
  const userBox = document.getElementById("user-box");
  if (!userBox) return;

  let account = checkLocalStorage();
  if (account) {
    userBox.innerHTML = `<a
      class="bg-white w-[50px] h-[50px] rounded-full font-openSans font-bold text-primary text-2xl cursor-pointer hover:border-2 hover:border-white hover:bg-blue-500 hover:text-white duration-200 ease-out hover:scale-110 block flex justify-center items-center"
      title="Thông tin cá nhân">
      <i class="fa-solid fa-user"></i>
    </a>
    <span class="bg-white w-[200px] h-[50px] rounded-full font-openSans font-bold text-primary cursor-pointer hover:border-2 hover:border-white hover:bg-blue-500 hover:text-white duration-200 ease-out hover:scale-110 px-3 leading-[50px] truncate text-center">
      ${account.lastName} ${account.firstName}
    </span>`;
  } else {
    userBox.innerHTML = `<a
      class="bg-white w-[120px] h-[50px] rounded-full font-openSans font-bold text-primary cursor-pointer hover:border-2 hover:border-white hover:bg-blue-500 hover:text-white duration-200 ease-out hover:scale-110 block flex justify-center items-center"
      href="../login.html">
      Đăng nhập
    </a>
    <a
      class="bg-white w-[120px] h-[50px] rounded-full font-openSans font-bold text-primary cursor-pointer hover:border-2 hover:border-white hover:bg-blue-500 hover:text-white duration-200 ease-out hover:scale-110 block flex justify-center items-center"
      href="../register.html">
      Đăng ký
    </a>`;
  }
}
// Lắng nghe sự kiện load DOM
document.addEventListener("DOMContentLoaded", function () {
  // Tải header
  fetch("./components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-container").innerHTML = data;
      renderUserBox();
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
