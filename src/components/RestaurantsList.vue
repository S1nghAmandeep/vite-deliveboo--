<script>
import vueDebounce from 'vue-debounce';
import Categories from '../components/Categories.vue';
import axios from 'axios';
import { store } from '../store'
export default {
    directives: {
        debounce: vueDebounce({ lock: true })
    },
    data() {
        return {
            store: store,
            restaurantsArray: [],
            PATH: 'http://127.0.0.1:8000/storage/',
            debounceTimer: null
        }
    },
    components: {
        Categories
    },
    methods: {
        fetchRestaurants() {
            axios.get('http://127.0.0.1:8000/api/users')
                .then(res => {
                    this.restaurantsArray = res.data.results;
                    console.log(this.restaurantsArray);
                })
        },
        fetchRestaurantsByName() {
            // Cancella il timer del debounce se è già stato avviato
            clearTimeout(this.debounceTimer);

            // Avvia un nuovo timer per eseguire la funzione dopo 500ms (1/2 secondo)
            this.debounceTimer = setTimeout(() => {
                axios.post('http://127.0.0.1:8000/api/users', this.store.request)
                    .then(res => {
                        this.restaurantsArray = res.data.results;
                    });
            }, 500);
        },
        resetFilter() {
            this.store.request.name = '';
            this.store.request.types_id = [];
            this.store.categories.forEach(element => {
                element.isOn = false;
            });
            this.fetchRestaurantsByName()
        }
    },
    created() {
        this.fetchRestaurants();
    }
}
</script>

<template>
    <section class="restaurants-list" id="restaurants-list">
        <div class="container">
            <h2 class="title">Cosa vuoi mangiare?</h2>
            <div class="search">
                <input type="text" name="restaurant-name" id="restaurant-name" class="restaurant-search"
                    placeholder="Cerca il nome di un ristorante" v-model="store.request.name"
                    @keyup="fetchRestaurantsByName()">

                <button class="btn" @click="resetFilter()">Reset</button>
            </div>


            <Categories @fetch-restaurants="fetchRestaurantsByName()" />
            <!-- <button class="btn">Cerca</button> -->

            <div class="grid">
                <div class="restaurant-card" v-for="restaurant in restaurantsArray">
                    <div class="restaurant-card-image">
                        <img :src="this.PATH + restaurant.restaurant_img" alt="cover">
                    </div>
                    <div class="restaurant-card-body">
                        <h4 class="name">{{ restaurant.business_name }}</h4>
                        <p class="address">{{ restaurant.address }}</p>
                        <div class="categories">
                            <span class="category" v-for="category in restaurant.types">{{ category.name }}</span>
                        </div>
                        <router-link class="link"
                            :to="{ name: 'restaurant.show', params: { slug: restaurant.slug } }">Guarda
                            il menù</router-link>
                    </div>
                </div>
                <div class="not-found" v-if="restaurantsArray.length == 0">Nessun ristorante trovato</div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@use '../scss/partials/variables' as *;

section.restaurants-list {
    padding-top: 6rem;
    min-height: 100vh;

    .title {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 2rem;
    }

    .search {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .btn {
        display: block;
        background-color: $orange;
        color: $white;
        padding: 0.5rem 2rem;
        font-size: 1rem;
        border-radius: 5rem;
        cursor: pointer;
        // margin-inline: auto;
    }

    input.restaurant-search {
        display: block;
        width: min(500px, 100%);
        outline: none;
        color: $charcoal;
        // margin-inline: auto;
        border: 1px solid $silver;
        padding: 0.5rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-family: 'Outfit', sans-serif;

        // margin-bottom: 2rem;
        &:focus {
            border-color: $orange;
        }

    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        margin-block: 3rem;
    }

    .restaurant-card {
        display: flex;
        flex-direction: column;
        border-radius: 1rem;
        overflow: hidden;
        background-color: $linen;
        transition: $transition;

        &:hover {
            box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
        }

        .restaurant-card-image {
            height: 250px;
            transform: scale(1);
            overflow: hidden;

            img {
                height: 100%;
                width: 100%;
                object-fit: cover;
                transform: scale(1);
                transition: $transition;

                &:hover {
                    transform: scale(1.1);
                }
            }
        }

        .restaurant-card-body {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: start;
            // height: 100%;
            gap: 1rem;
            padding: 2rem;

            .name {
                font-size: 1.5rem;
                // margin-bottom: 1rem;
                cursor: pointer;
                color: $charcoal;
                transition: $transition;

                &:hover {
                    color: $orange;
                }
            }

            .address {
                // margin-bottom: 1rem;
                font-weight: 300;
                color: $charcoal;
            }

            .categories {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: 0.5rem;
                font-size: 0.75rem;
                font-weight: 600;
                margin-bottom: 1rem;
                flex-grow: 1;

                .category {
                    background-color: transparent;
                    border: 1px solid $silver;
                    color: $silver;
                    padding: 0.25rem 0.5rem;
                    border-radius: 2rem;
                }
            }

            .link {
                background-color: $orange;
                border-radius: 5rem;
                transform: scale(1);
                transition: $transition;
                cursor: pointer;
                color: $white;
                padding: 0.5rem 1rem;
                text-align: center;
            }
        }
    }
}
</style>