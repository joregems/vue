import { createRouter, createWebHistory } from 'vue-router'

const SignIn = () => import('@/components/SignIn.vue');
const SignUp = () => import('@/components/SignUp.vue');
const LogOut = () => import('@/components/LogOut.vue');
const UserListView = () => import('@/views/UserListView.vue');
const ProductListView = () => import('@/views/ProductListView.vue');
const ProductForm = () => import('@/components/shopping/Product/ProductForm.vue');
const ShoppingCartView = () => import('@/views/ShoppingCartView.vue');
const ImageUpload = () => import("@/components/ImageUpload.vue");

import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/AuthStore'

const enterSignin = async (to, from, next) => {
  const authStore = useAuthStore();
  const { is_logged, user, loading } = storeToRefs(authStore);
  if (is_logged.value) {
    router.push({ name: 'home' });
  }
  watch(is_logged, async (new_is_logged, old_is_logged) => {
    if (new_is_logged) {
      await router.push({ name: 'home' })
    }
  })
  next()
}

const list_allowed_directions = ['signin', 'signup']
const list_allowed_admin_only = ['createProduct', 'userlist']


const signIncnf = {
  component: SignIn,
  beforeEnter: [enterSignin]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/upload',
      name: 'upload',
      component: ImageUpload,
    },
    {
      path: '/products/create',
      name: 'createProduct',
      component: ProductForm,
    },
    {
      path: '/',
      name: 'home',
      component: ProductListView
    },
    {
      path: '/signin',
      name: 'signin',
      ...signIncnf

    },
    {
      path: '/login',
      name: 'login',
      ...signIncnf
    },
    {
      path: '/signUp',
      name: 'signup',
      component: SignUp,
      beforeEnter: [enterSignin]
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogOut,
    },
    {
      path: '/shoppingcart',
      name: 'shoppingcart',
      component: ShoppingCartView
    },
    {
      path: '/userlist',
      name: 'userlist',
      component: UserListView,
      props: true
    }
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.

  ]
})
router.beforeEach((to, from, next) => {
  document.title = to.name;
  next();
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { is_logged, user, loading } = storeToRefs(authStore);
  await authStore.$check_logged();
  const only_admin_allowed = (is_logged.value && !(user.value.role === "admin") && list_allowed_admin_only.includes(to.name))
  if (!is_logged.value && !list_allowed_directions.includes(to.name)) {
    next({ name: 'signin' });
    return
  }
  else if (only_admin_allowed) {
    next({ name: 'home' });
    return
  }
  watch(is_logged, async (new_is_logged, old_is_logged) => {
    if (!new_is_logged) {
      await router.push({ name: 'signin' })
    }
  })
  next();
  return
})
export default router
