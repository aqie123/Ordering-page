<template>
  <div class="seller" v-el:seller>
    <div class="seller-content">

      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <!-- 收藏心 -->
        <div class="favorite">
          <span class="icon-favorite" :class="{'active':favorite}" @click="togglefavorite"></span>
          <span class="text" >{{favoriteText}}</span>
        </div>
      </div>

      <split></split>
      <!-- 公告 -->
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="item in seller.supports">
            <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
            <span class="text">{{seller.supports[$index].description}}</span>
          </li>
        </ul>
      </div> 
      <split></split>

      <!-- 商家实景图 -->
      <div class="pics">
        <h1 class="title">商家实景图</h1>
        <div class="pic-wrapper" v-el:pic-wrapper>
          <ul class="pic-list" v-el:pic-list>
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>

      <!-- 商家信息 -->
      <div class="info">
        <div class="title border-1px">商家信息</div>
        <ul>
          <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="module"> 
  import BScroll from 'better-scroll';
  import star from 'components/star/star';
  import split from 'components/split/split';
  import {saveToLocal} from 'common/js/store';
  import {loadFromLocal} from 'common/js/store';

  export default {
    props: {
      seller: {
         type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })() 
      }
    },
    computed: {
      favoriteText() {      // 计算属性
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    watch: {      // 通过watch观察数据变化
      'seller'() {
        this._initScroll();
        this._initPics();
      }
    },
    created() {
      this.classMap = ['decrease','discount','special','invoice','guarantee'];
    },
    // 确认页面渲染以后再引入bsscroll    记得和前面对比
    ready() {     // 这里写的代码，都能安全使用dom 
      this._initScroll(); 
      this._initPics();     // 保证切屏回来还能滚动
    },
    methods: {
      _initScroll() {       // 初始化Bscroll
        if(!this.scroll) {
          // console.log(this.seller);   // dom没有被撑开，这是异步获取数据
          this.scroll = new BScroll(this.$els.seller,{
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPics() {
        // 商家实景图左右滑动
        if(this.seller.pics) {    // 存在图片
          // 手动设置图片li宽度超过ul宽度
          let picWidth =120;
          let margin =6;
          let width = (picWidth+margin)*this.seller.pics.length - margin;
          this.$els.picList.style.width = width +'px'; // 给ul设置宽度
          this.$nextTick(() => {      // 宽度重绘
            if(!this.picScroll){
              this.picScroll = new BScroll(this.$els.picWrapper,{
                scrollX: true,
                eventPassthrough: 'vertical'    //横向滚动时忽略竖向滚动
              });
            } else {
              this.picScroll.refresh();
            }
          });
        } 
      },
      togglefavorite(event) {       // BSscroll里面点击事件
        if (!event._constructed){
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id,'favorite',this.favorite);
      }
    },
    components: {
      star,
      split
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/seller.styl" 
</style>