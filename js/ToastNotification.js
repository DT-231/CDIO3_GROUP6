// ToastNotification.js - Module Toast Notification đơn giản

const toastBox =
  document.getElementById("toastBox") ||
  (() => {
    // Tạo toastBox nếu không tồn tại
    const box = document.createElement("div");
    box.id = "toastBox";
    box.className = "fixed top-8 right-4 flex flex-col items-end gap-4 z-50";
    document.body.appendChild(box);
    return box;
  })();

const errorIcon = `<svg
      fill="#ff0000"
      width="24px"
      height="24px"
      viewBox="0 0 19.00 19.00"
      xmlns="http://www.w3.org/2000/svg"
      class="cf-icon-svg"
      stroke="#ff0000"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
      </g>
    </svg>
  `;

const successIcon = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class="text-green-500"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  `;

export const showToast = (msg, typeMsg = "success") => {
  const toastType = typeMsg.toLowerCase(); // Sửa lỗi: .toLowerCase() thay vì .lower()

  const toast = document.createElement("div");
  toast.className = `w-[400px] h-[80px] relative bg-white font-medium my-4 shadow-md flex items-center rounded-md overflow-hidden`;

  // Thêm phần tử con cho progress bar thay vì dùng ::after
  const progressClass =
    toastType === "success"
      ? "bg-green-500 animate-progress"
      : "bg-red-500 animate-progress";

  toast.innerHTML = `
      <div class="p-4 flex items-center gap-3 w-full">
        <div class="shrink-0">
          ${toastType === "success" ? successIcon : errorIcon}
        </div>
        <div>
          <div class="font-medium">${msg}</div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 h-[5px] w-full ${progressClass} animate-progress"></div>
    `;

  toastBox.appendChild(toast);

  // Remove toast after animation completes
  setTimeout(() => {
    toast.classList.add("opacity-0", "transition-opacity", "duration-300");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2000);

  return toast;
};

// Thêm phương thức tiện ích
export const toast = {
  success: (msg) => showToast(msg, "success"),
  error: (msg) => showToast(msg, "error"),
};

// Export default
export default { showToast, ...toast };
