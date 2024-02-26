<template>
    <section class="hero" id="home">
        <swiper :centeredSlides="true" :loop="true" :speed="2000" :effect="'fade'" :autoplay="{
            delay: 4000,
            disableOnInteraction: false,
        }" :pagination="false" :navigation="false" :modules="modules" class="mySwiper">
            <swiper-slide><img src="../assets/img/slide1.jpg" alt="slide1"></swiper-slide>
            <swiper-slide><img src="../assets/img/slide2.jpg" alt="slide2"></swiper-slide>
            <swiper-slide><img src="../assets/img/slide3.jpg" alt="slide3"></swiper-slide>
            <swiper-slide><img src="../assets/img/slide4.jpg" alt="slide4"></swiper-slide>
            <swiper-slide><img src="../assets/img/slide5.jpg" alt="slide5"></swiper-slide>

        </swiper>

        <div class="hero-content">
            <div class="container">
                <VueWriter :array="arr" :eraseSpeed="30" :typeSpeed="70" :caret="underscore" />
            </div>
        </div>

        <a href="#restaurants-list" class="btn">Ordina ora</a>


    </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';


// Import Swiper styles
import 'swiper/css';

import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';



// import required modules
import { Autoplay, EffectFade } from 'swiper/modules';
export default {
    components: {
        Swiper,
        SwiperSlide,
    },

    data() {
        return {
            modules: [Autoplay, EffectFade],
            arr: ["Scegli cosa mangiare", "Ordina con un click", "Al resto ci pensiamo noi"],

        }
    }

}
</script>

<style lang="scss" scoped>
@use '../scss/partials/variables' as *;

.hero {
    position: relative;
    height: calc(100vh);

    // padding-top: $height-header;
    .hero-content {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        position: absolute;
        inset: 0;
        // transform: translate(-50%, -50%);
        z-index: 10;
        color: $white;
        background-color: rgba($color: $black, $alpha: 0.3);
        font-size: clamp(1rem, 8vw, 6rem);
        font-weight: 600;
    }

    .btn {
        position: absolute;
        bottom: 2rem;
        z-index: 100;
        left: 50%;
        transform: translateX(-50%);
        background-color: $orange;
        color: $white;
        padding: 1rem 2.5rem;
        border-radius: 5rem;
        font-size: 1.25rem;
        font-weight: 600;
        cursor: pointer;
        transition: $transition;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            inset: 0;
            // border-radius: 5rem;
            background-color: $linen;
            z-index: -1;
            transform: scaleX(0);
            transform-origin: left;
            transition: $transition;
        }

        &:hover {
            color: $orange;
        }

        &:hover::after {
            transform: scaleX(1);
        }



    }
}

.swiper {
    width: 100%;
    height: 100%;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
}

.swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.swiper {
    margin-left: auto;
    margin-right: auto;
}
</style>