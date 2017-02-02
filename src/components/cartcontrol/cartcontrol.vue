<template>
  <div class="cartcontrol">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)" transition="move">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>
<script type="module"> 
  import Vue from 'vue'  // 接收不到新建变量的变化
  export default {
     
    props: {        //food是父组件传过来的对象。修改food属性，会影响到good组件
      food: {
        type: Object
      }
    },
    created() {
      // console.log(this.food) 
    },
    methods: {
      addCart(event) {
        if(!event._constructed){         // 浏览器原生点击事件没有这个属性
          return;
        };
        
        if (!this.food.count) {
          Vue.set(this.food,'count',1);   //这样就能观测到变量变化
          this.food.count = 1;
        } else {
          this.food.count++
        };
        // console.log(this.food.count);
        this.$dispatch('cart.add',event.target);       // 点击商品时候，派发事件
        // dom 对象作为事件参数传入
      },
      decreaseCart(event) {
        if(!event._constructed){         // 浏览器原生点击事件没有这个属性
          return;
        };

        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus"> 
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      transition all 0.4s linear
      &.move-transition
        opacity 1
        /*硬件加速*/
        transform translate3d(0, 0, 0)
        .inner
          /*让他有宽高*/
          display inline-block
          line-height 24px
          font-size 24px 
          color rgb(0,160,220) 
          transition all 0.4s linear
          transform rotate(0)
      &.move-enter, &.move-leave
        opacity 0
        transform translate3d(24px, 0 ,0) 
        .inner
          transform rotate(180deg) 
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147,153,159)
    .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px 
      color rgb(0,160,260)


</style>