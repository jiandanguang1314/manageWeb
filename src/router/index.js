import Vue from 'vue'
import Router from 'vue-router'

const shopSystem = resolve => require(['@/components/shopSystem/shopList'], resolve)
const shopAdmin = resolve => require(['@/components/shopAdmin/shopList'], resolve)
const userAdmin = resolve => require(['@/components/userAdmin/userList'], resolve)
const role = resolve => require(['@/components/role/roleList'], resolve)
const user = resolve => require(['@/components/user/userList'], resolve)
const userDetail = resolve => require(['@/components/user/userDetail'], resolve)
const prole = resolve => require(['@/components/prole/proleList'], resolve)
const puserAdmin = resolve => require(['@/components/puserAdmin/puserList'], resolve)
const menber = resolve => require(['@/components/menber/menberList'], resolve)
const menu = resolve => require(['@/components/menu/menuList'], resolve)
const tradeShop = resolve => require(['@/components/tradelog/tradeList'], resolve)
const message = resolve => require(['@/components/message/messageList'], resolve)
const stock = resolve => require(['@/components/stock/stockList'], resolve)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/shopSystem'
    },
    {
      path: '/shopSystem',
      name: 'shopSystem',
      component: shopSystem
    },
    {
      path: '/shopAdmin',
      name: 'shopAdmin',
      component: shopAdmin
    },
    {
      path: '/userAdmin',
      name: 'userAdmin',
      component: userAdmin
    },
    {
      path: '/role',
      name: 'role',
      component: role
    },
    {
      path: '/user',
      name: 'user',
      component: user
    },
    // 用户详细信息
    {
      path: '/userDetail',
      name: 'userDetail',
      component: userDetail
    },
    {
      path: '/menber',
      name: 'menber',
      component: menber
    },
    {
      path: '/menu',
      name: 'menu',
      component: menu
    }, {
      path: '/prole',
      name: 'prole',
      component: prole
    },
    {
      path: '/puserAdmin',
      name: 'puserAdmin',
      component: puserAdmin
    },
    {
      path: '/tradeShop',
      name: 'tradeShop',
      component: tradeShop
    },
    {
      path: '/message',
      name: 'message',
      component: message
    },
    {
      path: '/stock',
      name: 'stock',
      component: stock
    }
  ]
})
