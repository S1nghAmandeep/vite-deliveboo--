import { reactive } from "vue";

export const store = reactive({
  request: {
    name: "",
    types_id: [],
  },
  categories: [
    {
      img: "src/assets/img/italiano.jpg",
      name: "Italiano",
      id: 1,
      isOn: false,
    },
    {
      img: "src/assets/img/cinese.jpg",
      name: "Cinese",
      id: 2,
      isOn: false,
    },
    {
      img: "src/assets/img/vegetariano.jpg",
      name: "Vegetariano",
      id: 3,
      isOn: false,
    },
    {
      img: "src/assets/img/messicano.jpg",
      name: "Messicano",
      id: 4,
      isOn: false,
    },
    {
      img: "src/assets/img/giapponese.jpg",
      name: "Giapponese",
      id: 5,
      isOn: false,
    },
    {
      img: "src/assets/img/pizzeria.jpg",
      name: "Pizzeria",
      id: 6,
      isOn: false,
    },
    {
      img: "src/assets/img/francese.jpg",
      name: "Francese",
      id: 7,
      isOn: false,
    },
    {
      img: "src/assets/img/spagnolo.jpg",
      name: "Spagnolo",
      id: 8,
      isOn: false,
    },
    {
      img: "src/assets/img/greco.jpg",
      name: "Greco",
      id: 9,
      isOn: false,
    },
  ],
  cart: [],
  currentRoute: "",
  confirmEmptyCart: false,
  showWarning: false,
  currentUser: null,
  warningUser: null,
  warningItem: {
    item_id: null,
    item_name: null,
    item_price: null,
    quantity: 1,
  },
  paymentRequest: {
    nonce: '',
    amount: 0
  },
  addToCart(id, name, price, user_id) {
    if (this.cart.length === 0) this.currentUser = user_id;
    if (this.currentUser === user_id) {
      if (!this.addQuantity(id)) {
        console.log(this.addQuantity(id));
        this.cart.push({
          item_id: id,
          quantity: 1,
          item_price: price,
          item_name: name,
          partial_price: price
        });
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
      console.log(this.cart);
    } else {
      this.showWarning = true;
      this.warningItem.item_id = id;
      this.warningItem.item_name = name;
      this.warningItem.item_price = price;
      this.warningUser = user_id;
    }
  },
  addQuantity(id) {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].item_id == id) {
        this.cart[i].quantity++;
        localStorage.setItem('cart', JSON.stringify(this.cart));
        return true;
      }
    }
    return false;
  },
  removeItem(id) {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].item_id == id) {
        this.cart[i].quantity--;
        if (this.cart[i].quantity == 0) {
          this.cart.splice(i, 1);
        }
        localStorage.setItem('cart', JSON.stringify(this.cart));
        return true;
      }
    }
    console.log(this.cart);
  },
  deleteItem(id) {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].item_id == id) {
        this.cart.splice(i, 1);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        return true;
      }
    }
  },
  emptyCart() {
    this.cart = [];
    this.showWarning = false;
    localStorage.removeItem('cart');
  },
  emptyAdd() {
    this.emptyCart();
    this.cart.push(this.warningItem);
    this.currentUser = this.warningUser;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    localStorage.setItem('cart', JSON.stringify(this.cart));
  },
  returnQty(id) {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].item_id == id) {
        return this.cart[i].quantity;
      }
    }
    return 0;
  },
  calcTotal() {
    let tot = 0;
    this.cart.forEach((el) => {
      tot += el.item_price * el.quantity;
    });
    return tot.toFixed(2);
  },
  calcTotalQuantity() {
    let totQuantity = 0;
    this.cart.forEach((el) => {
      totQuantity += el.quantity;
    });
    return totQuantity;
  },
  calcPartial(id) {
    let part = 0;
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].item_id == id) {
        part = this.cart[i].item_price * this.cart[i].quantity;
        this.cart[i].partial_price = part
        return part.toFixed(2);
      }
    }
    return 0;
  },

  cartQuantity() {
    let tot = 0;
    for (let i = 0; i < this.cart.length; i++) {
      tot += this.cart[i].quantity;
    }
    return tot;
  },
});
