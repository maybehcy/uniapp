<template>
	<view class="cart-container" v-if="cart.length !== 0">
    <!-- 收货地址组件 -->
    <my-address></my-address>
    
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
		  <!-- 左侧的图标 -->
		  <uni-icons type="shop" size="18"></uni-icons>
		  <!-- 描述文本 -->
		  <text class="cart-title-text">购物车</text>
		</view>
    
    <!-- 商品列表区域 -->
    <uni-swipe-action>
      <block v-for="(goods, i) in cart" :key="i">
        <uni-swipe-action-item :options="options" @click="swipeItemClickHandler(goods)">
          <my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    
    <!-- 自定义组件 -->
    <my-settle></my-settle>
	</view>
  
  <!-- 空白购物车区域 -->
    <view class="empty-cart" v-else>
      <image src="/static/cart_empty@2x.png" class="empty-img"></image>
      <text class="tip-text">空空如也</text>
    </view>
</template>

<script>
  // 按需导入 mapState 这个辅助函数
  import { mapState, mapMutations } from 'vuex'
  
 // 按需导入 mapGetters 这个辅助方法
 // import { mapGetters } from 'vuex'
 
 // 导入自己封装的 mixin 模块
 import badgeMix from '@/mixins/tabbar-badge.js'
 export default {
    // 将 badgeMix 混入到当前的页面中进行使用
     mixins: [badgeMix],
   data() {
     return {
       //配置划出区域的样式
       options: [{
         text: '删除',
         style: {
           backgroundColor: '#C00000'
         }
       }]
     }
   },
   computed: {
     // 将 m_cart 模块中的 total 映射为当前页面的计算属性
     // ...mapGetters('m_cart', ['total']),
     
      // 将 m_cart 模块中的 cart 数组映射到当前页面中使用
         ...mapState('m_cart', ['cart'])
   },
   // onShow() {
   //    // 在页面刚展示的时候，设置数字徽标
   //    this.setBadge()
   //    console.log("页面展示")
   // },
   methods: {
     ...mapMutations('m_cart', ['updateGoodsState','updateGoodsCount', 'removeGoodsById']),
      // setBadge() {
      //    // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      //    uni.setTabBarBadge({
      //       index: 2, // 索引由0开始
      //       text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
      //    })
      // }
      
      //单选框改变事件
      radioChangeHandler(e){
        //e是传过来的参数
        console.log(e)
        this.updateGoodsState(e)
      },
      //表单
      numberChangeHandler(e) {
        console.log(e)
        this.updateGoodsCount(e)
      },
      swipeItemClickHandler(goods) {
        console.log(goods)
        this.removeGoodsById(goods.goods_id)
        
      }
   }
 }

</script>

<style lang="scss">
 .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 5px;
    border-bottom: 1px solid #EFEFEF;

    .cart-title-text {
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
  
    .empty-img {
      width: 90px;
      height: 90px;
    }
  
    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
