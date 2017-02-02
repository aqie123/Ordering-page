import Vue from 'vue';
import VueRouter from 'vue-router';
// 引用resource
import VueResource from 'vue-resource';
import App from './App';
// 引用组件
import goods from 'components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

// 引入stylus
import './common/stylus/index.styl';

// 使用路由
Vue.use(VueRouter);

// 全局注册使用resource
Vue.use(VueResource);

let app = Vue.extend(App);
// 2准备路由
let router = new VueRouter({  // 实例化可以传一些配置
  linkActiveClass: 'active'
});

// 配置路由
router.map({
  '/goods': {
    component: goods
  },
  '/ratings': {         // 这里前面加.出错了
    component: ratings
  },
  '/seller': {
    component: seller
  }
});

// 启动路由
router.start(app, '#app');

// 路由跳转
// router.go('/goods');
