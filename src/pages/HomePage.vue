<template>
    <Hero />
    <RestaurantList />
</template>

<script>
import Hero from '../components/Hero.vue';
import RestaurantList from '../components/RestaurantsList.vue'

export default {
    components: {
        Hero,
        RestaurantList
    }

}
</script>

<style lang="scss" scoped></style>