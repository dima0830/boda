import { createRouter, createWebHistory } from "vue-router";
import IndexView from "../views/index.vue";
import InvitadosView from "../views/invitados.vue";

const routes = [
  { path: "/", name: "home", component: IndexView },
  { path: "/invitados", name: "invitados", component: InvitadosView },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
