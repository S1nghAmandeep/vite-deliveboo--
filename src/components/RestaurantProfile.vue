<script>
export default {
    data() {
        return {
            PATH: 'http://127.0.0.1:8000/storage/',
        }
    },
    props: {
        restaurant: Object
    },
    methods: {
        showRest() {
            console.log(this.restaurant)
        }
    }
}
</script>

<template>
    <section class="profile">
        <img :src="this.PATH + restaurant.restaurant_img" alt="" class="hero-img">
        <div class="row">
            <div class="restaurant-name">{{ restaurant.business_name }}</div>
            <div class="restaurant-detail">
                <font-awesome-icon :icon="['fas', 'location-dot']" />
                <div>{{ restaurant.address }}</div>
            </div>
            <div class="restaurant-detail">
                <font-awesome-icon :icon="['fas', 'envelope']" />
                <div>{{ restaurant.email }}</div>
            </div>
            <div class="categories">
                <span class="category" v-for="category in restaurant.types">{{ category.name }}</span>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@use '../scss/partials/variables' as *;

.profile {
    position: relative;

    .hero-img {
        height: 60vh;
        width: 100%;
        object-fit: cover;
    }

    .row {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 40%;
        transform: translate(-50%, -50%);
        display: flex;
        background-color: rgba($color: $black, $alpha: 0.6);
        padding: 30px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        gap: 1rem;
        z-index: 2;
        border-radius: 20px;

        @media (max-width: 1200px) {
            width: 50%;
        }

        @media (max-width: 991px) {
            width: 100%;
        }

        .restaurant-name {
            font-size: 2rem;
            font-weight: 600;
        }

        .restaurant-detail {
            display: flex;
            align-items: center;
            gap: 0.5rem;
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
                border: 1px solid white;
                padding: 0.25rem 0.5rem;
                border-radius: 2rem;
            }
        }
    }
}
</style>