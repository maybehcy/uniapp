<template>
  <!-- 
  1.导致问题的原因：在商品详情数据请求回来之前，data 中 goods_info 的值为 {}，因此初次渲染页面时，会导致 商品价格、商品名称 等闪烁的问题。
   2.解决方案：判断 goods_info.goods_name 属性的值是否存在，从而使用 v-if 指令控制页面的显示与隐藏：
   -->
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
		  <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
		    <image :src="item.pics_big" @click="preview(i)"></image>
		  </swiper-item>
		</swiper>
    
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <!-- 商品信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品的名字 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏图标 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
    </view>
    
    <!-- 富文本列表，节点列表 / HTML String -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    
    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧两个按钮的配置项 -->
      <!-- buttonGroup 右侧两个按钮的配置项 -->
      <!-- click 左侧两个按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧两个按钮的点击事件处理函数 -->
      <!-- fill右侧按钮的圆角 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        //商品详情数据
				  goods_info: {},
          options: [{
            icon: 'shop',
            text: '店铺',
            infoBackgroundColor: '#007aff',
            infoColor: "red"
          }, {
            icon: 'cart',
            text: '购物车',
            info: 2
          }],
          buttonGroup: [{
              text: '加入购物车',
              backgroundColor: '#ff0000',
              color: '#fff'
            },
            {
              text: '立即购买',
              backgroundColor: '#ffa200',
              color: '#fff'
            }
          ]
			};
		},
    onLoad(options) {
      console.log(options)
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    methods:{
      //商品详情数据
      async getGoodsDetail(goods_id) {
        const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id:goods_id })
        if (res.meta.status !== 200) return uni.$showMsg()
        //因为渲染出来的图片底部都有几个像素的边框，需要使用display:block去除
        //把返回来的字符串Html代码的<img标签利用正则表达式的方法全局替换成<img style="display:block;"
        //又因为返回来的字符串Html代码的图片后缀名为webp，在ios手机的支持不是很好，所以利用正则表达式全局替换成jpg
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
             // <img style=\"display:block;\" data-src=\"//image.suning.cn/uimg/sop/commodity/966602987133443585157120_x.jpg?from=mobile&amp;format=80q.webp\" alt=\"\" src=\"//image.suning.cn/uimg/sop/commodity/966602987133443585157120_x.jpg?from=mobile&format=80q.webp\" width=\"100%\" height=\"auto\">
        this.goods_info = res.message
      console.log(this.goods_info)
      },
      //商品详情轮播图，图片浏览事件
      preview(i) {
        //预览图片
        uni.previewImage({
          //图片索引值
          current: i,
          //对轮播图数据进行映射
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      //左侧按钮
      onClick(e) {
        console.log(e)
        //点击店铺按钮
        //{content: {icon: "shop", text: "店铺", infoBackgroundColor: "#007aff", infoColor: "red"}，index: 0}
        //点击购物车按钮
        //{ content: {icon: "cart", text: "购物车", info: 2}，index: 1}

        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      }
    }
	}
</script>

<style lang="scss">
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      color: #C00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        margin-right: 10px;
      }

      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }

    .yf {
      font-size: 12px;
      color: gray;
      margin: 10px 0;
    }
  }

  .goods_nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .goods-detail-container {
    padding-bottom: 50px;
  }
</style>

