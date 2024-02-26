<script>
import { store } from '../store';
export default {
    data() {
        return {
            store: store,
            CartMobileOrder: false,
            confirmEmptyCart: false
        }
    },
    methods: {
        showCartMobileOrder() {
            this.CartMobileOrder = true;
        },
        closeCartMobileOrder() {
            this.CartMobileOrder = false;
        },
        closeEmptyCart() {
            store.emptyCart();
            this.confirmEmptyCart = false;
        }
    },
    props: {
        items: Array
    },
    // mounted() {
    //     if (localStorage.cart) {
    //         store.cart = localStorage.cart;
    //     }
    // },
    // watch: {
    //     cart(newCart) {
    //         localStorage.cart = newCart;
    //     }
    // }
}
</script>

<template>
    <section class="items-list">
        <div class="container">
            <div class="grid">
                <div class="menu-title">Menu</div>
                <div class="grid-card">
                    <div class="card" :class="store.returnQty(item.id) > 0 ? 'in-cart' : ''" v-for="(item, index) in items">
                        <img class="item-img" :src="`http://127.0.0.1:8000/storage/${item.item_img}`" alt="">
                        <div class="item-info">
                            <div class="item-name">{{ item.name }}</div>
                            <div class="labels">
                                <div class="label spicy" v-show="item.is_spicy">
                                    <font-awesome-icon :icon="['fas', 'pepper-hot']" />
                                </div>
                                <div class="label veg" v-show="item.is_vegan">
                                    <font-awesome-icon :icon="['fas', 'seedling']" />
                                </div>
                                <div class="label gf" v-show="item.is_gluten_free">
                                    <font-awesome-icon :icon="['fas', 'wheat-awn-circle-exclamation']" />
                                </div>
                            </div>
                            <div class="cart-card-counter">
                                <button @click="store.removeItem(item.id)"
                                    v-show="store.returnQty(item.id) > 0"><font-awesome-icon
                                        :icon="['fas', 'minus']" /></button>
                                <div class="price">&euro; &nbsp;{{ item.price }}</div>
                                <button
                                    @click="store.addToCart(item.id, item.name, item.price, item.user_id, index)"><font-awesome-icon
                                        :icon="['fas', 'plus']" /></button>
                                <div class="quantity" v-show="store.returnQty(item.id) > 0">X {{ store.returnQty(item.id) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cart">
                    <h4>Il tuo ordine</h4>
                    <div class="cart-body">
                        <p v-if="store.cart.length === 0">Il tuo carrello è vuoto</p>
                        <div class="cart-card" v-for="card in store.cart">
                            <div class="cart-card-name">
                                <div>{{ card.item_name }}</div>
                                <div class="partial-price">€ {{ store.calcPartial(card.item_id) }}</div>
                            </div>
                            <div class="cart-item-delete" @click="store.deleteItem(card.item_id)">
                                <font-awesome-icon :icon="['fas', 'trash-can']" />
                            </div>
                            <div class="cart-card-counter">
                                <button @click="store.removeItem(card.item_id)"><font-awesome-icon
                                        :icon="['fas', 'minus']" /></button>
                                <div class="counter">{{ card.quantity }}</div>
                                <button @click="store.addQuantity(card.item_id)"><font-awesome-icon
                                        :icon="['fas', 'plus']" /></button>
                            </div>
                        </div>
                    </div>

                    <div class="pay">
                        <div class="cart-total">
                            Totale: &euro; &nbsp;{{ store.calcTotal() }}
                            <div class="empty-cart" @click="confirmEmptyCart = true" v-if="store.cart.length !== 0">
                                Svuota Carrello
                            </div>
                            <div class="confirm-empty-cart" :class="confirmEmptyCart ? 'show' : ''">
                                <p>Sei sicuro di voler svuotare il carrello?</p>
                                <button class="confirm" @click="this.closeEmptyCart()">Sì</button>
                                <button class="return" @click="confirmEmptyCart = false">No</button>
                            </div>

                        </div>

                        <div class="cart-confirm" :class="store.cart.length === 0 ? 'disable' : ''">
                            <router-link :to="{ name: 'checkout' }" class="proceed">Procedi con l'ordine</router-link>
                        </div>
                    </div>
                </div>
                <div class="cart-mobile" :class="CartMobileOrder ? 'active' : ''">
                    <div class="title">
                        <h4>Il tuo ordine</h4>
                        <font-awesome-icon :icon="['fas', 'arrow-left']" class="icon" @click="closeCartMobileOrder" />
                    </div>
                    <div class="cart-body">
                        <p v-if="store.cart.length === 0">Il tuo carrello è vuoto</p>

                        <div class="cart-card" v-for="card in store.cart">
                            <div class="cart-card-name">
                                <div>{{ card.item_name }}</div>
                                <div>€ {{ store.calcPartial(card.item_id) }}</div>
                            </div>

                            <div class="cart-item-delete" @click="store.deleteItem(card.item_id)">
                                <font-awesome-icon :icon="['fas', 'trash-can']" />
                            </div>

                            <div class="cart-card-counter">
                                <button @click="store.removeItem(card.item_id)"><font-awesome-icon
                                        :icon="['fas', 'minus']" /></button>
                                <div class="counter">{{ card.quantity }}</div>
                                <button @click="store.addQuantity(card.item_id)"><font-awesome-icon
                                        :icon="['fas', 'plus']" /></button>
                            </div>
                        </div>
                    </div>
                    <div class="pay">
                        <div class="cart-total">
                            Totale: &euro; &nbsp;{{ store.calcTotal() }}
                        </div>

                        <div class="cart-confirm" :class="store.cart.length === 0 ? 'disable' : ''">
                            <router-link :to="{ name: 'checkout' }" class="proceed">Procedi con l'ordine</router-link>
                        </div>
                    </div>
                </div>

                <div class="cart-mobile-preview" :class="store.calcTotalQuantity() > 0 ? 'show' : ''">
                    <div class="left">
                        <div class="cart-mobile-icon">
                            <font-awesome-icon :icon="['fab', 'opencart']" />
                            <span class="quantity"> {{ store.calcTotalQuantity() }}</span>
                        </div>
                        <div class="cart-mobile-total">
                            &euro; &nbsp;{{ store.calcTotal() }}
                        </div>
                    </div>
                    <div class="right" @click="showCartMobileOrder()">
                        Vedi dettagli dell'ordine
                    </div>

                </div>

            </div>

        </div>
        <div v-if="store.showWarning" class="bg-warning-card">
            <div class="warning-card-body">
                <div @click="store.showWarning = false" class="warning-close-btn">
                    <font-awesome-icon :icon="['fas', 'xmark']" />
                </div>
                <div class="warning-card">
                    <h1 class="warning-title">Attenzione!!</h1>
                    <p class="warning-text">Puoi ordinare solo da un ristorante alla volta. Vuoi mantenere l'ordine attuale
                        e
                        procedere al pagamento
                        oppure svuotare il carrello e aggiungere il nuovo piatto?
                    </p>
                    <div class="btn-warning">
                        <button class="btn-confrim">
                            <router-link :to="{ name: 'checkout' }" class="proceed">Procedi al pagamento</router-link>
                        </button>
                        <button @click="store.emptyAdd()" class="btn-confrim btn-delete">
                            Svuota e Aggiungi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@use '../scss/partials/variables' as *;


.items-list {
    padding: 100px 0;

    .bg-warning-card {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.807);
        z-index: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $orange;
        text-align: center;

        .warning-close-btn {
            align-self: flex-end;
            font-size: 1.2rem;
            background-color: $orange;
            color: $linen;
            border-radius: 50px;
            margin: 20px;
            width: 35px;
            aspect-ratio: 1/1;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 250ms linear;

            &:hover {
                color: $orange;
                background-color: $linen;
                rotate: 90deg;
                cursor: pointer;
            }

            &:active {
                background-color: $orange;
                color: $linen;
            }
        }

        .warning-card-body {
            max-width: 800px;
            display: flex;
            flex-direction: column;
            border: 2px solid $orange;
            border-radius: 25px;
            padding: 20px;
            backdrop-filter: blur(7px);
        }

        .warning-card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 50px;
            border-radius: 50px;
        }

        .warning-title {
            font-size: 50px;
            margin-top: -40px;
        }

        .warning-text {
            font-size: 20px;
        }

        .btn-confrim {
            text-align: center;
            margin: 0px 10px 15px;
            padding: 10px 25px;
            color: black;
            border-radius: 25px;
            background-color: $orange;
            transition: 250ms linear;
            font-size: 16px;

            &:hover {
                cursor: pointer;
                transform: scale(1.1);
                color: $linen;
            }

            &:active {
                background-color: $linen;
                color: black;
            }
        }

        .btn-delete {
            background-color: red;
        }


    }

    .menu-title {
        text-align: center;
        font-weight: 600;
        font-size: 2rem;
        margin-bottom: 2rem;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;

        @media (min-width: 768px) {
            grid-template-columns: 1fr 300px;
        }

        .grid-card {
            grid-column: 1 / 2;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-template-rows: repeat(auto-fill, 140px);
            gap: 2rem;

            .card {
                display: flex;
                height: 140px;
                gap: 15px;
                border-radius: 1rem;
                transition: $transition;
                overflow: hidden;
                background-color: $linen;

                &.in-cart {
                    border: 3px solid $orange;
                }


                &:hover {
                    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
                    // transform: scale(1.05);
                    // height: 100%;
                    // padding: 10px 0;

                    .item-img {
                        transform: scale(1.05);
                    }
                }

                .item-img {
                    height: 140px;
                    aspect-ratio: 1 / 1;
                    // border-radius: 1rem 0 0;
                    object-fit: cover;
                    transition: $transition;
                }

                .item-info {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                    padding: 10px 10px 20px;

                    .item-name {
                        font-weight: 600;
                        font-size: 16px;
                    }

                    .cart-card-counter {
                        display: flex;
                        gap: 10px;
                        margin-top: 20px;
                        align-items: center;

                        @media (max-width: 1200px) {
                            gap: 5px;
                            ;
                        }

                        .price {
                            font-weight: 600;
                            font-size: 0.9rem;

                            @media (max-width: 1200px) {
                                font-size: 0.8rem;
                            }
                        }

                        .quantity {
                            font-size: 0.8rem;
                            font-weight: 600;
                            color: $orange;
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

                    .labels {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        width: 100%;
                        flex-grow: 1;

                        .label {
                            border-radius: 999px;
                            border: 1px solid black;
                            padding: 3px 10px;
                            line-height: 15px;
                            font-size: 10px;
                        }

                        .spicy {
                            color: red;
                            border-color: red;
                        }

                        .veg {
                            color: green;
                            border-color: green;
                        }

                        .gf {
                            color: darkgoldenrod;
                            border-color: darkgoldenrod;
                        }
                    }

                    .add-item {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        background-color: $orange;
                        color: white;
                        font-weight: 600;
                        padding: 0 15px;
                        line-height: 30px;
                        border-radius: 999px;
                        cursor: pointer;

                        &:hover {
                            background-color: $linen;
                            color: $orange;
                            border: 1px solid $orange;
                        }

                        &:active {
                            transform: scale(0.9);
                        }
                    }
                }
            }


        }
    }

    .cart {
        position: relative;
        display: none;
        flex-direction: column;
        background-color: $linen;
        border-radius: 1rem;
        padding: 1rem;
        max-height: 70vh;

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgb(255, 191, 72);
            border-radius: 50px;

            &:hover {
                background: $orange;
                width: 25px;
            }
        }

        h4 {
            text-align: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .pay {
            margin-top: auto;
        }

        @media (min-width:768px) {
            display: flex;
        }
    }

    .cart-mobile {
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

        .pay {
            margin-top: auto;
        }
    }

    .cart-mobile-preview {
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

    .cart-body {
        overflow: auto;

        p {
            text-align: center;
        }

        .cart-card {
            position: relative;
            // border-bottom: 1px solid rgba($orange, 0.5);
            padding: 1rem 0.75rem;
            margin-bottom: 15px;
            background-color: rgba($orange, 0.2);
            border-radius: 1rem;

            .cart-card-name {
                font-size: 1rem;
                font-weight: 600;
                display: flex;
                gap: 1rem;
                justify-content: space-between;

                .partial-price {
                    flex-shrink: 0;
                }

            }

            .cart-item-delete {
                background-color: red;
                position: absolute;
                right: 8px;
                bottom: 8px;
                color: $linen;
                border-radius: 50px;
                aspect-ratio: 1/1;
                width: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: 100ms linear;

                &:hover {
                    transform: scale(1.1);
                    cursor: pointer;
                }

                &:active {
                    transform: scale(1);
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
                    font-weight: 600;
                    font-size: 1rem;
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
        text-align: start;
        margin-bottom: 1rem;
        padding: 10px;
        color: black;
        border-radius: 25px;
        background-color: $white;
        margin-top: 10px;
        position: relative;

        .empty-cart {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.7rem;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
                color: $red;
            }
        }

        .confirm-empty-cart {
            position: absolute;
            top: -7rem;
            left: 0;
            width: 100%;
            background-color: $red;
            color: $white;
            padding: 1rem;
            border-radius: 0.5rem;
            transform: translateX(120%);
            opacity: 0;
            box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
            transition: $transition-bounce;

            button {
                padding: 0.25rem 1rem;
                border-radius: 3rem;
                margin-top: 1rem;
                cursor: pointer;
                transition: $transition;

                &.confirm {
                    background-color: transparent;
                    color: $white;
                    border: 1px solid currentColor;
                    margin-right: 0.5rem;

                    &:hover {
                        background-color: $silver;
                    }
                }
            }

            &.show {

                opacity: 1;
                transform: translateX(0);
            }
        }
    }

    .cart-confirm {
        text-align: center;

        padding: 10px;
        color: white;
        border-radius: 25px;
        background-color: $orange;

        &:hover {
            cursor: pointer;
        }

        &:active {
            background-color: $linen;
            color: black;
        }

        &.disable {
            color: $silver;
            background-color: $light-silver;
            cursor: not-allowed;

            .proceed {
                cursor: not-allowed;
                pointer-events: none;
            }
        }
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        row-gap: 40px;

        .col-card {
            flex-basis: calc(100% / 12 * 4);
            display: flex;
            justify-content: center;

            @media (max-width: 991px) {
                flex-basis: calc(100% / 12 * 6);
            }

            @media (max-width: 768px) {
                flex-basis: 100%;
            }

            .in-cart {
                border: 3px solid $orange;
            }

            .card {
                display: flex;
                // align-items: center;
                height: 140px;
                width: 360px;
                gap: 15px;
                border-radius: 20px;
                transition: $transition;
                overflow: hidden;
                background-color: $linen;

                @media (max-width: 1200px) {
                    width: 300px;
                    gap: 5px;
                }

                @media (max-width: 991px) {
                    width: 320px;
                    gap: 12px;
                }

                &:hover {
                    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
                    // transform: scale(1.05);
                    // height: 100%;
                    // padding: 10px 0;

                    .item-img {
                        transform: scale(1.05);
                    }
                }

                .item-img {
                    height: 140px;
                    aspect-ratio: 1 / 1;
                    border-radius: 20px;
                    object-fit: cover;
                }

                .item-info {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                    padding: 10px 10px 20px;

                    .item-name {
                        font-weight: 600;
                        font-size: 16px;
                    }

                    .cart-card-counter {
                        display: flex;
                        gap: 10px;
                        margin-top: 20px;
                        align-items: center;

                        @media (max-width: 1200px) {
                            gap: 5px;
                            ;
                        }

                        .price {
                            font-weight: 600;
                            font-size: 0.9rem;

                            @media (max-width: 1200px) {
                                font-size: 0.8rem;
                            }
                        }

                        .quantity {
                            font-size: 0.8rem;
                            font-weight: 600;
                            color: $orange;
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

                    .labels {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        width: 100%;
                        flex-grow: 1;

                        .label {
                            border-radius: 999px;
                            border: 1px solid black;
                            padding: 3px 10px;
                            line-height: 15px;
                            font-size: 10px;
                        }

                        .spicy {
                            color: red;
                            border-color: red;
                        }

                        .veg {
                            color: green;
                            border-color: green;
                        }

                        .gf {
                            color: darkgoldenrod;
                            border-color: darkgoldenrod;
                        }
                    }

                    .add-item {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        background-color: $orange;
                        color: white;
                        font-weight: 600;
                        padding: 0 15px;
                        line-height: 30px;
                        border-radius: 999px;
                        cursor: pointer;

                        &:hover {
                            background-color: $linen;
                            color: $orange;
                            border: 1px solid $orange;
                        }

                        &:active {
                            transform: scale(0.9);
                        }
                    }
                }
            }
        }
    }
}

.inactive {
    display: none;
}
</style>