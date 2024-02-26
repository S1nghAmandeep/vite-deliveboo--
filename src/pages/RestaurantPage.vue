<script>
import axios from 'axios';
import RestaurantProfile from '../components/RestaurantProfile.vue';
import ItemsList from '../components/ItemsList.vue';

export default {
    data() {
        return {
            items: [],
            restaurant: {}
        }
    },
    props: {
        slug: String,
    },
    components: {
        RestaurantProfile,
        ItemsList
    },
    methods: {
        fetchItems() {
            axios.get(`http://127.0.0.1:8000/api/items/${this.slug}`)
                .then(res => {
                    this.items = res.data.results.items
                    this.restaurant = res.data.results.user
                    console.log(this.restaurant);
                })
        }
    },
    created() {
        this.fetchItems()
    }
}
</script>

<template>
    <RestaurantProfile :restaurant="restaurant" />
    <ItemsList :items="items" />
</template>

<style lang="scss" scoped></style>