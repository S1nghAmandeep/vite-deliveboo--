<script>
import braintree from 'braintree-web';
import { store } from '../store';
import { useToast } from "vue-toastification";
import axios from 'axios';
export default {
  setup() {
    const toast = useToast();
    return { toast }
  },
  data() {
    return {
      store,
      hostedFieldInstance: false,
      showLastOrder: false,
      error: "",
      CartMobileOrder: false,
      lastOrder: {},
      lastOrderTot: 0,
      orders:
      {
        user_id: store.currentUser,
        order_date: this.currentDate(),
        client_address: '',
        total_price: store.calcTotal(),
        details: '',
        client_email: '',
        client_phone: '',
        client_name: '',
        items: store.cart
      }
    }
  },
  methods: {
    hideLastOrder() {
      this.showLastOrder = false;
    },
    currentDate() {
      const currentdate = new Date();
      const datetime = currentdate.getFullYear() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

      return datetime;
    },
    sendOrders() {
      axios.post('http://127.0.0.1:8000/api/orders', this.orders)
        .then(res => {
          console.log(res.data.message);
        });
      this.lastOrder = this.orders;
      this.lastOrderTot = this.store.calcTotal()
      this.orders =
      {
        user_id: '',
        order_date: '',
        client_address: '',
        total_price: '',
        details: '',
        client_email: '',
        client_phone: '',
        client_name: '',
        items: []
      }
      this.store.emptyCart();
    },
    isValidEmail(email) {
      // Utilizza un'espressione regolare per validare l'email
      const emailRegex = /\S+@\S+\.\S+/;
      return emailRegex.test(email);
    },
    isValidPhone(phone) {
      // Utilizza un'espressione regolare per validare il numero di telefono
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(phone);
    },
    submitForm() {
      if (this.isFormValid()) {
        // Invia il modulo se è valido
        this.payWithCreditCard();
      } else {
        // Gestisci la visualizzazione degli errori o qualsiasi altra azione necessaria
        console.log('Il modulo non è valido');
      }
    },
    isFormValid() {
      // Verifica che tutti i campi obbligatori siano stati compilati correttamente
      return (
        this.orders.client_name &&
        this.isValidEmail(this.orders.client_email) &&
        this.isValidPhone(this.orders.client_phone) &&
        // (this.store.cart.length > 0) &&
        this.orders.client_address
        // Aggiungi altre condizioni per gli altri campi del modulo
      );
    },
    payWithCreditCard() {
      if (this.hostedFieldInstance) {

        this.error = "";

        this.hostedFieldInstance.tokenize().then(payload => {
          console.log(payload);
          this.store.paymentRequest.nonce = payload.nonce;
          this.store.paymentRequest.amount = this.store.calcTotal();
          this.successTransition();
          this.createTransaction();
          this.showLastOrder = true;
          this.sendOrders()
        })
          .catch(err => {
            console.error(err);
            this.error = "Alcuni dei dati inseriti non sono validi";
            this.errorTransition()
          })

      }
    },
    createBraintree() {
      braintree.client.create({
        authorization: "sandbox_v2dty569_7kfb5d3sq8xwt3tr"
      })
        .then(clientInstance => {
          let options = {
            client: clientInstance,
            styles: {
              'input': {
                'font-size': '16px',
                'font-family': 'sans-serif',
                'border': '1px solid #666',
                'padding-left': '1rem',
                'backgroud-color': 'red'
              },
            },
            fields: {
              number: {
                selector: '#creditCardNumber',
                placeholder: ''
              },
              cvv: {
                selector: '#cvv',
                placeholder: ''
              },
              expirationDate: {
                selector: '#expireDate',
                placeholder: ''
              }
            }
          }
          return braintree.hostedFields.create(options)
        })
        .then(hostedFieldInstance => {
          // @TODO - Use hostedFieldInstance to send data to Braintree
          this.hostedFieldInstance = hostedFieldInstance;
        })
        .catch(err => {
        });
    },
    async createTransaction() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/createTransaction', this.store.paymentRequest);
        console.log('Transaction created:', response.data);
        // Handle success response here
      } catch (error) {
        console.error('Error creating transaction:', error);
        // Handle error response here
      }
    },
    successTransition() {
      this.toast.success("La transazione è avvenuta con successo", {
        timeout: 5000
      });
    },
    errorTransition() {
      this.toast.error("Alcuni dei dati inseriti non sono validi", {
        timeout: 5000
      });
    },
    showCartMobileOrder() {
      this.CartMobileOrder = true;
    },
    closeCartMobileOrder() {
      this.CartMobileOrder = false;
    },
  },
  mounted() {
    this.createBraintree();
    // this.toastProva();
  },
}
</script>

<template>
  <div class="container">
    <div class="success" v-show="showLastOrder">
      <div class="success-wrapper">
        <div class="success-close-btn" @click="hideLastOrder()">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </div>
        <h4>Il tuo ordine è avvenuto con successo</h4>
        <div class="success-body">
          <ul class="success-left success-list">
            <li class="success-info">
              <div class="success-info-tag">Nome:</div>
              <div>{{ lastOrder.client_name }}</div>
            </li>
            <li class="success-info">
              <div class="success-info-tag">Email:</div>
              <div>{{ lastOrder.client_email }}</div>
            </li>
            <li class="success-info">
              <div class="success-info-tag">Indirizzo:</div>
              <div>{{ lastOrder.client_address }}</div>
            </li>
            <li class="success-info">
              <div class="success-info-tag">Telefono:</div>
              <div>{{ lastOrder.client_phone }}</div>
            </li>
            <li class="success-details">
              <div class="success-info-tag">Richieste Aggiuntive:</div>
              <div>{{ lastOrder.details }}</div>
            </li>
          </ul>
          <ul class="success-right success-list">
            <li v-for="item in lastOrder.items" class="success-item">
              <div class="item-details">
                <div class="item-qty">X{{ item.quantity }}</div>
                <div>{{ item.item_name }}</div>
              </div>
              <div class="item-price">&euro; &nbsp;{{ item.partial_price }}</div>
            </li>
            <li class="success-item success-total">
              <div class="success-tot-tag">Totale:</div>
              <div class="item-price">&euro; &nbsp;{{ lastOrderTot }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="grid" v-show="!showLastOrder">
      <div class="left">
        <div class="form-wrapper">
          <p class="empty-form" v-if="store.cart.length === 0">Il tuo carrello è vuoto</p>
          <!-- <div class="card-body"> -->
          <h4 v-if="store.cart.length > 0">Inserisci i dati richiesti per procedere con il pagamento</h4>
          <form v-if="store.cart.length > 0">
            <div class="form-group">
              <input v-model="orders.client_name" type="text" id="nome" name="nome" placeholder="&nbsp" required>
              <label for="nome">Nome</label>
            </div>
            <span v-if="!orders.client_name" class="form-error">Il nome è obbligatorio</span>
            <div class="form-group">
              <input v-model="orders.client_email" type="email" id="mail" name="mail" placeholder="&nbsp" required>
              <label for="mail">Email</label>
            </div>
            <span v-if="!orders.client_email" class="form-error">L'email è obbligatoria</span>
            <span v-else-if="!isValidEmail(orders.client_email)" class="form-error">Inserisci un'email valida</span>
            <div class="form-group">
              <input v-model="orders.client_phone" type="tel" id="telefono" name="telefono" placeholder="&nbsp" required
                pattern="\d{10}">
              <label for="telefono">Telefono</label>
            </div>
            <span v-if="!orders.client_phone" class="form-error">Il numero di telefono è obbligatorio</span>
            <span v-else-if="!isValidPhone(orders.client_phone)" class="form-error">Inserisci un numero di telefono
              valido</span>
            <div class="form-group">
              <textarea v-model="orders.details" id="dettagli_ordine" name="dettagli_ordine" rows="2" cols="50"
                placeholder="&nbsp"></textarea>
              <label for="dettagli_ordine">Richieste aggiuntive</label>
            </div>

            <div class="form-group">
              <textarea v-model="orders.client_address" id="indirizzo" name="indirizzo" rows="2" cols="50"
                placeholder="&nbsp" required></textarea>
              <label for="indirizzo">Indirizzo di consegna</label>
            </div>
            <span v-if="!orders.client_address" class="form-error">Indirizzo di consegna obbligatorio</span>
            <div class="form-group">
              <div id="creditCardNumber" class="form-control"></div>
              <label>Carta di Credito</label>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <div id="expireDate" class="form-control"></div>
                <label for="expireDate">Data di scadenza</label>
              </div>
              <div class="form-group">
                <div id="cvv" class="form-control"></div>
                <label>CVV</label>
              </div>
            </div>
            <button v-if="isFormValid()" type="submit" class="form-button" @click.prevent="payWithCreditCard">
              Paga con Carta di Credito
            </button>
            <div v-else class="form-button btn-grey">Paga con Carta di Credito</div>
          </form>
        </div>
      </div>

      <div class="right">
        <div class="order-wrapper">
          <h4>Il tuo ordine</h4>
          <div class="card-body">
            <p v-if="store.cart.length === 0">Il tuo carrello è vuoto</p>
            <div class="cart-card" v-for="card in store.cart">
              <div class="cart-card-name">
                <div>{{ card.item_name }}</div>
                <div class="partial-price">€ {{ store.calcPartial(card.item_id) }}</div>
              </div>
              <div class="cart-card-counter">
                <div class="quantity">Quantità <span class="counter">{{ card.quantity }}</span></div>
              </div>
            </div>
          </div>
          <div class="cart-total">
            <div class="total">
              <div>Totale:</div>
              <div>&euro; &nbsp;{{ store.calcTotal() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-mobile-preview" :class="store.calcTotalQuantity() > 0 ? 'show' : ''">
      <div class="left">
        <div class="cart-mobile-icon">
          <font-awesome-icon :icon="['fab', 'opencart']" />
          <span class="quantity"> {{ store.calcTotalQuantity() }}</span>
        </div>
        <div class="cart-mobile-total">
          &euro; &nbsp;{{ store.calcTotal() }}
        </div>
      </div>
      <div class="right" @click="showCartMobileOrder">
        Vedi dettagli dell'ordine
      </div>
    </div>
    <div class="order-wrapper-mobile" :class="CartMobileOrder ? 'active' : ''">
      <div class="title">
        <h4>Il tuo ordine</h4>
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="icon" @click="closeCartMobileOrder" />
      </div>
      <div class="card-body">
        <p v-if="store.cart.length === 0">Il tuo carrello è vuoto</p>
        <div class="cart-card" v-for="card in store.cart">
          <div class="cart-card-name">
            <div>{{ card.item_name }}</div>
            <div class="partial-price">€ {{ store.calcPartial(card.item_id) }}</div>
          </div>
          <div class="cart-card-counter">
            <div class="quantity">Quantità <span class="counter">{{ card.quantity }}</span></div>
          </div>
        </div>
      </div>
      <div class="cart-total">
        <div class="total">
          <div>Totale:</div>
          <div>&euro; &nbsp;{{ store.calcTotal() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../scss/partials/variables' as *;

.container {
  margin-top: 90px;

  .success {
    width: 95%;
    margin: 0 auto;

    @media (min-width: 768px) {
      width: 750px;
    }

    .success-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-height: 750px;
      border-radius: 1rem;
      background-color: #FFF2E7;
      border: 1px solid #FC8019;
      padding: 2rem 1rem;
      color: #3D4152;

      .success-close-btn {
        right: 0;
        top: 0;
        position: absolute;
        margin: 10px 10px 0px 0px;
        font-size: 1.2rem;
        background-color: $linen;
        border-radius: 50px;
        width: 35px;
        aspect-ratio: 1/1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 250ms linear;
        flex-shrink: 0;

        &:hover {
          color: $linen;
          background-color: $orange;
          rotate: 90deg;
          cursor: pointer;
        }

        &:active {
          background-color: $linen;
          color: $orange;
        }
      }

      h4 {
        align-self: center;
        color: green;
        font-size: 1.25rem;
        margin-bottom: 1rem;

        @media (min-width: 768px) {
          font-size: 1.5rem;
        }
      }

      .success-body {
        display: flex;
        flex-direction: column;

        @media (min-width: 768px) {
          flex-direction: row;
        }

        .success-left {
          border-bottom: 2px solid #FC8019;
          padding-bottom: 1rem;

          @media (min-width: 768px) {
            border-right: 2px solid #FC8019;
            padding-right: 1rem;
            border-bottom: 0;
            padding-bottom: 0;
          }

          .success-details {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .success-info-tag {
              color: #FC8019;
              font-weight: 600;
              flex-shrink: 0;
            }
          }

          .success-info {
            display: flex;
            gap: 1rem;

            .success-info-tag {
              color: #FC8019;
              font-weight: 600;
              flex-shrink: 0;
            }
          }
        }

        .success-list {
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;

          @media (min-width: 768px) {
            font-size: 1rem;
            width: 50%;
          }
        }

        .success-right {
          padding-top: 1rem;

          @media (min-width: 768px) {
            padding-left: 1rem;
            padding-top: 0;
          }

          .success-item {
            display: flex;
            justify-content: space-between;

            .item-details {
              display: flex;
              align-items: center;
              flex-shrink: 1;
              gap: 0.5rem;

              .item-qty {
                font-size: 0.7rem;
                color: #FC8019;
                flex-shrink: 0;
              }
            }

            .item-price {
              font-weight: 600;
              flex-shrink: 0;
            }
          }

          .success-total {
            flex-grow: 1;
            display: flex;
            align-items: flex-end;
            font-size: 0.9rem;

            @media (min-width: 768px) {
              font-size: 1.1rem;
            }

            .success-tot-tag {
              color: #FC8019;
            }
          }
        }
      }

    }
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;

    @media (min-width: 768px) {
      grid-template-columns: 1fr minmax(375px, 450px) 300px 1fr;
      gap: 2rem;
    }
  }

  .left {
    display: flex;
    justify-content: center;

    @media (min-width: 768px) {
      grid-column: 2 /3;
    }

  }

  .right {
    display: flex;
    justify-content: flex-start;
  }

  .form-wrapper {

    margin-bottom: 5rem;

    @media (min-width: 768px) {
      margin-bottom: 0;
    }
    .empty-form {
      font-size: 1.3rem;
      align-self: center;
    }

    .form-error {
      color: red;
      margin-bottom: 20px;
      margin-top: -10px;
      display: block;
    }

    h4 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .form-group {
      position: relative;
      margin-bottom: 1rem;
      z-index: 2;

      label {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1rem;
        z-index: 1;
        transition: $transition;
      }

      textarea~label {
        position: absolute;
        left: 1rem;
        top: 1rem;
        transform: translateY(-50%);
        font-size: 1rem;
        z-index: 1;
        transition: $transition;
      }

      input:focus,
      input:valid,
      textarea:focus,
      textarea:valid {
        border-color: $orange;
      }

      input:focus~label,
      input:valid~label,
      textarea:focus~label,
      textarea:valid~label {
        top: 0;
        font-size: 0.875rem;
        background-color: $linen;
        color: $orange;
        padding-inline: 0.25rem;
        left: 0.75rem;
        z-index: 3;
      }

      #amount {
        font-size: 1.3rem;
      }

      #creditCardNumber,
      #expireDate,
      #cvv {
        position: relative;
        height: 40px;
        border: 1px solid $silver;
        border-radius: 0.5rem;
        font-family: 'Outfit', sans-serif;
        transition: $transition;
        z-index: 2;
      }

      #creditCardNumber.braintree-hosted-fields-focused,
      #expireDate.braintree-hosted-fields-focused,
      #cvv.braintree-hosted-fields-focused {
        border-color: $orange;
      }

      #creditCardNumber.braintree-hosted-fields-focused~label,
      #expireDate.braintree-hosted-fields-focused~label,
      #cvv.braintree-hosted-fields-focused~label,
      #creditCardNumber.braintree-hosted-fields-valid~label,
      #expireDate.braintree-hosted-fields-valid~label,
      #cvv.braintree-hosted-fields-valid~label {
        top: 0;
        font-size: 0.75rem;
        background-color: $linen;
        color: $orange;
        padding-inline: 0.25rem;
        left: 0.75rem;
        z-index: 3;
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .form-button {
      background-color: rgb(247, 202, 0);
      padding: 10px 15px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 1rem;
      border: 1px solid transparent;

      &:hover {
        background-color: rgb(247, 165, 0);
      }

      &:focus {
        border: 1px solid rgb(0, 217, 255);
        box-shadow: 0px 0px 5px 2px rgba(0, 255, 255, 0.5);
      }
    }

    .btn-grey {
      background-color: grey;
      cursor: not-allowed;
      width: fit-content;

      &:hover {
        cursor: not-allowed;
        background-color: grey;
      }
    }

    .error-msg,
    .alert-success {
      margin: 30px 0px;
    }

    .alert-success {
      color: green;
    }

    .error-msg {
      color: red;
    }

    input,
    textarea {
      background-color: transparent;
      border: 1px solid $silver;
      line-height: 40px;
      border-radius: 0.5rem;
      padding-left: 1rem;
      font-size: 1rem;
      transition: $transition;
      z-index: 2;
      width: 100%;

      &:focus {
        outline: none;
      }

      &:not(:placeholder-shown)+label {
        top: 0;
        font-size: 0.875rem;
        padding-inline: 0.25rem;
        left: 0.5rem;
        background-color: $linen;
      }
    }

    textarea {
      resize: none;
      height: 80px;
      font-family: 'Outfit', sans-serif;
    }
  }

  .order-wrapper,
  .form-wrapper {
    display: flex;
    flex-direction: column;
    width: min(100%, 300px);
    max-height: 800px;
    border-radius: 1rem;
    background-color: $linen;
    border: 1px solid $orange;
    padding: 2rem 1rem;
    color: $charcoal;

    h4 {
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 1rem;
      text-align: center;

      @media (min-width: 768px) {
        font-size: 1.5rem;
      }
    }

    .card-body {
      overflow: auto;

      .cart-card {
        position: relative;
        padding: 1rem 0.75rem;
        margin-bottom: 1rem;
        background-color: rgba($orange, 0.2);
        border-radius: 1rem;
        width: 100%;

        .cart-card-name {
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;

          .partial-price {
            flex-shrink: 0;
          }
        }

        .cart-card-counter {
          display: flex;
          gap: 10px;
          margin-top: 20px;

          .counter {
            background-color: $orange;
            padding: 0px 15px;
            border-radius: 25px;
            color: white;
          }

          button {
            background-color: $orange;
            color: $linen;
            border-radius: 50px;
            aspect-ratio: 1/1;
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 100ms linear;
            cursor: pointer;

            &:hover {
              background-color: $orange;
            }

            &:active {
              background-color: white;
              color: $orange;
            }
          }
        }
      }
    }

    .cart-total {
      margin-top: auto;
    }

    .total {
      margin-top: 1rem;
      padding: 0.625rem 1rem;
      color: $black;
      border-radius: 25px;
      background-color: $white;
      display: flex;
      justify-content: space-between;
    }
  }

  .order-wrapper {
    display: none;

    @media (min-width: 768px) {
      display: flex;
    }
  }

  .order-wrapper-mobile {
    display: flex;
    flex-direction: column;
    position: fixed;
    overflow: auto;
    inset: 0;
    transform: translateX(100%);
    z-index: 1000;
    background-color: $linen;
    padding: 1rem;
    transition: $transition;

    &.active {
      transform: translateX(0);
    }

    .title {
      text-align: center;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      position: relative;

      .icon {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
    }

    .card-body {
      overflow: auto;

      .cart-card {
        position: relative;
        padding: 1rem 0.75rem;
        margin-bottom: 1rem;
        background-color: rgba($orange, 0.2);
        border-radius: 1rem;
        width: 100%;

        .cart-card-name {
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;

          .partial-price {
            flex-shrink: 0;
          }
        }

        .cart-card-counter {
          display: flex;
          gap: 10px;
          margin-top: 20px;

          .counter {
            background-color: $orange;
            padding: 0px 15px;
            border-radius: 25px;
            color: white;
          }

          button {
            background-color: $orange;
            color: $linen;
            border-radius: 50px;
            aspect-ratio: 1/1;
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 100ms linear;
            cursor: pointer;

            &:hover {
              background-color: $orange;
            }

            &:active {
              background-color: white;
              color: $orange;
            }
          }
        }
      }
    }

    .cart-total {
      margin-top: auto;
    }

    .total {
      margin-top: 1rem;
      padding: 0.625rem 1rem;
      color: $black;
      border-radius: 25px;
      background-color: $white;
      display: flex;
      justify-content: space-between;
    }

    .pay {
      margin-top: auto;
    }
  }

  .order-mobile-preview {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    bottom: 0;
    transform: translateY(100%);
    left: 0;
    width: 100%;
    padding: 1rem;
    background-color: $orange;
    color: $white;
    transition: $transition;
    z-index: 100;

    @media (min-width:768px) {
      display: none;
    }

    &.show {
      transform: translateY(0);
    }

    .left {
      display: flex;
      align-items: center;
      gap: 1rem;

      .cart-mobile-icon {
        position: relative;
        font-size: 1.75rem;

        .quantity {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 0;
          right: 0;
          transform: translateY(-50%);
          width: 1rem;
          aspect-ratio: 1;
          background-color: $white;
          color: $orange;
          font-size: 0.75rem;
          border-radius: 50%;
        }
      }

      .cart-mobile-total {
        font-weight: 600;
        font-size: 1.125rem;
      }
    }

    .right {
      cursor: pointer;
    }
  }

  .form-wrapper {
    width: min(100%, 450px);
  }
}
</style>