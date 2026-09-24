import { getLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  const htmlItems = cartItems.map((item) =>
    cartItemTemplate(item)
  );

  document.querySelector(".product-list").innerHTML =
    htmlItems.join("");

  renderCartTotal(cartItems);
  updateCartCount();
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img
          src="${item.Image}"
          alt="${item.Name}"
        />
      </a>

      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">
        ${item.Colors[0].ColorName}
      </p>

      <p class="cart-card__quantity">
        qty: 1
      </p>

      <p class="cart-card__price">
        $${item.FinalPrice}
      </p>
    </li>
  `;
}

function renderCartTotal(cartItems) {
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice),
    0
  );

  const cartSection = document.querySelector(".products");

  if (!cartSection) return;

  const existingTotal = document.querySelector(".cart-total");

  if (existingTotal) {
    existingTotal.remove();
  }

  const totalElement = document.createElement("p");

  totalElement.classList.add("cart-total");

  totalElement.innerHTML = `
    <strong>Cart Total: $${total.toFixed(2)}</strong>
  `;

  cartSection.appendChild(totalElement);
}

renderCartContents();