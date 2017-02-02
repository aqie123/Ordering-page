<template>
  <div class="goods">
    <!-- 左侧导航栏 -->
    <div class="menu-wrapper" v-el:menu-wrapper>
      <!-- 要用-不能用驼峰，el大小写敏感 -->
      <ul>
        <li v-for="item in goods" class="menu-item" :class="{'current':currentIndex ===$index}" @click="selectMenu($index,$event)">
          <span class="text">
            <!-- classMap里面的是具体数值 -->
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!-- 右侧食品展示 -->
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 购物车组件  传入参数-->
    <shopcart v-ref:shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shopcart>  
    <!-- select-foods实现组件联动 -->
    <!-- v-ref 父组件访问子组件 -->
  </div>
  <food :food="selectedFood" v-ref:food></food>
</template>
<script type="module"> 
  import BScroll from 'better-scroll';
  // 引入购物车组件
  import shopcart from 'components/shopcart/shopcart'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import food from 'components/food/food'


  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],       // 开始goods为空，组件调用，从后端获得数据，赋值
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      currentIndex() {
        for(let i=0;i<this.listHeight.length;i++){
          //  获得上下区间范围
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i+1];
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {   //遍历foods
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {    //food是21行遍历的
            if(food.count) {
              foods.push(food);
            }
          });
        });
        return foods;           //这时可以在模板引用select food
      }
    },
    created() {
      this.classMap = ['decrease','discount','special','invoice','guarantee'];
      this.$http.get('./api/goods').then((response) => {    // 回调
        response = response.body;
        if(response.errno === ERR_OK){
          this.goods = response.data;
          // console.log(this.goods); 输出拿到数据
          // vue 更新dom是异步的
          this.$nextTick(() => {     // dom 真正变化在这个回调函数后面
            this._initScroll();     // 这样才能正确计算menu高度(让菜单和list滚动)
            this._calculateHeight(); // 计算高度
          });       
        };
      });
    },
    methods: {
       _drop(target) {
        // 优化体验，进行异步调用drop 动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);      //访问到子组件 drop小球
          // 调用shopcart 方法
        });  
        /* 实现了组件shopcart的dom元素，传递给父组件，父组件调用子组件方法，再把target传递给子组件
        在子组件拿到这个元素，获取位置
        */     
      },
      _initScroll() {
        // 接收两个参数dom对象，options
        this.menuScroll = new BScroll(this.$els.menuWrapper,{
          click: true       // better scroll可以点击(默认派发点击事件)
        });

        this.foodsScroll = new BScroll(this.$els.foodsWrapper,{
          probeType: 3,   //希望scroll滚动时实时告诉滚动位置
          click: true   
        });
        
        this.foodsScroll.on('scroll',(pos)=>{
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for(let i =0; i<foodList.length;i++) {
          let item =foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);

        }
      },
      selectMenu(index,event) {
        if(!event._constructed){         // 浏览器原生点击事件没有这个属性
          return;
        }
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook')
        // 访问dom
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el,300);
        // console.log(index);
      },
      // food组件用到方法
      selectFood(food,event) {
        if(!event._constructed) {         // 浏览器原生点击事件没有这个属性
          return;
        }
        // selectedFood才是传入food组件的值
        this.selectedFood = food;
        this.$refs.food.show();     //调用子组件food方法
      }
     
    },
    components: {
      shopcart,
      cartcontrol,
      food
    },
    events: {           //父组件接收到cartcontrol传来的事件
      'cart.add'(target) {      
        this._drop(target);    // 调用子组件方法
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/goods" 
</style> 