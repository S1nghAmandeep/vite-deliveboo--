<template>
  <Header />
  <main>
    <RouterView></RouterView>
  </main>

  <!-- <Footer /> -->
</template>

<script>
import Header from './components/Header.vue';
import { store } from './store';
// import  Footer from './components/Footer.vue';

export default {
  components: {
    Header,

  },
  data() {
    return {
      store,
    }

  },
  created() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.store.currentUser = JSON.parse(currentUser);
    }
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.store.cart = JSON.parse(savedCart);
    }
  }
}

</script>

<style lang="scss">
@use './scss/app.scss';
@use './scss/partials/variables' as *;
</style>
