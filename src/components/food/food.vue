<template>
  <div v-show="showFlag" class="food" transition="move" v-el:food>
    <div class="food-content">
      <div class="image-header">
        <!-- 图片加载是个异步过程 -->
        <img :src="food.image">
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>     
      </div>

      <!-- 内容部分 -->
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
        </div>

        <!-- 购物车部分 -->
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food"></cartcontrol>
        </div>
        <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0" transition="fade">
          加入购物车
        </div>
      </div>
      <!-- 内容结束 -->
      <split v-show="food.info"></split>

      <!-- 商品信息 -->
      <div class="info" v-show="food.info">
        <!-- food.info存在div才会被显示 -->
        <div class="title">商品信息</div>
        <p class="text">{{food.info}}</p>
      </div>
      
      <!-- 评论部分 -->
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <!-- 评论分类按钮 -->
        <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
        <!-- 这里要写成中画线 -->
        <!-- 评论内容 -->
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <!-- v-show绑定函数 -->
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img :src="rating.avatar" class="avatar" width="12" height="12">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'icon-thumb_down':rating.rateType===1,'icon-thumb_up':rating.rateType===0}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="module"> 
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import split from 'components/split/split'
  import ratingselect from 'components/ratingselect/ratingselect'
  // 引入时间格式化函数 带大括号，export 函数
  import {formatDate} from 'common/js/data'

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {        //出入到cartcontrol
      food: {
        type: Object
      }
    },
    data() {          //data观测数据变化
      return{
       showFlag: false,
       selectType: ALL,
       onlyContent: true,
       desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
       }
      };

    },
    methods: {        //父组件是可以调用子组件方法的
      show() {
        // 这里才是传过去数据默认值
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = true;
        // 页面展示时候添加BSscroll
        this.$nextTick(() => {  //保证页面被渲染，高度才被计算对
          if(!this.scroll){
            this.scroll = new BScroll(this.$els.food,{
              click: true
            });
          }else {
            this.scroll.refresh();
          }

        })
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event){
        // console.log("click");
        if(!event._constructed){
          return;
        }
        // console.log(event.target);      // 这个是什么
        this.$dispatch('cart.add',event.target);   // 派发点击事件
        // 通过渐隐动画，拿到正确位置
        Vue.set(this.food,'count',1);
      },
      needShow(type, text) {
        if(this.onlyContent && !text) {       // 只有内容，没有文本
          return false;
        }
        if(this.selectType === ALL) {         // 选择上显示所有
          return true;
        }else {                                // 判断当前type和selectType是否相等
          return type === this.selectType;      // 一直才被显示
        }
      },
    },
    events: {           // 当点击按钮时，评论数随之联动
      'ratingtype.select'(type) {
        this.selectType = type;
        // 异步更新,不然高度显示不正常
        this.$nextTick(() => {
         this.scroll.refresh();      // 这里关联betterScroll,动态改变高度         
        });
      },
      'content.toggle'(onlyContent) {
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });  
      }
    },
    filters: {
      // 时间格式化
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus"> 
  @import "../../common/stylus/food"
</style>