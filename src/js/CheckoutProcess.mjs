import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;

    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (total, item) => total + Number(item.FinalPrice),
      0
    );

    const itemCount = document.querySelector(
      `${this.outputSelector} #numItems`
    );

    const subtotal = document.querySelector(
      `${this.outputSelector} #subtotal`
    );

    if (itemCount) {
      itemCount.innerText = this.list.length;
    }

    if (subtotal) {
      subtotal.innerText = this.itemTotal.toFixed(2);
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;

    if (this.list.length > 0) {
      this.shipping = 10 + (this.list.length - 1) * 2;
    } else {
      this.shipping = 0;
    }

    this.orderTotal =
      this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(
      `${this.outputSelector} #tax`
    );

    const shipping = document.querySelector(
      `${this.outputSelector} #shipping`
    );

    const orderTotal = document.querySelector(
      `${this.outputSelector} #orderTotal`
    );

    if (tax) {
      tax.innerText = this.tax.toFixed(2);
    }

    if (shipping) {
      shipping.innerText = this.shipping.toFixed(2);
    }

    if (orderTotal) {
      orderTotal.innerText = this.orderTotal.toFixed(2);
    }
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: Number(item.FinalPrice),
      quantity: 1
    }));
  }

async checkout(form) {
  try {
    const formData = formDataToJSON(form);

    formData.orderDate = new Date().toISOString();
    formData.orderTotal = this.orderTotal.toFixed(2);
    formData.shipping = this.shipping;
    formData.tax = this.tax.toFixed(2);
    formData.items = this.packageItems(this.list);

    console.log("ORDER BEING SENT:");
    console.log(JSON.stringify(formData, null, 2));

    const service = new ExternalServices();

    return await service.checkout(formData);
  } catch (err) {
    console.error("CHECKOUT ERROR NAME:", err.name);
    console.error("CHECKOUT ERROR MESSAGE:", err.message);
    console.error(
      "CHECKOUT ERROR MESSAGE JSON:",
      JSON.stringify(err.message, null, 2)
    );
    console.error("FULL CHECKOUT ERROR:", err);

    throw err;
  }
}
 
}

