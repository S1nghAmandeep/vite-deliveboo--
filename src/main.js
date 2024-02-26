import { createApp } from "vue";
// import './style.css'
import App from "./App.vue";

import { router } from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import VueWriter from "vue-writer";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faUserSecret,
  faExpand,
  faCircleXmark,
  faDrum,
  faCompactDisc,
  faHeadphones,
  faMusic,
  faCloud,
  faGuitar,
  faRocket,
  faTrophy,
  faCalendarDays,
  faUserTie,
  faXmark,
  faBarsStaggered,
  faRightLong,
  faPepperHot,
  faSeedling,
  faWheatAwnCircleExclamation,
  faCartPlus,
  faLocationDot,
  faEnvelope,
  faTrashCan,
  faMinus,
  faPlus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  faUser,
  faHeart,
  faCirclePlay,
} from "@fortawesome/free-regular-svg-icons";
import {
  faOpencart,
  faSpotify,
  faYoutube,
  faSafari,
  faInstagram,
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
library.add(
  faUserSecret,
  faUser,
  faHeart,
  faOpencart,
  faExpand,
  faCircleXmark,
  faCirclePlay,
  faDrum,
  faCompactDisc,
  faHeadphones,
  faSpotify,
  faYoutube,
  faSafari,
  faMusic,
  faCloud,
  faGuitar,
  faRocket,
  faTrophy,
  faCalendarDays,
  faInstagram,
  faFacebook,
  faTwitter,
  faUserTie,
  faOpencart,
  faXmark,
  faBarsStaggered,
  faRightLong,
  faPepperHot,
  faSeedling,
  faWheatAwnCircleExclamation,
  faCartPlus,
  faLocationDot,
  faEnvelope,
  faTrashCan,
  faMinus,
  faPlus,
  faArrowLeft
);

createApp(App)
  .use(router)
  .use(VueWriter)
  .use(Toast)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
