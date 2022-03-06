<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          //搜索框的关键词
          query: '',
          //商品的id
          cid: '',
          //当前页码
          pagenum: 1,
          //每一页的条数
          pagesize: 10
        },
        //商品数据
        goodsList: [],
        //数据总条数
        total: 0,
        // 节流阀
        isloading: false
      };
    },
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
       console.log(options,this.queryObj)
      this.getGoodsList()
    },
    methods: {
      // 获取商品列表数据的方法
      async getGoodsList(cb) {
        // 打开节流阀
        this.isloading = true
        const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀
        this.isloading = false
        //关闭下拉刷新事件
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()

        this.goodsList = [...this.goodsList, ...res.message.goods]
        console.log(this.goodsList)
        this.total = res.message.total
      },
      gotoDetail(goods) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },
    //上拉加载更多的事件
    onReachBottom() {
      //如果我们的页数*页码大于总条数，就说明数据加载完成
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕!')
     //如果isloading为true,不能发送请求
      if (this.isloading) return
      // 让页码值自增+1，请求下一页的数据
      this.queryObj.pagenum++
      //发送请求
      this.getGoodsList()
    },
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      //关闭节流阀
      this.isloading = false
      this.goodsList = []
      // 重新发起数据请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">

</style>
