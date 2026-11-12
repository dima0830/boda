import { createApp, type Directive } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./assets/css/main.css";

/* v-revelar: el elemento aparece suavemente cuando entra en pantalla (una sola vez) */
const revelar: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add("revelar");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
  },
};

const app = createApp(App);
app.use(router);
app.directive("revelar", revelar);
app.mount("#app");
