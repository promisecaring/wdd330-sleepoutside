import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const cartItems = getLocalStorage("so-cart");

function renderCheckoutItems() {
  const checkoutItems = document.querySelector("#checkoutItems");
  const totalElement = document.querySelector("#checkoutTotal");

  if (!checkoutItems) return;

  checkoutItems.innerHTML = cartItems
    .map(
      (item) => `
        <li class="cart-card divider">
          <img
            src="${item.Image}"
            alt="${item.Name}"
          />
          <div>
            <h3>${item.Name}</h3>
            <p>Quantity: 1</p>
            <p>$${item.FinalPrice}</p>
          </div>
        </li>
      `
    )
    .join("");

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice),
    0
  );

  totalElement.textContent = total.toFixed(2);
}

function placeOrder(event) {
  event.preventDefault();

  if (cartItems.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  setLocalStorage("so-cart", []);

  alert("Thank you! Your order has been placed.");

  window.location.href = "../index.html";
}

document
  .querySelector("#checkoutForm")
  .addEventListener("submit", placeOrder);

renderCheckoutItems();