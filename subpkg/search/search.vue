<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>

    <!-- 搜索建议列表 -->
    <!-- 只有当有数据才会渲染 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <!--没有数据展示 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //定义定时器
        timer: null,
        //输入框的内容
        kw: '',
        // 搜索的结果列表
        searchResults: [],
        // 搜索历史的数组
        historyList: []
      };
    },
    //页面加载时
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('historyList') || '[]')
    },
    methods: {
      // input 输入事件的处理函数
      input(e) {
        //如果存在定时器，清除定时器
        if(this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          //保存输入的信息
          this.kw = e.value
          // console.log(e.value)
          //根据文本框发送请求
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        // 判断搜索关键词是否为空
        if (this.kw.trim().length === 0) {
          uni.$showMsg("输入内容不能为空")
          this.kw=''
          this.searchResults = []
          return
        }

        const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw })
        if (res.meta.status !== 200) return uni.$showMsg()
        //保存关键词数据
        this.searchResults = res.message
     //保存历史关键词
        this.saveSearchHistory()
      },
      //点击了搜索出来的数据跳转到商品的详情页
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      //保存历史关键词
      saveSearchHistory() {
        // this.historyList.push(this.kw)
      // 1. 将 Array 数组转化为 Set 对象
        const set = new Set(this.historyList)
        // 2. 调用 Set 对象的 delete 方法，移除历史关键字数组里面有的元素
        set.delete(this.kw)
        // 3. 调用 Set 对象的 add 方法，向 Set 中添加新输入的元素
        set.add(this.kw)
        //set数据结构转换成数组
        console.log(set)
        this.historyList = Array.from(set)
        // 对搜索历史数据，进行持久化的存储，不然我们重新编译后历史数据就会不见了
        uni.setStorageSync('historyList', JSON.stringify(this.historyList))
      },
      //清除历史
      clean() {
        this.historyList = []
        uni.setStorageSync('historyList', '[]')
      },
      gotoGoodsList(kw) {
        uni.navigateTo({
          // url: '/subpkg/goods_list/goods_list?query=' + kw
          url: '/subpkg/goods_list/goods_list'
        })
      }
    },
    computed: {
      histories() {
        //历史记录的关键词，后输入在前面
        //又因为reverse方法会直接改变原数组，可能别的地方会用到该数据，所以定义一个新数组
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
