<template>
  <el-dialog title="修改订单金额" :close-on-click-modal="false" :visible.sync="visible" width="80%">
    <div class="mod-order-orderInfo">
      <el-alert title="修改订单金额会减少用户支付的金额，请谨慎更改" type="warning" show-icon></el-alert>
      <div class="main">
        <div class="content">
          <div class="prod-tit">
            <el-row style="width:100%">
              <el-col :span="20">
                <el-col :span="10" header-align="center" align="center">
                  <span class="item">商品编号</span>
                </el-col>​
                <el-col :span="2" header-align="center" align="center">
                  <span class="item">单价</span>
                </el-col>​
                <el-col :span="2" header-align="center" align="center">
                  <span class="item">数量</span>
                </el-col>​
                <el-col :span="2" header-align="center" align="center">
                  <span class="item">总 价</span>
                </el-col>​
                <el-col :span="3" header-align="center" align="center">
                  <span class="item">用户支付金额</span>
                </el-col>​
                <el-col :span="5" header-align="center" align="center">
                  <span class="item">减少金额</span>
                </el-col>​
              </el-col>
              <el-col :span="4">
                <el-col header-align="center" align="center">
                  <span class="item product">运费金额</span>
                </el-col>​
              </el-col>
            </el-row>​
          </div>
          <div class="prod">
            <div class="prod-cont prod-bottom">
              <el-row style="width:100%">
                <el-col :span="20">
                  <el-col class="prod" v-for="(orderItem,index) in dataList" :key="index">
                    <el-col class="prod-cont">
                      <el-row style="width:100%">
                        <el-col :span="10" style="height: 100%;">
                          <div class="item">
                            <span>{{orderItem.prodName}}</span>
                          </div>​
                        </el-col>​
                        <el-col :span="2" style="height: 100%;">
                          <div class="item">
                            <span>{{orderItem.price}}</span>
                          </div>​
                        </el-col>​
                        <el-col :span="2" style="height: 100%;">
                          <div class="item">
                            <span>{{orderItem.prodCount}}</span>
                          </div>​
                        </el-col>​
                        <el-col :span="2" style="height: 100%;">
                          <div class="item">
                            <span>{{orderItem.productTotalAmount}}</span>
                          </div>​
                        </el-col>​
                        <el-col :span="3" style="height: 100%;">
                          <div class="item">
                            <span>{{orderItem.actualTotalAmount}}</span>
                          </div>​
                        </el-col>​
                        <el-col :span="5" style="height: 100%;">
                          <div class="item">
                            <el-input-number
                              size="medium"
                              v-model="orderItem.chageAmount"
                              :precision="2"
                              :min="0"
                              @change="setChageAmount(index)"
                            ></el-input-number>​
                          </div>​
                        </el-col>​
                      </el-row>​
                    </el-col>​
                  </el-col>​
                </el-col>​
                <el-col :span="4" style="height: 100%;">
                  <div class="item">
                    <el-input-number v-model="freightAmount" size="medium" :precision="2" :min="0"></el-input-number>​
                  </div>​
                </el-col>​
              </el-row>​
            </div>​
          </div>
        </div>
      </div>
    </div>
    <span v-if="lossAmount !== 0">平台津贴减少:{{lossAmount}}元</span>
    <span slot="footer">
      <el-button type="primary" @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitProds()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Big from 'big.js'
export default {
  data () {
    return {
      visible: false,
      dataForm: {},
      dataList: [],
      orderItems: [],
      isTrue: false,
      errorInfo: '',
      orderId: 0,
      orderNumber: 0,
      freightAmount: 0,
      lossAmount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
  },
  methods: {
    /**
     * 获取数据列表
     */
    init (order) {
      let orderInfo = Object.assign({}, order)
      this.visible = true
      this.dataListLoading = true
      this.dataList = orderInfo.orderItems
      this.orderId = orderInfo.orderId
      this.orderNumber = orderInfo.orderNumber
      this.freightAmount = orderInfo.freightAmount
      this.lossAmount = 0
      this.dataList.forEach(element => {
        element.chageAmount = 0.00
        let actualTotalAmount = element.actualTotal
        element.actualTotalAmount = actualTotalAmount
      })
      this.dataListLoading = false
    },
    /**
     * 减少金额变化时，改变订单金额
     */
    setChageAmount (index) {
      let item = this.dataList[index]
      if (!item.chageAmount) {
        item.chageAmount = 0
      }
      let actualTotal = new Big(item.actualTotal)
      // 实际金额 = 原实际金额 - 变化金额
      item.actualTotalAmount = actualTotal.minus(item.chageAmount)
    },
    /**
     * 校验金额
     */
    check () {
      this.isTrue = false
      this.dataList.forEach(element => {
        if (element.actualTotalAmount <= 0) {
          this.isTrue = true
          this.errorInfo = '支付必须大于0'
          return true
        }
      })
    },
    /**
     * 确定事件
     */
    submitProds () {
      this.check()
      if (this.isTrue) {
        this.errorMsg(this.errorInfo)
        return
      }
      // let param = this.dataForm
      this.$http({
        url: this.$http.adornUrl(`/order/order/changeAmount`),
        method: 'put',
        data: this.$http.adornData({
          orderId: this.orderId,
          orderItems: this.dataList,
          orderNumber: this.orderNumber,
          freightAmount: this.freightAmount
        })
      }).then(({ data }) => {
        this.$emit('refreshOrderAmountUpdate')
        this.visible = false
      })
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>


<style scoped>
.mod-order-orderInfo {
  height: 100%;
  width: 100%;
  font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #495060;
}
.element.style {
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
.prods-select-body {
  height: auto;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
.mod-order-order .contprod-:last-child {
  border-bottom: 0;
  border-left: 0;
}
.mod-order-order .prod-cont.prod-bottom,
.mod-order-order .prod-cont {
  border-bottom: 1px solid #dddee1;
  border-left: 1px solid #dddee1;
}
</style>



