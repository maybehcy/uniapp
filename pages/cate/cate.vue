<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <!-- <my-search :bgcolor="'pink'" :radius="3"></my-search> -->
    <my-search @click="gotoSearch"></my-search>

    <view class="scroll-view-container">
      <!-- 左侧的滑动区域 -->
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
        <block v-for="(item, i) in cateList" :key="i">
          <!-- 动态添加active属性 -->
          <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧的滑动区域 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <!-- 循环二级分类 -->
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">{{item2.cat_name}}</view>
          <!-- 当前二级分类下的三级分类列表 -->
          <view class="cate-lv3-list">
            <!-- 三级分类的Item项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 三级分类的文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
     // 将 badgeMix 混入到当前的页面中进行使用
      mixins: [badgeMix],
    data() {
      return {
        // 当前设备可用的高度
        wh: 0,
        cateList: [],
        //激活项
        active: 0,
        // 二级分类的列表
        cateLevel2: [],
        //当我们点击一级分类后，滑动二级分类
        //我又点击其他一级分类，对应的二级分类没有置顶，保留着第一次二级分类的位置
        scrollTop: 0
      };
    },
    onLoad() {
      //获取屏幕可用高度
      const sysInfo = uni.getSystemInfoSync()
      //减去搜索区域的高度
      this.wh = sysInfo.windowHeight-50

      this.getCateList()
    },
    methods: {
      // 获取分类列表的数据
      async getCateList() {
        const { data: res } = await uni.$http.get('/api/public/v1/categories')
        console.log(res)
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message

        // 为默认选中的大家电二级分类赋值
        this.cateLevel2 = res.message[0].children
      },
      //点击某一项
      activeChanged(i) {
        this.active = i
        // 重新为二级分类赋值
        this.cateLevel2 = this.cateList[i].children
         //如果这里直接赋值为0的话是不可以的，和上面定义的data变量没有改变
         //当我们点击其他一级菜单的时候，对应的二级菜单不会置顶
         //this.scrollTop=0
         //当我们点击其他一级菜单时我们判断一开始滚动位置是否为0，如果为0，就置换成1，因为1像素用户是看不出来的
         //如果不为0，就重置为0
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      //点击3级菜单， 跳转到商品列表页面
      gotoGoodsList(item) {
        //跳转到非tabbar，编程式导航
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
          // url: '/subpkg/goods_list/goods_list
        })
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #FFFFFF;
          position: relative;

          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #C00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  .cate-lv2-title {
    margin: 0 auto;
    width: 50px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 5px 50px;
    border: 1px solid #333333;
    border-radius: 10px;
    margin-top: 30px;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
