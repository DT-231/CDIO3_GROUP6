const API_BASE_URL = "https://backend-cdio3.onrender.com";

let DOM_ELEMENTS = {};

let galleryState = {
  images: [],
  currentIndex: 0,
  maxVisibleImages: 6,
};

function convertDropboxUrl(url) {
  if (!url || !url.includes("dropbox.com")) return url;
  return url.replace("dl=0", "raw=1");
}

function showLoader() {
  if (DOM_ELEMENTS.pageLoader) {
    DOM_ELEMENTS.pageLoader.style.display = "flex";
  }
}

function hideLoader() {
  if (DOM_ELEMENTS.pageLoader) {
    DOM_ELEMENTS.pageLoader.style.display = "none";
  }
}

function getRoomIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("roomId");
}

async function fetchRoomData() {
  showLoader();
  try {
    const roomId = getRoomIdFromUrl();
    if (!roomId) {
      throw new Error("Room ID is missing from URL");
    }

    const response = await fetch(
      `${API_BASE_URL}/room/read-detail?roomId=${roomId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    if (+result.code !== 0) {
      throw new Error(result.message || "Error fetching room data");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching room data:", error);
    displayErrorMessage("Không thể tải thông tin phòng. Vui lòng thử lại sau.");
    return null;
  } finally {
    hideLoader();
  }
}

function displayErrorMessage(message) {
  const errorElement = document.createElement("div");
  errorElement.className =
    "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative";
  errorElement.textContent = message;

  const mainContent = document.querySelector("main");
  if (mainContent) {
    mainContent.prepend(errorElement);
  }
}

function updateRoomDetails(room, location) {
  // Update hotel name
  if (DOM_ELEMENTS.name) {
    DOM_ELEMENTS.name.textContent = room.name;
  }

  // Update location with Google Maps link
  if (DOM_ELEMENTS.position) {
    const locationText = `${location.address}, ${location.district}, ${location.city}, ${location.country}`;
    DOM_ELEMENTS.position.innerHTML = `<span class="hover:underline underline-offset-2 cursor-pointer">${locationText}</span>`;

    // Add Google Maps link
    DOM_ELEMENTS.position.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${room.name}+${locationText}`
    )}`;
    DOM_ELEMENTS.position.target = "_blank";
    DOM_ELEMENTS.position.rel = "noopener noreferrer";
  }

  // Update room price
  if (DOM_ELEMENTS.roomPrice && room.price) {
    DOM_ELEMENTS.roomPrice.textContent =
      new Intl.NumberFormat("vi-VN").format(room.price) + " ₫";
  }

  // Update description
  if (DOM_ELEMENTS.description) {
    // Clear existing content
    DOM_ELEMENTS.description.innerHTML = "";

    // Split description into paragraphs and create elements
    const paragraphs = room.description.split("\n\n");
    paragraphs.forEach((paragraph) => {
      const p = document.createElement("p");
      p.className = "text-neutral-500";
      p.textContent = paragraph;
      DOM_ELEMENTS.description.appendChild(p);
    });
  }
}

// Image Gallery Functions
function initializeImageGallery(primaryImage, additionalImages) {
  // Prepare images for gallery
  galleryState.images = [primaryImage, ...additionalImages];

  // Remove duplicates if any
  galleryState.images = [...new Set(galleryState.images)];

  // Render initial gallery
  renderGalleryImages();

  // Setup event listeners
  setupGalleryEventListeners();
}

function renderGalleryImages() {
  const container = DOM_ELEMENTS.imageContainer;
  container.innerHTML = "";

  galleryState.images.forEach((url, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "relative cursor-pointer";

    const img = document.createElement("img");
    img.src = convertDropboxUrl(url);
    img.className = "w-full h-40 object-cover img-hover";
    img.alt = `Ảnh ${index + 1}`;
    img.addEventListener("click", () => openGalleryModal(index));
    img.addEventListener("load", () => {
      img.classList.add("loaded");
    });
    wrapper.appendChild(img);

    if (
      index === galleryState.maxVisibleImages - 1 &&
      galleryState.images.length > galleryState.maxVisibleImages
    ) {
      const overlay = document.createElement("div");
      overlay.className =
        "absolute inset-0 bg-black/30 text-white flex items-center justify-center text-2xl font-bold rounded-lg transition hover:bg-opacity-80";
      overlay.textContent = `+${
        galleryState.images.length - galleryState.maxVisibleImages
      }`;
      overlay.addEventListener("click", showAllGalleryImages);
      wrapper.appendChild(overlay);
    }

    if (index >= galleryState.maxVisibleImages) {
      wrapper.classList.add("hidden");
    }

    container.appendChild(wrapper);
  });
}

function showAllGalleryImages() {
  const container = DOM_ELEMENTS.imageContainer;
  container.querySelectorAll("div.hidden").forEach((el) => {
    el.classList.remove("hidden");
  });

  const overlay = container.querySelector("div > div.absolute");
  if (overlay) overlay.remove();
}

function createGalleryThumbnails() {
  const container = DOM_ELEMENTS.thumbnailsContainer;
  container.innerHTML = "";

  galleryState.images.forEach((url, index) => {
    const thumb = document.createElement("div");
    thumb.className = `w-16 h-16 flex-shrink-0 cursor-pointer ${
      index === galleryState.currentIndex ? "ring-2 ring-blue-500" : ""
    }`;

    const img = document.createElement("img");
    img.src = convertDropboxUrl(url);
    img.className = "w-full h-full object-cover rounded";
    img.alt = `Thumbnail ${index + 1}`;
    img.addEventListener("click", () => {
      galleryState.currentIndex = index;
      updateModalImage();
    });

    thumb.appendChild(img);
    container.appendChild(thumb);
  });

  // Scroll to center the current thumbnail
  const thumbs = container.querySelectorAll("div");
  if (thumbs[galleryState.currentIndex]) {
    thumbs[galleryState.currentIndex].scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
}

function updateModalImage() {
  // Show loading indicator
  DOM_ELEMENTS.modalImg.classList.add("hidden");

  // Update counter
  DOM_ELEMENTS.imageCounter.textContent = `${galleryState.currentIndex + 1}/${
    galleryState.images.length
  }`;

  // Preload image
  const img = new Image();
  img.onload = function () {
    DOM_ELEMENTS.modalImg.src = convertDropboxUrl(
      galleryState.images[galleryState.currentIndex]
    );
    DOM_ELEMENTS.modalImg.classList.remove("hidden");

    // Update thumbnails
    const thumbs = DOM_ELEMENTS.thumbnailsContainer.querySelectorAll("div");
    thumbs.forEach((thumb, idx) => {
      if (idx === galleryState.currentIndex) {
        thumb.classList.add("ring-2", "ring-blue-500");
        thumb.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      } else {
        thumb.classList.remove("ring-2", "ring-blue-500");
      }
    });
  };
  img.src = convertDropboxUrl(galleryState.images[galleryState.currentIndex]);
}

function openGalleryModal(index) {
  galleryState.currentIndex = index;
  DOM_ELEMENTS.imageModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  createGalleryThumbnails();
  updateModalImage();

  // Add active class to modal for animations
  DOM_ELEMENTS.imageModal.classList.add("flex");
}

function closeGalleryModal() {
  DOM_ELEMENTS.imageModal.classList.remove("flex");
  DOM_ELEMENTS.imageModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function showPrevImage() {
  galleryState.currentIndex =
    (galleryState.currentIndex - 1 + galleryState.images.length) %
    galleryState.images.length;
  updateModalImage();
}

function showNextImage() {
  galleryState.currentIndex =
    (galleryState.currentIndex + 1) % galleryState.images.length;
  updateModalImage();
}

function setupGalleryEventListeners() {
  // Basic controls
  DOM_ELEMENTS.closeModalBtn.addEventListener("click", closeGalleryModal);
  DOM_ELEMENTS.prevBtn.addEventListener("click", showPrevImage);
  DOM_ELEMENTS.nextBtn.addEventListener("click", showNextImage);

  // Close on click outside
  DOM_ELEMENTS.imageModal.addEventListener("click", (e) => {
    if (e.target === DOM_ELEMENTS.imageModal) closeGalleryModal();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (DOM_ELEMENTS.imageModal.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft") showPrevImage();
    if (e.key === "ArrowRight") showNextImage();
    if (e.key === "Escape") closeGalleryModal();
  });

  // Touch swipe handling
  setupTouchNavigation();

  // Mouse swipe handling
  setupMouseNavigation();
}

function setupTouchNavigation() {
  let startX = 0;
  let startY = 0;
  let moved = false;

  DOM_ELEMENTS.imageModal.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      moved = false;
    },
    { passive: true }
  );

  DOM_ELEMENTS.imageModal.addEventListener(
    "touchmove",
    () => {
      moved = true;
    },
    { passive: true }
  );

  DOM_ELEMENTS.imageModal.addEventListener(
    "touchend",
    (e) => {
      if (!moved) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = endX - startX;
      const diffY = endY - startY;

      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX < 0) showNextImage();
        else showPrevImage();
      }
    },
    { passive: true }
  );
}

function setupMouseNavigation() {
  let startX = 0;
  let moved = false;

  DOM_ELEMENTS.imageModal.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    moved = false;
  });

  DOM_ELEMENTS.imageModal.addEventListener("mousemove", () => {
    moved = true;
  });

  DOM_ELEMENTS.imageModal.addEventListener("mouseup", (e) => {
    if (!moved) return;

    const diff = e.clientX - startX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) showNextImage();
      else showPrevImage();
    }
  });
}

// Room Types Functions
function renderRoomTypes(roomTypes) {
  if (!roomTypes || roomTypes.length === 0) {
    DOM_ELEMENTS.roomTypesContainer.innerHTML = `
      <tr class="bg-gray-100">
        <td colspan="4" class="p-4 text-center">Không có thông tin phòng</td>
      </tr>`;
    return;
  }

  DOM_ELEMENTS.roomTypesContainer.innerHTML = "";

  roomTypes.forEach((type) => {
    const row = document.createElement("tr");
    row.className = "border-b hover:bg-gray-50 transition-colors";

    row.innerHTML = `
      <td class="py-4 px-4">
        <div class="flex items-center gap-3">
          <img src="${convertDropboxUrl(type.image)}" alt="${
      type.name
    }" class="w-16 h-16 object-cover rounded">
          <div>
            <h4 class="font-bold text-lg">${type.name}</h4>
            <p class="text-sm text-gray-600">${type.description.substring(
              0,
              60
            )}...</p>
          </div>
        </div>
      </td>
      <td class="text-center">
        <span class="flex justify-center items-center">
          <i class="fa-solid fa-user"></i> x ${type.capacity}
        </span>
      </td>
      <td class="text-center">
        <span class="price-badge ">${new Intl.NumberFormat("vi-VN").format(
          type.price
        )} ₫</span>
      </td>
      <td class="text-center">
        <button class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition">Đặt ngay</button>
      </td>
    `;

    DOM_ELEMENTS.roomTypesContainer.appendChild(row);
  });
}

// Initialization
async function initializeApp() {
  // Initialize DOM element references
  DOM_ELEMENTS = {
    pageLoader: document.getElementById("page-loader"),
    name: document.getElementById("name"),
    position: document.getElementById("position"),
    description: document.getElementById("description"),
    imageContainer: document.getElementById("image-container"),
    imageModal: document.getElementById("image-modal"),
    modalImg: document.getElementById("modal-img"),
    closeModalBtn: document.getElementById("close-modal"),
    prevBtn: document.getElementById("prev-btn"),
    nextBtn: document.getElementById("next-btn"),
    thumbnailsContainer: document.getElementById("thumbnails-container"),
    imageCounter: document.getElementById("image-counter"),
    roomTypesContainer: document.getElementById("room-types-container"),
    roomPrice: document.getElementById("room-price"),
  };

  try {
    const data = await fetchRoomData();

    if (!data) return;

    const { room, location, roomTypes } = data;

    updateRoomDetails(room, location);

    initializeImageGallery(room.imagePrimary, room.images || []);

    renderRoomTypes(roomTypes);
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

// Start the application when the document is fully loaded
document.addEventListener("DOMContentLoaded", initializeApp);
