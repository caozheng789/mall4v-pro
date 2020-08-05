<template>
  <div class="detail-dialog">
    <el-dialog
      :title="!dataForm.orderNumber ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="80%"
    >
      <el-form
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="80px"
      >
        <div class="mod-order-orderInfo">
          <div class="content">
            <div class="order-number" style="display: none;">
              <div class="num-cont">
                <el-form-item label="订单编号:">
                  <span class="text">{{dataForm.orderNumber}}</span>
                </el-form-item>
                <el-form-item>
                  <el-steps
                    :active="stepsStatus"
                    align-center
                    :process-status="dataForm.status == 6 ? 'error':'wait'"
                  >
                    <el-step title="提交订单" :description="dataForm.createTime"></el-step>
                    <el-step title="买家已付款" :description="dataForm.payTime"></el-step>
                    <el-step title="卖家已发货" :description="dataForm.dvyTime"></el-step>
                    <el-step title="买家已收货" :description="dataForm.finallyTime"></el-step>
                  </el-steps>
                </el-form-item>
              </div>
            </div>
            <div class="order-state" style="display: none;">
              <div class="state-cont">
                <div class="state-title">
                  <el-form-item label="订单状态:">
                    <template slot-scope="scope">
                      <el-tag v-if="dataForm.status === 1" size="small" type="warning">待付款</el-tag>
                      <el-tag v-if="dataForm.status === 2" size="small" type="warning">待发货</el-tag>
                      <el-tag v-if="dataForm.status === 3" size="small" type="warning">待收货</el-tag>
                      <el-tag v-if="dataForm.status === 4" size="small" type="warning">待评价</el-tag>
                      <el-tag v-if="dataForm.status === 5" size="small" type="success">成功</el-tag>
                      <el-tag v-if="dataForm.status === 6" size="small" type="danger">失败</el-tag>
                      <el-tag v-if="dataForm.status === 7" size="small" type="danger">待成团</el-tag>
                    </template>
                  </el-form-item>
                  <el-form-item>
                    <el-row>
                      <!-- <el-button
                      type="primary"
                      v-if="dataForm.status === 2"
                      plain
                      @click="changeOrder()"
                      >发货</el-button>-->
                      <!-- <el-button type="info" plain>打印</el-button> -->
                    </el-row>
                  </el-form-item>
                </div>
                <div class="order-info">
                  <div class="order-details">
                    <div class="detail-title">
                      <img src="~@/assets/img/car.png" alt />
                      <span class="prompt">买家付款后才可以发货</span>
                      &nbsp;
                      <el-button
                        type="text"
                        v-if="dataForm.status <3 ||  dataForm.status === 7"
                        @click="changeUserAddrOrder(dataForm.userAddrOrder)"
                      >修改收货地址</el-button>
                    </div>
                    <div class="detail-cont">
                      <div class="detail01">
                        <img src="~@/assets/img/address.png" alt />
                        <div class="text-width">
                          <!-- <span class="revise-addr" @click="changeAddr(dataForm.addrOrderId)">
                          <img src="~@/assets/img/revise.png" alt=""/>修改地址
                          </span>-->
                          <el-form-item label="收货人:">
                            <span>{{dataForm.userAddrOrder.receiver}}</span>
                          </el-form-item>
                          <el-form-item label="手机:">
                            <span>{{dataForm.userAddrOrder.mobile}}</span>
                          </el-form-item>
                          <el-form-item label="收货地址">
                            <span>{{dataForm.userAddrOrder.province}}{{dataForm.userAddrOrder.city}}{{dataForm.userAddrOrder.area}}{{dataForm.userAddrOrder.addr}}</span>
                          </el-form-item>
                        </div>
                      </div>
                      <div class="detail01">
                        <img src="~@/assets/img/invoice.png" alt />
                        <span>不开发票</span>
                      </div>
                    </div>
                  </div>
                  <div class="buyers">
                    <div class="detail-title">
                      <img src="~@/assets/img/buyer.png" alt style="margin-right:15px" />
                      <el-form-item label="订单备注" style="margin-top:22px" label-width="80px">
                        &nbsp;
                        <el-button type="text" @click="changeRemarks()">修改备注信息</el-button>
                      </el-form-item>
                    </div>
                    <div class="buyers-info">
                      <div class="detail02">
                        <img src="~@/assets/img/message.png" alt />
                        <div class="text-width">
                          <span>买家备注:</span>
                          <br />
                          <span>{{dataForm.remarks}}</span>
                        </div>
                      </div>
                      <div class="detail02">
                        <img src="~@/assets/img/message.png" alt />
                        <div class="text-width">
                          <span>卖家备注:</span>
                          <br />
                          <span>{{dataForm.shopRemarks}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-list">
                  <el-table :data="dataForm.orderItems" border>
                    <el-table-column prop label="商品">
                      <template slot-scope="scope">
                        <img :src="resourcesUrl + scope.row.pic" width="100" height="100" />
                        <span>{{scope.row.prodName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="单价" width="180" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.price}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="count" label="数量" width="180" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.prodCount}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="totalPrice" label="总价" width="180" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.productTotalAmount}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="item-info">
                  <el-form-item label="商品总价:">
                    <span class="text">￥{{dataForm.total}}</span>
                  </el-form-item>
                  <!-- <el-form-item label="店铺优惠:">
                <span class="text">￥15.00</span>
                  </el-form-item>-->
                  <!-- <el-form-item label="积分抵扣:">
                <span class="text">￥15.00</span>
                  </el-form-item>-->
                  <!-- <el-form-item label="发票费用:">
                <span class="text">￥15.00</span>
                  </el-form-item>-->
                  <el-form-item label="配送费用:" v-if="dataForm.freightAmount">
                    <span class="text">￥{{dataForm.freightAmount}}</span>
                  </el-form-item>
                  <el-form-item label="应付金额:">
                    <span class="text">￥{{dataForm.actualTotal}}</span>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="order-number">
              <div class="number">
                <span class="text">订单编号：</span>
                {{dataForm.orderNumber}}
              </div>
              <div class="time">
                <span class="text">下单时间：</span>
                {{dataForm.createTime}}
              </div>
              <div class="type">{{['普通订单','团购订单','秒杀订单'][dataForm.orderType]}}</div>
            </div>
            <div class="order-state">
              <div class="state-box">
                <div
                  class="state"
                >{{['等待买家付款','等待商家发货','等待买家收货','等待买家评价','商品交易成功','商品交易失败','商品待成团'][dataForm.status - 1]}}</div>
                <div class="state-des">
                  <div v-if="dataForm.status === 1">买家在规定时间未付款，订单将自动取消。</div>
                  <div v-if="dataForm.status === 2">买家已付款，请商家尽快发货。</div>
                  <div v-if="dataForm.status === 3">商家已发货，等待确认收货。</div>
                  <!-- <div v-if="dataForm.status === 4">订单已完成，等待买家发表评价。</div> -->
                  <div v-if="dataForm.status === 5">订单已完成，商品交易成功。</div>
                  <div v-if="dataForm.status === 6">订单已取消，商品交易失败。</div>
                  <div v-if="dataForm.status === 7">规定时间内未成团，订单将自动取消。</div>
                </div>
                <!-- <div class="actions">
                  <div class="item" v-if="dataForm.status === 1">
                    <div class="el-button--text">修改价格</div>
                  </div>
                  <div class="item" v-if="dataForm.status === 2">
                    <div class="el-button--text">立即发货</div>
                    <div
                      class="item-btn"
                      @click="changeUserAddrOrder(dataForm.userAddrOrder)"
                    >修改收货地址</div>
                  </div>
                 <div class="item" v-if="dataForm.status === 3">
                    <div class="el-button--text">延长收货</div>
                  </div>
                </div>-->
              </div>
              <div class="state-steps">
                <el-form-item>
                  <el-steps
                    :active="stepsStatus"
                    align-center
                    :process-status="dataForm.status == 6 ? 'error':'wait'"
                  >
                    <el-step title="提交订单" :description="dataForm.createTime"></el-step>
                    <el-step title="买家已付款" :description="dataForm.payTime"></el-step>
                    <el-step title="卖家已发货" :description="dataForm.dvyTime"></el-step>
                    <el-step title="买家已收货" :description="dataForm.finallyTime"></el-step>
                  </el-steps>
                </el-form-item>
              </div>
            </div>
            <div class="packages">
              <div class="p-tab">
                <div
                  :class="indexs === index ?'item active':'item'"
                  @click="onClickListDelivery(deliveryExpresse,index)"
                  v-for="(deliveryExpresse,index) in dataForm.deliveryExpresses"
                  :key="index"
                >包裹{{index+1}}</div>
              </div>
              <div class="p-con" v-if="deliveryExpresse">
                <div class="deliver-msg">
                  <div class="d-item">
                    <div class="text">发货方式：</div>
                    <div class="res">{{['快递','自提','无需快递'][dataForm.dvyType - 1]}}</div>
                    <!-- <div class="item">
                      <div class="text">配送方式：</div>
                      <div class="res" v-if="dataForm.dvyType == 1">快递</div>
                      <div class="res" v-if="dataForm.dvyType == 2">自提</div>
                      <div class="res" v-if="dataForm.dvyType == 3">无需快递</div>
                    </div>-->
                  </div>
                  <div class="d-item">
                    <div class="text">发货时间：</div>
                    <div class="res">{{deliveryExpresse.createTime}}</div>
                  </div>
                  <div class="d-item">
                    <div class="text">快递公司：</div>
                    <div class="res">{{deliveryExpresse.deliveryDto.companyName}}</div>
                  </div>
                  <div class="d-item">
                    <div class="text">运单号：</div>
                    <div class="res">{{deliveryExpresse.deliveryDto.dvyFlowId}}</div>
                  </div>
                  <div class="d-goods over">
                    <div class="arrow-box">
                      <div class="arrow prev disable"></div>
                      <div class="arrow next"></div>
                    </div>
                    <div class="goods-box">
                      <div
                        class="item"
                        v-for="(orderItem,index) in deliveryExpresse.orderItems"
                        :key="index"
                      >
                        <div class="img">
                          <img :src="orderItem.pic" alt />
                        </div>
                        <div class="name">{{orderItem.prodName}}</div>
                        <div class="number">数量：{{orderItem.prodCount}}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="logistics">
                  <div class="l-tit" v-if="deliveryExpresse">
                    <span class="text">物流状态：</span>
                    <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 0">没有记录</span>
                    <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 1">已揽收</span>
                    <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 2">运输途中</span>
                    <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 3">已签收</span>
                    <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 201">达到目的城市</span>
                    <span class="l-state" v-if="deliveryExpresse.deliveryDto.state === 4">问题件</span>
                  </div>
                  <div class="logistics-box" v-if="deliveryExpresse">
                    <div
                      class="item"
                      v-for="(trace,index) in deliveryExpresse.deliveryDto.traces"
                      :key="index"
                    >
                      <div class="time">{{trace.acceptTime}}</div>
                      <div class="text">{{trace.acceptStation}}</div>
                    </div>
                    <!-- <div class="item">
                      <div class="time">2020-04-20 08:55:44</div>
                      <div class="text">快递离开杭州余杭区临平，下一站余杭国际在途</div>
                    </div>
                    <div class="item">
                      <div class="time">2020-04-20 08:55:44</div>
                      <div class="text">快递离开杭州余杭区临平，下一站余杭国际在途</div>
                    </div>-->
                  </div>
                </div>
              </div>
            </div>
            <div class="order-info">
              <div class="info-item">
                <div class="item-tit">收货人信息</div>
                <div class="item">
                  <div class="text">收货人：</div>
                  <div class="res">{{dataForm.userAddrOrder.receiver}}</div>
                </div>
                <div class="item">
                  <div class="text">联系电话：</div>
                  <div class="res">{{dataForm.userAddrOrder.mobile}}</div>
                </div>
                <div class="item">
                  <div class="text">收货地址：</div>
                  <div
                    class="res"
                  >{{dataForm.userAddrOrder.province}}{{dataForm.userAddrOrder.area}}{{dataForm.userAddrOrder.city}}{{dataForm.userAddrOrder.addr}}</div>
                  <!-- <div class="res">北京市 北京市 朝阳区 元大都城垣遗址公园6号 辣婆婆(东元大都店)</div> -->
                </div>
              </div>
              <div class="info-item">
                <div class="item-tit">配送信息</div>
                <div class="item">
                  <div class="text">配送方式：</div>
                  <div class="res">{{['快递','自提','无需快递'][dataForm.dvyType - 1]}}</div>
                  <div class="res" v-if="dataForm.dvyType === null">暂无</div>
                  <!-- <div class="res" v-if="dataForm.dvyType == 1">快递</div>
                  <div class="res" v-if="dataForm.dvyType == 2">自提</div>
                  <div class="res" v-if="dataForm.dvyType == 3">无需快递</div>-->
                </div>
                <div class="item">
                  <div class="text">发货时间：</div>
                  <div class="res">{{dataForm.dvyTime}}</div>
                  <div class="res" v-if="dataForm.dvyTime === null">暂无</div>
                </div>
              </div>
              <div class="info-item">
                <div class="item-tit">付款信息</div>
                <div class="item">
                  <div class="text">实付金额：</div>
                  <div class="res">{{dataForm.actualTotal}}元</div>
                </div>
                <div class="item">
                  <div class="text">付款方式：</div>
                  <div
                    class="res"
                  >{{['小程序支付','支付宝','微信扫码支付','微信H5支付','微信公众号支付'][dataForm.payType -1 ]}}</div>
                </div>
                <div class="item">
                  <div class="text">付款时间：</div>
                  <div class="res">{{dataForm.payTime}}</div>
                  <div class="res" v-if="dataForm.payTime === null">暂无</div>
                </div>
              </div>
              <div class="info-item">
                <div class="item-tit">买家信息</div>
                <div class="item">
                  <div class="text">买家昵称：</div>
                  <div class="res">{{dataForm.nickName}}</div>
                  <div class="res" v-if="dataForm.nickName === null">暂无</div>
                </div>
                <div class="item">
                  <div class="text">买家留言：</div>
                  <div class="res">{{dataForm.remarks}}</div>
                  <div class="res" v-if="dataForm.remarks === null || dataForm.remarks === ''">暂无</div>
                </div>
              </div>
            </div>
            <div class="goods-list">
              <el-table :data="dataForm.orderItems" border>
                <el-table-column prop label="商品">
                  <template slot-scope="scope">
                    <div class="df">
                      <img :src="resourcesUrl + scope.row.pic" width="60" height="60" />
                      <span class="name">{{scope.row.prodName}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="单价" width="180" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.price}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="数量" width="180" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.prodCount}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="总价" width="180" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.productTotalAmount}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="goods-total">
                <div class="text-box">
                  <div class="item">
                    <div class="text">商品总价:</div>
                    <div class="number">￥{{dataForm.total}}</div>
                  </div>
                  <div class="item" v-if="dataForm.freightAmount">
                    <div class="text">配送费用:</div>
                    <div class="number">￥{{dataForm.freightAmount}}</div>
                  </div>
                  <div class="item act-price">
                    <div class="text">应付金额:</div>
                    <div class="number">￥{{dataForm.actualTotal}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="order-log">
              <div class="log-title">订单日志</div>
              <div
                class="log-cont"
                v-if="dataForm.createTime"
              >{{dataForm.createTime}} {{dataForm.nickName}} 创建订单（成功）</div>
              <div
                class="log-cont"
                v-if="dataForm.updateTime"
              >{{dataForm.updateTime}} {{dataForm.nickName}} 订单更新（成功）</div>
              <div
                class="log-cont"
                v-if="dataForm.payTime"
              >{{dataForm.payTime}} {{dataForm.nickName}} 订单付款（成功）</div>
              <div
                class="log-cont"
                v-if="dataForm.dvyTime"
              >{{dataForm.dvyTime}} {{dataForm.nickName}} 订单发货（成功）</div>
              <div
                class="log-cont"
                v-if="dataForm.finallyTime"
              >{{dataForm.finallyTime}} {{dataForm.nickName}} 完成订单（成功）</div>
              <div
                class="log-cont"
                v-if="dataForm.cancelTime"
              >{{dataForm.cancelTime}} {{dataForm.nickName}} 取消订单（成功）</div>
            </div>
            <!-- ___ -->
          </div>
        </div>
      </el-form>
      <!-- 弹窗, 新增 / 修改 -->
      <!-- <order-addr-update
        v-if="orderAddrUpdateVisible"
        ref="orderAddrUpdate"
        @refreshUserAddrOrder="getDataList"
      ></order-addr-update>
      <order-remark-update
        v-if="orderRemarkUpdateVisible"
        ref="orderRemarkUpdate"
        @refreshUserRemarkOrder="getDataList"
      ></order-remark-update>-->
    </el-dialog>
  </div>
</template>

<script>
// import OrderAddrUpdate from '@/components/order-addr-update'
// import OrderRemarkUpdate from '@/components/order-remark-update'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        orderId: 0,
        orderNumber: '',
        remarks: '',
        shopRemarks: '',
        total: 0,
        deliveryExpresses: [],
        actualTotal: 0,
        dvyType: '',
        status: 1,
        addrOrderId: 0,
        nickName: '',
        orderItems: [],
        orderTime: '',
        updateTime: '',
        payTime: '',
        dvyTime: '',
        finallyTime: '',
        cancelTime: '',
        orderType: '',
        userAddrOrder: {}
      },
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      deliveryExpresse: {
        deliveryDto: {}
      },
      indexs: 0,
      orderRemarkUpdateVisible: false,
      orderAddrUpdateVisible: false
    }
  },
  components: {
    // OrderAddrUpdate,
    // OrderRemarkUpdate
  },
  watch: {
    visible: function () {
      if (!this.visible) {
        this.orderRemarkUpdateVisible = false
        this.orderAddrUpdateVisible = false
      }
    }
  },
  computed: {
    stepsStatus: function () {
      if (this.dataForm.finallyTime) {
        return 4
      }
      if (this.dataForm.dvyTime) {
        return 3
      }
      if (this.dataForm.payTime) {
        return 2
      }
      if (this.dataForm.createTime) {
        return 1
      }
    }
  },
  methods: {
    init (orderNumber) {
      this.dataForm.orderNumber = orderNumber || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.orderNumber) {
        // 修改
        this.$http({
          url: this.$http.adornUrl(`/platform/orderDelivery/orderInfo/${this.dataForm.orderNumber}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.deliveryExpresse = this.dataForm.deliveryExpresses[0]
          console.log(this.dataForm.deliveryExpresses)
        })
      }
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(`/platform/orderDelivery/orderInfo/${this.dataForm.orderNumber}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
        this.deliveryExpresse = this.dataForm.deliveryExpresses[0]
        console.log(this.deliveryExpresse)
      })
    },
    /**
     * 物流事件
     */
    onClickListDelivery (delivery, index) {
      this.deliveryExpresse = delivery
      this.indexs = index
    },
    // 表单提交
    dataFormSubmit () {
    },
    // 修改地址
    changeUserAddrOrder (userAddrOrder) {
      this.orderAddrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.orderAddrUpdate.init(this.dataForm)
      })
    },
    // 修改备注
    changeRemarks () {
      this.orderRemarkUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.orderRemarkUpdate.init(this.dataForm)
      })
    }
  }
}
</script>


<style>
.detail-dialog .el-dialog {
  min-width: 950px;
  margin-top: 10vh !important;
}

.detail-dialog .goods-list .has-gutter th.is-leaf {
  background: #f7f8fa;
  color: #333;
  border-bottom: 1px solid #ebeef5;
  font-weight: 400;
  border-right: 0;
}

.detail-dialog .goods-list .el-table td {
  border-right: 0;
}
</style>

<style  lang="scss" scoped>
.mod-order-orderInfo {
  height: 100%;
  width: 100%;
  font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #333;

  .order-number {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .order-number .text {
    color: #999;
  }

  .order-number .number,
  .order-number .time {
    display: flex;
    align-items: center;
  }

  .order-number .time {
    margin: 0 15px;
  }

  .order-state {
    position: relative;
    margin-top: 15px;
    border: 1px solid #eee;
    display: flex;
    align-items: center;
  }

  .order-state .state-box {
    padding: 20px 15px;
    width: 40%;
    border-right: 1px solid #eee;
  }

  .order-state .state-box .state {
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
  }

  .order-state .state-box .state-des {
    margin-top: 10px;
    color: #999;
  }

  .order-state .state-box .actions {
    margin-top: 15px;
  }

  .order-state .state-box .actions .item {
    display: flex;
    align-items: center;
  }

  .order-state .state-box .actions .item .el-button--text {
    cursor: pointer;
  }

  .order-state .state-box .actions .item .item-btn {
    padding: 3px 10px;
    border: 1px solid #eee;
    border-radius: 2px;
  }

  .order-state .state-steps {
    flex: 1;
    margin-left: -80px;
  }

  .order-state .state-steps .el-form-item {
    margin-bottom: 0;
  }

  .packages {
    margin-top: 15px;
  }

  .packages .p-tab {
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
  }

  .packages .p-tab .item {
    background: #f2f2f2;
    border: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
    position: relative;
    padding: 8px 20px;
    cursor: pointer;
  }

  .packages .p-tab .item:first-child {
    border-radius: 3px 0 0 0;
  }

  .packages .p-tab .item:last-child {
    border-radius: 0 3px 0 0;
  }

  .packages .p-tab .item.active {
    background: #fff;
    border-bottom: 1px solid #fff;
  }

  .packages .p-con {
    border: 1px solid #eee;
    border-top: 0;
    padding: 20px;
    display: flex;
  }

  .packages .p-con .deliver-msg {
    width: 40%;
  }

  .packages .p-con .deliver-msg .d-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .packages .p-con .deliver-msg .d-item .text {
    width: 80px;
  }

  .packages .p-con .deliver-msg .d-goods {
    position: relative;
    width: 334px;
  }

  .packages .p-con .deliver-msg .d-goods.over {
    padding: 0 32px;
  }

  .packages .p-con .deliver-msg .d-goods .arrow-box {
    position: absolute;
    top: 40%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    transform: translateY(-50%);
    left: 0;
    width: 100%;
    display: none;
  }

  .packages .p-con .deliver-msg .d-goods.over .arrow-box {
    display: block;
  }

  .packages .p-con .deliver-msg .d-goods .arrow-box .arrow {
    width: 22px;
    height: 22px;
    background: #eee;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    cursor: pointer;
  }

  .packages .p-con .deliver-msg .d-goods .arrow-box .arrow.disable {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .packages .p-con .deliver-msg .d-goods .arrow-box .arrow.prev {
    left: 0;
    transform: rotate(180deg);
  }

  .packages .p-con .deliver-msg .d-goods .arrow-box .arrow.next {
    right: 0;
  }

  .packages .p-con .deliver-msg .d-goods .arrow-box .arrow::before,
  .packages .p-con .deliver-msg .d-goods .arrow-box .arrow::after {
    position: absolute;
    top: 6px;
    display: block;
    width: 0;
    height: 0;
    content: " ";
    font-size: 0;
    border: 5px solid transparent;
  }

  .packages .p-con .deliver-msg .d-goods .arrow-box .arrow::before {
    left: 10px;
    border-left: 5px solid #999;
  }

  .packages .p-con .deliver-msg .d-goods .arrow-box .arrow::after {
    left: 8px;
    border-left: 5px solid #eee;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box {
    display: flex;
    overflow: hidden;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item {
    margin-right: 10px;
    font-size: 12px;
    cursor: pointer;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item:last-child {
    margin: 0;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item .img {
    width: 60px;
    height: 60px;
    font-size: 0;
    margin-bottom: 3px;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item .img img {
    width: 100%;
    height: 100%;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item .name,
  .packages .p-con .deliver-msg .d-goods .goods-box .item .number {
    width: 60px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #999;
  }

  .packages .p-con .logistics {
    flex: 1;
  }

  .packages .p-con .logistics .l-tit {
    display: flex;
  }

  .packages .p-con .logistics .l-tit .l-state {
    color: #c00;
  }

  .packages .p-con .logistics .logistics-box {
    height: 175px;
    overflow-y: scroll;
    position: relative;
    margin-top: 15px;
  }

  .packages .p-con .logistics .logistics-box::before {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 10px;
    height: 10px;
    content: " ";
    font-size: 0;
    background: #fff;
    z-index: 1;
  }

  .packages .p-con .logistics .logistics-box::after {
    position: absolute;
    left: 6px;
    top: 0;
    display: block;
    width: 1px;
    height: 100%;
    content: " ";
    font-size: 0;
    background: #eee;
    z-index: 0;
  }

  .packages .p-con .logistics .logistics-box .item {
    padding: 10px 0 30px 25px;
    position: relative;
    margin-left: 6px;
    border-left: 1px solid #eee;
  }

  .packages .p-con .logistics .logistics-box .item::before {
    position: absolute;
    left: -10px;
    top: 10px;
    display: block;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    content: " ";
    font-size: 0;
    background: #ccc;
    border: 5px solid #fff;
    z-index: 2;
  }

  .packages .p-con .logistics .logistics-box .item:first-child:before {
    background: #c00;
  }

  .packages .p-con .logistics .logistics-box .item .time {
    color: #999;
  }

  .packages .p-con .logistics .logistics-box .item .text {
    margin-top: 5px;
    width: 400px;
  }

  .order-info {
    background: #f7f8fa;
    margin-top: 20px;
    display: flex;
    padding: 20px;
  }

  .order-info .info-item {
    width: 25%;
    padding-right: 30px;
  }

  .order-info .info-item .item-tit {
    font-weight: 600;
  }

  .order-info .info-item .item {
    margin-top: 10px;
    display: flex;
    line-height: 20px;
  }

  .order-info .info-item .item .text {
    width: 75px;
    white-space: nowrap;
  }

  .goods-list {
    margin-top: 20px;
  }

  .goods-list .df {
    display: flex;
    align-items: center;
  }

  .goods-list .df .name {
    margin-left: 10px;
    line-height: 20px;
  }

  .goods-list .goods-total {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .goods-list .goods-total .item {
    display: flex;
    align-items: center;
    color: #999;
    margin-top: 5px;
  }

  .goods-list .goods-total .item .text {
    width: 80px;
    text-align: center;
  }

  .goods-list .goods-total .item .number {
    width: 100px;
    text-align: right;
  }

  .goods-list .goods-total .item.act-price {
    margin-top: 20px;
    color: #333;
    font-weight: 600;
  }

  .goods-list .goods-total .item.act-price .number {
    color: #c00;
  }

  .order-log {
    margin-top: 20px;
    border-top: 1px dashed #e9eaec;
    padding: 20px 10px;
  }

  .order-log .log-title {
    height: 30px;
    width: 100%;
    line-height: 30px;
    font-weight: bold;
  }

  .order-log .log-cont {
    color: #02a1e9;
    margin-top: 20px;
  }
}
</style>



