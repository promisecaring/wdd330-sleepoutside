import CheckoutProcess from "./CheckoutProcess.mjs";
import { alertMessage } from "./utils.mjs";

const checkout = new CheckoutProcess(
  "so-cart",
  ".order-summary"
);

checkout.init();

const zip = document.querySelector("#zip");

if (zip) {
  zip.addEventListener("blur", () => {
    checkout.calculateOrderTotal();
  });
}

const form = document.querySelector("#checkoutForm");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Check required fields
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    try {
      const response = await checkout.checkout(form);

      console.log("Checkout response:", response);

      // Clear cart after successful checkout
      localStorage.removeItem("so-cart");

      // Go to success page
      window.location.href = "./success.html";
    } catch (error) {
      console.error("Checkout failed:", error);

      let message = "Sorry, there was a problem placing your order.";

      if (error.message) {
        if (typeof error.message === "string") {
          message = error.message;
        } else {
          message = Object.values(error.message).join(" ");
        }
      }

      alertMessage(message);
    }
  });
}
