import CheckoutProcess from "./CheckoutProcess.mjs";

const checkout = new CheckoutProcess(
  "so-cart",
  ".order-summary"
);

// Initialize the checkout page
checkout.init();

// Calculate totals when the ZIP code is entered
const zip = document.querySelector("#zip");

if (zip) {
  zip.addEventListener("blur", () => {
    checkout.calculateOrderTotal();
  });
}

// Process the order when the form is submitted
const form = document.querySelector("#checkoutForm");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    try {
      const response = await checkout.checkout(form);

      console.log("Checkout response:", response);

      alert("Thank you! Your order has been placed.");

      localStorage.removeItem("so-cart");

      window.location.href = "../index.html";
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Sorry, there was a problem placing your order.");
    }
  });
}