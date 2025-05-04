// index.js
const inputQtyPerson = document.getElementById("input-qty-person");

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
