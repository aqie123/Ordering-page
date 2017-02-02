<template>
  <div class="ratings" v-el:ratings>
    <!-- 绑定bSscroll -->
    <div class="ratings-content">
      <!-- 和good组件一样，把视口固定 -->
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <!-- 这里通过v-show进行筛选 -->
          <li v-for="rating in ratings" class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
              <!-- 图片这里限制大小 -->
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <!-- 如果没有则不显示 -->
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="item in rating.recommend" class="item">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="module">
  import BScroll from 'better-scroll'
  // 2引入BSscroll
  import {formatDate} from 'common/js/data';
  import star from 'components/star/star' 
  import ratingselect from 'components/ratingselect/ratingselect' 
  import split from 'components/split/split'

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        // showFlag: false,
        selectType: ALL,
        onlyContent: true
      }
    },
    methods: {
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
    created() {
      //通过后端api方式拿到ratings
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if(response.errno === ERR_OK) {
          this.ratings = response.data;
          // 更改ratings，数据变了，dom没有立即更新 需要异步
          // 3初始化BSscroll
          this.$nextTick(() => {
              console.log("children"+this.$els.ratings);
              this.scroll = new BScroll(this.$els.ratings,{
              click: true
            });
          });
          
        }
      });
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      star,
      ratingselect,
      split
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
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus"> 
  @import "../../common/stylus/ratings.styl"
</style>