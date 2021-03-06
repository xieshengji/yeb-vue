import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";
import Lock from "@/views/Lock";
import FriendChat from "@/views/chat/FriendChat";
import AdminInfo from "@/views/AdminInfo";

Vue.use(VueRouter)
// export default new VueRouter({
//   routes: [
//     {
//       path: '/',
//       name: 'Login',
//       component: Login,
//       hidden: true
//     }
//   ]
// })


const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
  },
  {
    path: '/lock',
    name: '解锁',
    component: Lock,
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/chat',
        name: '在线聊天',
        component: FriendChat,
      },
      {
        path: '/userinfo',
        name: '个人中心',
        component: AdminInfo,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
