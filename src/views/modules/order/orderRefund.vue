<template>
  <div class="mod-order-order">
    <div class="screening-conditions">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList(this.page)">
        <div>
          &nbsp;&nbsp;&nbsp;
          <el-form-item label="退款编号：">
            <el-input v-model="searchForm.refundSn" placeholder="退款编号" clearable size="small"></el-input>
          </el-form-item>
          <!-- <el-form-item label="商品名称：">
            <el-input v-model="dataForm.prodName" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>-->

          <el-form-item label="售后状态：">
            <template>
              <el-select
                v-model="returnMoneySts"
                clearable
                placeholder="请选择订单状态"
                size="small"
                @change="orderRefundStatus"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item label="退款类型：">
            <template>
              <el-select
                v-model="searchForm.refundType"
                clearable
                placeholder="请选择售后状态"
                size="small"
              >
                <el-option
                  v-for="item in refundType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>
        </div>

        <div>
          &nbsp;&nbsp;&nbsp;
          <el-form-item label="订单编号：">
            <el-input v-model="searchForm.orderNumber" placeholder="订单编号" clearable size="small"></el-input>
          </el-form-item>

          <el-form-item label="订单类型：">
            <template>
              <el-select
                v-model="searchForm.orderType"
                clearable
                placeholder="请选择订单类型"
                size="small"
              >
                <el-option
                  v-for="item in orderType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item label="申请方式：">
            <template>
              <el-select
                v-model="searchForm.applyType"
                clearable
                placeholder="请选择申请方式"
                size="small"
              >
                <el-option
                  v-for="item in applyType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>
        </div>

        <div>
          &nbsp;&nbsp;&nbsp;
          <el-form-item label="下单时间：">
            <el-date-picker
              size="small"
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="setDateRange(1)">今天</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="setDateRange(2)">昨天</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="setDateRange(3)">近七天</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="setDateRange(4)">近30天</el-button>
          </el-form-item>
        </div>

        <div class="operation-box">
          <el-form-item>
            <el-button
              class="operation-btn"
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchChange()"
            >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="operation-btn" icon="el-icon-delete" size="small" @click="clear()">清空</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main">
      <div class="content">
        <!-- 导航 -->
        <div class="status-nav clearfix">
          <ul class="nav-list-ul clearfix">
            <li
              :class="['nav-item-li',sts == 0?'selected':'']"
              data-sts="0"
              @click="selectNav($event)"
            >全部</li>
            <li
              :class="['nav-item-li',sts == 1?'selected':'']"
              data-sts="1"
              @click="selectNav($event)"
            >买家申请</li>
            <li
              :class="['nav-item-li',sts == 2?'selected':'']"
              data-sts="2"
              @click="selectNav($event)"
            >卖家接受</li>
            <li
              :class="['nav-item-li',sts == 3?'selected':'']"
              data-sts="3"
              @click="selectNav($event)"
            >买家发货</li>
            <li
              :class="['nav-item-li',sts == 4?'selected':'']"
              data-sts="4"
              @click="selectNav($event)"
            >卖家收货</li>
            <li
              :class="['nav-item-li',sts == 5?'selected':'']"
              data-sts="5"
              @click="selectNav($event)"
            >退款成功</li>
            <li
              :class="['nav-item-li',sts == 6?'selected':'']"
              data-sts="6"
              @click="selectNav($event)"
            >撤回申请</li>
            <li
              :class="['nav-item-li',sts == 7?'selected':'']"
              data-sts="7"
              @click="selectNav($event)"
            >商家拒绝</li>
            <li
              :class="['nav-item-li',sts == -1?'selected':'']"
              data-sts="-1"
              @click="selectNav($event)"
            >退款关闭</li>
          </ul>
          <ul class="nav-right"></ul>
        </div>

        <!-- 列标题 -->
        <div :class="['tit',showHeadScroll?'fixed-top':'']">
          <el-row style="width:100%">
            <el-col :span="7">
              <span class="item product">商品</span>
            </el-col>
            <el-col :span="3" class="transaction-price">
              <span class="item">商品单价(元)/数量</span>
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">退款金额(元)</span>
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">商品状况</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">退款类型</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">订单状态</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">售后状态</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">操作</span>
            </el-col>
          </el-row>
        </div>

        <div class="prod" v-for="orderRefund in dataList" :key="orderRefund.refundId">
          <div class="prod-tit">
            <span>退款编号：{{orderRefund.refundSn}}</span>
            <span>订单编号：{{orderRefund.orderNumber}}</span>
            <span>申请时间：{{orderRefund.applyTime}}</span>
            <span>店铺名称：{{orderRefund.shopName}}</span>
            <!-- <span>买家：19999999999</span>
            <span >联系电话：19999999999</span>-->
          </div>
          <div class="prod-cont">
            <el-row style="width:100%">
              <el-col :span="10">
                <div class="prod-item">
                  <div
                    class="items name"
                    v-for="orderItem in orderRefund.orderItems"
                    :key="orderItem.orderItemId"
                  >
                    <div class="prod-image">
                      <img :src="resourcesUrl + orderItem.pic" />
                    </div>
                    <div class="prod-name">
                      <dir class="prod-con">
                        <div class="prod-name-txt">{{orderItem.prodName}}</div>
                        <div
                          class="order-status"
                          v-if="orderRefund.orderType === 1 || orderRefund.orderType === 2"
                        >{{orderRefund.orderType === 1?'团购订单':orderRefund.orderType === 2?'秒杀订单':''}}</div>
                        <div
                          class="order-status"
                          v-if="orderRefund.refundStatus"
                        >{{['','申请退款','退款成功','退款成功','退款关闭'][orderRefund.refundStatus]}}</div>
                      </dir>
                    </div>
                    <div class="prod-price">
                      <span>{{(orderItem.price).toFixed(2)}}</span>
                      <span>{{orderItem.prodCount}}件</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%;">
                <div class="item">
                  <div>
                    <span class="totalprice">{{(orderRefund.refundAmount).toFixed(2)}}</span>
                    <span>共{{orderRefund.goodsNum}}件</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%;">
                <div class="item">
                  <div class="buyer-info">
                    <span>{{(orderRefund.applyType === 1?'仅退款':'退货退款')}}</span>
                    <span class="totalprice">{{(orderRefund.isReceiver === 1? '已收到商品':'未收到商品')}}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%;">
                <div class="item">
                  <div>
                    <span v-if="orderRefund.refundType === 1">整单退款</span>
                    <span v-if="orderRefund.refundType === 2">单个物品退款</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%;">
                <div class="item">
                  <!-- <span v-if="order.refundStatus === 1" size="small" type="danger">退款申请中</span> -->
                  <span v-if="orderRefund.status === 1" size="small" type="danger">待付款</span>
                  <span v-else-if="orderRefund.status === 2" size="small" type="danger">待发货</span>
                  <span v-else-if="orderRefund.status === 3" size="small" type="danger">待收货</span>
                  <span v-else-if="orderRefund.status === 7" size="small" type="danger">待成团</span>
                  <span v-else-if="orderRefund.status === 5" size="small" type="danger">交易成功</span>
                  <span v-else-if="orderRefund.status === 6" size="small">交易失败</span>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%;">
                <div class="item">
                  <span v-if="orderRefund.returnMoneySts === 1" size="small" type="danger">买家申请</span>
                  <span v-else-if="orderRefund.returnMoneySts === 2" size="small" type="danger">卖家接受</span>
                  <span v-else-if="orderRefund.returnMoneySts === 3" size="small" type="danger">买家发货</span>
                  <span v-else-if="orderRefund.returnMoneySts === 4" size="small" type="danger">卖家收货</span>
                  <span v-else-if="orderRefund.returnMoneySts === 5" size="small" type="danger">退款成功</span>
                  <span
                    v-else-if="orderRefund.returnMoneySts === 6"
                    size="small"
                    type="danger"
                  >买家撤回申请</span>
                  <span v-else-if="orderRefund.returnMoneySts === 7" size="small" type="danger">商家拒绝</span>
                  <span v-else size="small" type="danger">退款关闭</span>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%;">
                <div class="item">
                  <div class="operate">
                    <el-button
                      type="text"
                      size="small"
                      @click="viewOrderHandle(orderRefund.orderNumber)"
                    >查看订单</el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="refundHandle(orderRefund.refundId,orderRefund.shopId)"
                    >处理退款</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- <div class="remark">
            <div class="buyer-remark">
              <span>备注:{{order.remarks}}</span>
            </div>
          </div>-->
        </div>
        <div class="empty" v-if="!dataList.length">暂无数据</div>
      </div>
    </div>
    <el-pagination
      v-if="dataList.length"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="page.pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗  -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <order-info v-if="orderInfoVisible" ref="OrderInfo" @refreshDataList="refreshChange"></order-info>
  </div>
</template>

<script>
import AddOrUpdate from './refundOrderInfo'
import OrderInfo from './orderInfo'
// import ConsignmentInfo from './consignment-info'
export default {
  data () {
    return {
      showHeadScroll: false,
      sts: 0,
      dataForm: {},
      dateRange: [],
      searchForm: [],
      options: [{
        value: 1,
        label: '买家申请'
      },
      {
        value: 2,
        label: '卖家接受'
      },
      {
        value: 3,
        label: '买家发货'
      },
      {
        value: 4,
        label: '卖家收货'
      },
      {
        value: 5,
        label: '退款成功'
      },
      {
        value: 6,
        label: '撤回申请'
      },
      {
        value: 7,
        label: '商家拒绝'
      },
      {
        value: -1,
        label: '退款关闭'
      }],
      refund: [{
        value: 0,
        label: '暂无售后'
      },
      {
        value: 1,
        label: '申请退款'
      },
      {
        value: 2,
        label: '退款成功'
      },
      {
        value: 3,
        label: '部分退款成功'
      },
      {
        value: 4,
        label: '退款关闭'
      }],
      orderType: [{
        value: 0,
        label: '普通订单'
      }, {
        value: 1,
        label: '团购订单'
      }, {
        value: 2,
        label: '秒杀订单'
      }],
      refundType: [{
        value: 1,
        label: '整单退款'
      }, {
        value: 2,
        label: '单个物品退款'
      }],
      applyType: [{
        value: 1,
        label: '仅退款'
      }, {
        value: 2,
        label: '退货退款'
      }],
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      returnMoneySts: null,
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      orderInfoVisible: false
    }
  },
  components: {
    OrderInfo,
    AddOrUpdate
    // ConsignmentInfo
  },
  created () {
    // 携带参数查询
    this.searchForm = this.$route.query
    this.getDataList(this.page)
  },
  activated () {
    // 携带参数查询
    var query = this.$route.query
    if (Object.keys(query).length > 0) {
      this.searchForm = this.$route.query
      this.sys = 0
      this.returnMoneySts = null
      this.getDataList(this.page)
    }
  },
  mounted () {
    // 监听页面滚动
    window.addEventListener('scroll', this.scrollToTop)
  },
  methods: {
    /**
     * 页面滚动事件
     */
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.showHeadScroll = scrollTop > 400
    },

    /**
     * 获取数据列表
     */
    getDataList (page) {
      let params = this.searchForm
      console.log('params', params)
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/order/refund/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          'current': page.currentPage,
          'size': page.pageSize,
          'orderNumber': params ? (params.orderNumber ? params.orderNumber : null) : null,
          'shopName': params ? (params.shopName ? params.shopName : null) : null,
          'returnMoneySts': this.returnMoneySts ? this.returnMoneySts : null,
          'refundSn': params ? (params.refundSn ? params.refundSn : null) : null,
          'orderType': params ? (params.orderType ? params.orderType : null) : null,
          'applyType': params ? (params.applyType ? params.applyType : null) : null,
          'refundType': params ? (params.refundType ? params.refundType : null) : null,
          'startTime': this.dateRange ? (this.dateRange[0] ? this.dateRange[0] : null) : null, // 开始时间
          'endTime': this.dateRange ? (this.dateRange[1] ? this.dateRange[1] : null) : null // 结束时间
        }))
      }).then(({ data }) => {
        console.log(data)
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
        this.sts = this.returnMoneySts ? this.returnMoneySts : 0
      })
    },
    orderRefundStatus (val) {
      this.returnMoneySts = val
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },

    /**
     * 导航选择状态
     */
    selectNav (e) {
      var sts = e.currentTarget.dataset.sts
      this.sts = parseInt(sts)
      this.returnMoneySts = this.sts === 0 ? null : parseInt(sts)
      this.getDataList(this.page)
    },
    /**
     * 查看订单
     */
    viewOrderHandle (id) {
      this.orderInfoVisible = true
      this.$nextTick(() => {
        this.$refs.OrderInfo.init(id)
      })
    },
    /**
     * 处理退款
     */
    refundHandle (id, shopId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, shopId)
      })
    },
    /**
     * 根据选项设置时间
     * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
     */
    setDateRange (val) {
      var startDay = null
      var endDay = null
      if (val === 1) {
        startDay = 0
        endDay = 0
      } else if (val === 2) {
        startDay = -1
        endDay = -1
      } else if (val === 3) {
        startDay = -6
        endDay = 0
      } else if (val === 4) {
        startDay = -29
        endDay = 0
      } else {
        return
      }
      // 开始时间
      var startTime = this.getTimeByDayNum(startDay) + '00:00:00'
      // 结束时间
      var endTime = this.getTimeByDayNum(endDay) + '23:59:59'
      this.dateRange = [startTime, endTime]
    },
    /**
     * 通过天数获取对应天数前的时间, 负数：多少天前, 正数：多少天后
     */
    getTimeByDayNum (dayNum) {
      var date = new Date()
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * dayNum)
      let mouth = date.getMonth() + 1 >= 10 ? date.getMonth() : '0' + (date.getMonth() + 1)
      let day = date.getDate() >= 10 ? date.getDate() : '0' + (date.getDate())
      var time = date.getFullYear() + '-' + mouth + '-' + day + ' '
      return time
    },
    // 清空按钮
    clear () {
      this.searchForm = {}
      this.dateRange = []
      this.returnMoneySts = null
    },
    // 刷新回调用
    refreshChange () {
      console.log('abcdefg')
      this.page.current = 1
      this.getDataList(this.page)
    },
    searchChange () {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page)
    }
  },
  destroyed () {
    // 页面销毁时移除监听
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style scoped>
.el-button + .el-button {
  margin-left: 0 !important;
  display: block;
}
.operation-box {
  display: inline-block;
  margin-left: 30px;
}
</style>
<style lang="scss">
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
.el-form-item {
  margin-bottom: 10px !important;
}
.screening-conditions {
  display: block;
  padding: 20px;
  background: #f8f8f9;
  margin-bottom: 20px;
}
.mod-order-order {
  .main {
    .status-nav {
      position: relative;
      display: block;
      width: 100%;
      margin-bottom: 15px;
      height: 40px;
      line-height: 40px;
      .nav-list-ul {
        position: absolute;
        left: 0;
        top: 0;
        width: 50%;
      }
      .nav-right {
        width: 61.5%;
        height: 40px;
        margin-left: 38.5%;
        border-bottom: 1px solid #ddd;
      }
      .nav-item-li {
        float: left;
        width: 10%;
        height: 40px;
        line-height: 40px;
        background: #f8f8f9;
        border-top: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        text-align: center;
        cursor: pointer;
      }
      .nav-item-li:first-child {
        border-left: 1px solid #ddd;
      }
      .selected {
        background: #fff;
        border-bottom: none;
      }
    }
    .tit {
      margin-bottom: 15px;
      background: #f8f8f9;
      z-index: 11;
    }
    .fixed-top {
      position: fixed;
      width: 84%;
      top: 90px;
      left: 267px;
    }
    .column-title {
      text-align: center;
    }
    .transaction-price {
      text-align: right;
    }
  }
  .prod {
    margin-bottom: 15px;
  }
  .tit {
    display: flex;
    height: 45px;
    align-items: center;
  }
  .tit .item {
    padding: 0 10px;
    width: 10%;
    text-align: center;
  }
  .tit .product {
    width: 25%;
  }
  .prod-tit {
    padding: 10px;
    background: #f8f8f9;
    border-left: 1px solid #dddee1;
    border-top: 1px solid #dddee1;
    border-right: 1px solid #dddee1;
  }
  .prod-tit span {
    margin-right: 15px;
  }
  .prod-cont {
    display: flex;
    border-top: 1px solid #dddee1;
    border-bottom: 1px solid #dddee1;
    border-left: 1px solid #dddee1;
    color: #495060;
  }
  .prod-cont .item {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    // width: 10%;
    border-right: 1px solid #dddee1;
    text-align: center;
    height: 100%;
  }
  .prod-cont .item span {
    display: block;
  }
  .prod-cont .prod-item {
    // width: 38%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #dddee1;
  }
  .prod-name {
    // display: flex;
    // align-items: center;
    width: 55%;
    text-align: left;
    vertical-align: middle;
  }
  .prod-con {
    display: block;
    padding: 0 !important;
  }
  .prod-price {
    position: absolute;
    right: 10px;
    text-align: center;
  }
  .prod-price span {
    display: block;
  }
  .prod-price span:first-child {
    margin-bottom: 10px;
  }
  .prod-name .prod-info {
    display: block;
    color: #80848f;
    margin-top: 30px;
  }
  .buyer-info {
    display: block;
    width: 100%;
  }
  .buyer-name {
    margin-bottom: 10px;
  }
  .order-status {
    display: inline-block;
    margin-top: 15px;
    padding: 2px 4px;
    border: 1px solid #e43130;
    border-radius: 2px;
    color: #e43130;
  }
  .prod-cont .items.name {
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px;
    // height: 100px;
    border-bottom: 1px solid #dddee1;
  }
  .prod-cont .items.name:last-child {
    border-bottom: none;
  }
  .prod-image {
    margin-right: 20px;
    width: 80px;
    height: 80px;
  }
  .prod-image img {
    width: 100%;
    height: 100%;
  }
  .item span {
    display: block;
    margin-bottom: 10px;
  }
  .totalprice {
    margin-bottom: 10px;
  }
  .item .operate {
    color: #2d8cf0;
  }
  .item .totalprice {
    color: #c00;
  }
  .prod .remark {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #e8f7f6;
    border-left: 1px solid #dddee1;
    border-right: 1px solid #dddee1;
    border-bottom: 1px solid #dddee1;
    margin-bottom: 20px;
  }
  .buyer-remark {
    padding: 0 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.empty {
  display: block;
  height: 200px;
  line-height: 200px;
  text-align: center;
  color: #aaa;
}
</style>
