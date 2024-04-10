import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// import UserView from '@/views/UserView.vue'
import SignIn from '@/components/SignIn.vue'
import SignUp from '@/components/SignUp.vue'
import LogOut from '@/components/LogOut.vue'
import Users from '@/components/Test/Users.vue'
import UserListView from '@/views/UserListView.vue'
import ProductListView from '@/views/ProductListView.vue'
import ShoppingCartView from '@/views/ShoppingCartView.vue'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Reyes } from "@/components/Test/Reyes"
import { useAuthStore } from '@/stores/AuthStore'
import ShoppingCart from '@/components/shopping/ShoppingCart.vue'
// import ProductList from '../components/shopping/Products/ProductList.vue'
// import ProductList from '@/components/shopping/ProductList.vue'

const enterSignin = async (to, from, next) => {
  const authStore = useAuthStore();
  const { is_logged, user, loading } = storeToRefs(authStore);
  if(is_logged.value){
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

const signIncnf= {
  component: SignIn,
  beforeEnter: [enterSignin]
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/users',
      name: 'users',
      component: Users
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
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../components/Hello.vue')
      component: Reyes
    }
  ]
})

router.beforeEach(async (to, from, next) => {

  const authStore = useAuthStore();
  const { is_logged, user, loading } = storeToRefs(authStore);

  await authStore.$check_logged();

  if (!is_logged.value && !list_allowed_directions.includes(to.name)) {
    next({ name: 'signin' });
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
