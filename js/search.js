const API_BASE_URL = "https://backend-cdio3.onrender.com";
let sortPriceLowToHigh = true;
let isDropdownOpen = false;
const maxPrice = document.getElementById("max-price");
const minPrice = document.getElementById("min-price");

function formatNumberInput(inputElement) {
  inputElement.addEventListener("input", (e) => {
    let value = e.target.value;

    // Xóa dấu phẩy và ký tự không phải số
    value = value.replace(/,/g, "").replace(/\D/g, "");

    // Nếu không có giá trị hợp lệ
    if (!value || isNaN(Number(value))) {
      e.target.value = "";
      return;
    }

    // Format lại
    e.target.value = Number(value).toLocaleString("en-US");
  });
}

formatNumberInput(maxPrice);
formatNumberInput(minPrice);

// Toggle dropdown visibility
function toggleSortDropdown() {
  const dropdownMenu = document.getElementById("sortDropdownMenu");
  const dropdownIcon = document.getElementById("sortDropdownIcon");

  isDropdownOpen = !isDropdownOpen;

  if (isDropdownOpen) {
    dropdownMenu.classList.remove("hidden");
    dropdownIcon.classList.add("rotate-180");
  } else {
    dropdownMenu.classList.add("hidden");
    dropdownIcon.classList.remove("rotate-180");
  }
}

// Select a sort option and update the display
async function selectSortOption(option) {
  const currentSortOption = document.getElementById("currentSortOption");
  const dropdownMenu = document.getElementById("sortDropdownMenu");
  const dropdownIcon = document.getElementById("sortDropdownIcon");

  // Update the displayed text and sort direction based on the selected option
  switch (option) {
    case "price-low-to-high":
      currentSortOption.textContent = "Giá thấp đến cao";
      sortPriceLowToHigh = true;
      break;
    case "price-high-to-low":
      currentSortOption.textContent = "Giá cao đến thấp";
      sortPriceLowToHigh = false;
      break;
    default:
      currentSortOption.textContent = "Sắp xếp";
      sortPriceLowToHigh = true;
  }

  // Close dropdown after selection
  dropdownMenu.classList.add("hidden");
  dropdownIcon.classList.remove("rotate-180");
  isDropdownOpen = false;

  // Re-fetch and display data with new sort order
  await handleSearch();
}

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
  const dropdown = document.querySelector(".sort-dropdown");
  const dropdownMenu = document.getElementById("sortDropdownMenu");
  const dropdownIcon = document.getElementById("sortDropdownIcon");

  if (dropdown && !dropdown.contains(event.target) && isDropdownOpen) {
    dropdownMenu.classList.add("hidden");
    dropdownIcon.classList.remove("rotate-180");
    isDropdownOpen = false;
  }
});

// Get URL parameters
const getParamUrl = () => {
  const params = new URLSearchParams(window.location.search);

  let searchLocation = params.get("searchLocation") || "";
  let personQty = params.get("personQty") || "1";
  let checkIn = params.get("checkIn") || "";
  let checkOut = params.get("checkOut") || "";
  let page = params.get("page") || "1";

  return { searchLocation, personQty, checkIn, checkOut, page };
};
const parsePriceValue = (value) => {
  if (!value) return null;
  return value.replace(/,/g, "");
};
// Fetch data from API
const getData = async (searchLocation, personQty, checkIn, checkOut, page) => {
  let sort_by = sortPriceLowToHigh ? "price_asc" : "price_desc";
  let url = `${API_BASE_URL}/room/search?searchLocation=${encodeURIComponent(
    searchLocation
  )}&person_qty=${personQty}&check_in=${checkIn}&check_out=${checkOut}&type_search=less&page=1&items_per_page=5&sort_by=${sort_by}&page=${page}`;

  // Add price filters if they exist
  if (minPrice && minPrice.value !== null && minPrice.value !== "") {
    url += `&price_min=${parsePriceValue(minPrice.value)}`;
  }

  if (maxPrice && maxPrice.value !== null && maxPrice.value !== "") {
    url += `&price_max=${parsePriceValue(maxPrice.value)}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// Generate hotel card HTML
const hotelBoxContent = (hotelId, image, nameHotel, price, city, district) => {
  // Handle image URL
  const imageUrl = image
    ? image.replace("dl=0", "raw=1")
    : "/api/placeholder/300/200";

  // Format price
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price) + " ₫";

  // Handle district display
  const locationText = district ? `${city}, ${district}` : city;

  return `
    <li class="result-item bg-white rounded-lg shadow-sm overflow-hidden">
      <a
        href="detail.html?roomId=${hotelId}"
        class="block hover:shadow-md transition-shadow duration-300"
      >
        <article class="hotel-card flex flex-col md:flex-row">
          <!-- Hotel image -->
          <div class="hotel-image w-full md:w-1/4">
            <img
              src="${imageUrl}"
              alt="${nameHotel}"
              class="w-full h-48 md:h-full object-cover"
              onerror="this.src='/api/placeholder/300/200'"
            />
          </div>

          <!-- Hotel details -->
          <div class="hotel-details flex-1 p-4">
            <header class="mb-2">
              <h3 class="text-primary text-xl font-bold">
                ${nameHotel}
              </h3>
              <p class="text-gray-600">
                ${locationText}
              </p>
              <div class="rating flex items-center gap-1 my-1">
                <div class="stars text-yellow-400">★★★★★</div>
                <span class="review-count text-sm text-gray-500">
                  (29 đánh giá)
                </span>
              </div>
            </header>

            <div class="room-details border-l-4 border-gray-300 pl-3">
              <h4 class="font-semibold">Phòng Deluxe</h4>
              <ul class="amenities text-sm text-gray-600 mt-2 space-y-1">
                <li class="flex items-center gap-2">
                  <i class="fa-solid fa-bed w-4"></i> 
                  <span>1 giường đôi</span>
                </li>
                <li class="flex items-center gap-2">
                  <i class="fa-solid fa-user w-4"></i> 
                  <span>2 người lớn</span>
                </li>
                <li class="flex items-center gap-2 text-green-600 font-medium">
                  <i class="fa-solid fa-utensils w-4"></i> 
                  <span>Bữa ăn trưa</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Price and booking section -->
          <div class="price-booking w-full md:w-1/4 bg-gray-50 p-4 flex flex-col justify-between">
            <div class="price text-right">
              <div class="amount font-bold text-xl text-primary">
                ${formattedPrice}
              </div>
              <p class="text-sm text-gray-500">
                Đã bao gồm thuế và phí
              </p>
            </div>

            <button class="bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary/90 w-full mt-4 transition-colors">
              Xem chi tiết
            </button>
          </div>
        </article>
      </a>
    </li>`;
};
const pagination = (currentPage = 1, totalPage = 1) => {
  const paginationElement = document.getElementById("pagination");

  if (!paginationElement) return;

  // Nếu chỉ có 1 trang hoặc không có trang nào, ẩn pagination
  if (totalPage <= 1) {
    paginationElement.innerHTML = "";
    return;
  }

  // Lấy tất cả tham số hiện tại từ URL
  const currentParams = new URLSearchParams(window.location.search);

  let paginationHTML = "";

  // Nút Previous
  if (currentPage > 1) {
    const prevParams = new URLSearchParams(currentParams);
    prevParams.set("page", currentPage - 1);
    paginationHTML += `
      <a href="?${prevParams.toString()}" 
         class="pagination-link w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" 
         aria-label="Previous page">
        <i class="fa-solid fa-chevron-left text-sm text-gray-600"></i>
      </a>`;
  } else {
    // Nút Previous bị disable
    paginationHTML += `
      <span class="pagination-link w-8 h-8 flex items-center justify-center rounded-full text-gray-300 cursor-not-allowed">
        <i class="fa-solid fa-chevron-left text-sm"></i>
      </span>`;
  }

  // Logic hiển thị số trang
  let startPage = 1;
  let endPage = totalPage;

  // Nếu có nhiều hơn 7 trang, chỉ hiển thị 7 trang
  if (totalPage > 7) {
    if (currentPage <= 4) {
      // Nếu trang hiện tại ở đầu
      startPage = 1;
      endPage = 5;
    } else if (currentPage >= totalPage - 3) {
      // Nếu trang hiện tại ở cuối
      startPage = totalPage - 4;
      endPage = totalPage;
    } else {
      // Nếu trang hiện tại ở giữa
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  // Hiển thị trang đầu và dấu ... nếu cần
  if (startPage > 1) {
    const firstPageParams = new URLSearchParams(currentParams);
    firstPageParams.set("page", 1);
    paginationHTML += `
      <a href="?${firstPageParams.toString()}" 
         class="pagination-link w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
         1
      </a>`;

    if (startPage > 2) {
      paginationHTML += `
        <span class="pagination-link w-8 h-8 flex items-center justify-center text-gray-400">
          ...
        </span>`;
    }
  }

  // Hiển thị các trang trong khoảng
  for (let i = startPage; i <= endPage; i++) {
    const pageParams = new URLSearchParams(currentParams);
    pageParams.set("page", i);

    const isCurrentPage = i == currentPage;
    paginationHTML += `
      <a href="?${pageParams.toString()}" 
         class="pagination-link ${
           isCurrentPage
             ? "bg-primary text-white"
             : "hover:bg-gray-100 transition-colors"
         } 
         w-8 h-8 flex items-center justify-center rounded-full">
         ${i}
      </a>`;
  }

  // Hiển thị dấu ... và trang cuối nếu cần
  if (endPage < totalPage) {
    if (endPage < totalPage - 1) {
      paginationHTML += `
        <span class="pagination-link w-8 h-8 flex items-center justify-center text-gray-400">
          ...
        </span>`;
    }

    const lastPageParams = new URLSearchParams(currentParams);
    lastPageParams.set("page", totalPage);
    paginationHTML += `
      <a href="?${lastPageParams.toString()}" 
         class="pagination-link w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
         ${totalPage}
      </a>`;
  }

  // Nút Next
  if (currentPage < totalPage) {
    const nextParams = new URLSearchParams(currentParams);
    nextParams.set("page", parseInt(currentPage) + 1);
    paginationHTML += `
      <a href="?${nextParams.toString()}" 
         class="pagination-link w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" 
         aria-label="Next page">
        <i class="fa-solid fa-chevron-right text-sm text-gray-600"></i>
      </a>`;
  } else {
    // Nút Next bị disable
    paginationHTML += `
      <span class="pagination-link w-8 h-8 flex items-center justify-center rounded-full text-gray-300 cursor-not-allowed">
        <i class="fa-solid fa-chevron-right text-sm"></i>
      </span>`;
  }

  paginationElement.innerHTML = paginationHTML;
};
// Main search handler
const handleSearch = async () => {
  const listResult = document.getElementById("list-result");
  const resultSearch = document.getElementById("resultSearch");

  // Show loading state
  if (listResult) {
    listResult.innerHTML = `
      <li class="flex justify-center items-center py-8">
        <div class="text-gray-500 animate-spin text-3xl  font-bold"><i class="fa-solid fa-spinner"></i></div>
      </li>
    `;

    resultSearch.innerHTML = ` <div class="text-gray-500 text-center animate-spin text-lg  font-bold"><i class="fa-solid fa-spinner"></i></div>`;
  }

  try {
    const { searchLocation, personQty, checkIn, checkOut, page } =
      getParamUrl();

    // Update search location display

    const response = await getData(
      searchLocation,
      personQty,
      checkIn,
      checkOut,
      page
    );

    if (!response || response.code !== 0) {
      // Show no results
      if (listResult) {
        listResult.innerHTML = `
          <li class="flex justify-center items-center py-8">
            <div class="text-gray-500">Không tìm thấy kết quả phù hợp</div>
          </li>
        `;
      }
      return;
    }

    // Update result count

    // Clear and populate results
    if (listResult) {
      listResult.innerHTML = "";
      resultSearch.innerHTML = "";
      if (response.data.results && response.data.results.length > 0) {
        resultSearch.innerText = `${searchLocation}: Đã tìm thấy ${response.data.count} kết quả`;
        response.data.results.forEach((item) => {
          const cardItem = hotelBoxContent(
            item.room.id,
            item.room.imagePrimary,
            item.room.name,
            item.room.price,
            item.location[0].city,
            item.location[0].district
          );
          listResult.innerHTML += cardItem;
        });
        pagination(
          response.data.pagination.pageCurrent,
          response.data.pagination.totalPage
        );
      } else {
        listResult.innerHTML = `
          <li class="flex justify-center items-center py-8">
            <div class="text-gray-500">Không có phòng nào phù hợp</div>
          </li>
        `;
        resultSearch.innerText = `${searchLocation}: Đã tìm thấy 0 kết quả`;
      }
    }
  } catch (error) {
    console.error("Error in handleSearch:", error);
    if (listResult) {
      listResult.innerHTML = `
        <li class="flex justify-center items-center py-8">
          <div class="text-red-500">Có lỗi xảy ra khi tìm kiếm</div>
        </li>
      `;
    }
  }
};

// Add event listener for filter button
document.addEventListener("DOMContentLoaded", function () {
  // Initialize search on page load
  handleSearch();

  // // Add event listener for filter button
  // const filterButton = document.querySelector('button:contains("Lọc")');
  // if (filterButton) {
  //   filterButton.addEventListener("click", handleSearch);
  // }

  // // Alternative way to find filter button
  // const filterButtons = document.querySelectorAll("button");
  // filterButtons.forEach((button) => {
  //   if (button.textContent.trim() === "Lọc") {
  //     button.addEventListener("click", handleSearch);
  //   }
  // });
});
