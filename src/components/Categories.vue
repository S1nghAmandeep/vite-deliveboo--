<script>
import { store } from '../store'
export default {
    data() {
        return {
            store: store
        }
    },
    methods: {
        pushType(category) {
            if(category.isOn) {
                const index = this.store.request.types_id.indexOf(category.id);
                this.store.request.types_id.splice(index, 1);
            }
            else {
                this.store.request.types_id.push(category.id);
            }
            category.isOn = !category.isOn
            this.$emit('fetch-restaurants');
        }
    }
}
</script>

<template>
    <!-- <div class="categories-list">
        <div class="category" v-for="category in store.categories">
            <input type="checkbox" :name="category.name" :id="category.name" class="my-checkbox" :checked="category.isOn" @click="pushType(category)">
            <label :for="category.name">
                <img :src="category.img" alt="image">
                <span>{{ category.name }}</span>
            </label>
        </div>
    </div> -->

    <div class="categories-list">
        <div class="category" v-for="category in store.categories">
            <input type="checkbox" :name="category.name" :id="category.name" class="my-checkbox" :checked="category.isOn" @click="pushType(category)">
            <label :for="category.name">
                
                {{ category.name }}
            </label>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../scss/partials/variables' as *;

// .categories-list {
//     display: none;
//     align-items: center;
//     justify-content: center;
//     flex-wrap: wrap;
//     gap: 1rem;
//     margin-bottom: 2rem;

//     .category {
//         position: relative;
//         display: flex;



//         input {
//             appearance: none;
//         }

//         label {
//             display: block;
//             position: relative;
//             height: 100px;
//             aspect-ratio: 16 /9;
//             border-radius: 0.25rem;
//             overflow: hidden;
//             transition: $transition;
//             cursor: pointer;

//             &:hover {
//                 box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px;

//                 img {
//                     transform: scale(1.1);
//                 }

//             }

//             &::after {
//                 content: '';
//                 position: absolute;
//                 inset: 0;
//                 background-color: rgba($color: $black, $alpha: 0.1);
//             }

//             img {
//                 height: 100%;
//                 width: 100%;
//                 object-fit: cover;
//                 transition: $transition;
//             }

//             span {
//                 position: absolute;
//                 right: 0.5rem;
//                 top: 0.5rem;
//                 background-color: $charcoal;
//                 color: $white;
//                 padding: 0.25rem 0.5rem;
//                 border-radius: 5rem;
//                 z-index: 10;
//                 transition: $transition;
//             }

//         }

//         input:checked~label span {
//             background-color: $orange;
//         }

        
//     }
// }

.categories-list {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;

    .category {
        display: flex;
        
    }

    input {
        appearance: none;
    }

    label {
        display: block;
        background-color: $charcoal;
        color: $white;
        padding: 0.5rem 1rem;
        border-radius: 5rem;
        cursor: pointer;
        transform: scale(1);
        transition: $transition;
        &:hover {
            transform: scale(1.1);
        }
    }

    input:checked + label {
        background-color: $orange;
    }

}

// @media (min-width: 1024px) {
//     .categories-list{
//         display: none;
//     }

//     .categories-list {
//         display: flex;
//     }
// }

</style>