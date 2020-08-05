<template>
  <el-dialog title="订单发货" :close-on-click-modal="false" :visible.sync="visible" width="50%">
    <div class="mod-order-orderInfo">
      <!-- <el-alert title="*请仔细填写物流公司及快递单号，发货后72小时内仅支持做一次更正，逾期不可修改" type="warning" show-icon></el-alert> -->
      <el-table
        ref="multipleTable"
        :data="dataList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- <span>{{scope.row.status === 0?status=true:status=false}}<span> -->
        <el-table-column type="selection" width="55" :selectable="checkSelectable"></el-table-column>
        <el-table-column label="商品编号" fit>
          <template slot-scope="scope">
            {{ scope.row.prodName }}
            <div
              class="order-status"
              v-if="scope.row.returnMoneySts !== null && scope.row.returnMoneySts > 0 && scope.row.returnMoneySts < 6"
            >退款</div>
          </template>
        </el-table-column>
        <el-table-column prop="prodCount" label="可发货数量" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <!-- <template slot-scope="scope">{{ scope.row.status }}</template> -->
            <el-tag
              size="medium"
              v-if="scope.row.returnMoneySts !== null && scope.row.returnMoneySts < 6 && scope.row.returnMoneySts >0 "
              type="danger"
            >{{['','买家申请','卖家接受','买家发货','卖家收货','退款成功'][scope.row.returnMoneySts]}}</el-tag>
            <el-tag
              size="medium"
              v-else-if="scope.row.status !== 0 && scope.row.status !== -1 "
              type="warning"
            >部分发货</el-tag>
            <el-tag size="medium" v-else-if="scope.row.status === 0">发货完成</el-tag>
            <el-tag size="medium" v-else-if="scope.row.status === -1" type="warning">等待发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="changeNum" label="发货数量" fit>
          <template slot-scope="scope">
            <el-input-number
              :disabled="scope.row.prodCount <= 0"
              size="medium"
              v-model="scope.row.changeNum"
              :precision="0"
              :min="0"
              :max="scope.row.prodCount"
            ></el-input-number>​
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- :rules="dataRule" -->
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <div class="detail-cont">
        <div class="detail01">
          <div class="text-width">
            <el-form-item label="配送信息:">
              <span>配送方式：快递</span>
            </el-form-item>
            <el-form-item label>
              <span>收货人：{{dataForm.userAddrOrder.receiver}}</span>
            </el-form-item>
            <el-form-item label>
              <span>手机：{{dataForm.userAddrOrder.mobile}}</span>
            </el-form-item>
            <el-form-item label>
              <span>收货地址：{{dataForm.userAddrOrder.province}}{{dataForm.userAddrOrder.city}}{{dataForm.userAddrOrder.area}}{{dataForm.userAddrOrder.addr}}</span>
            </el-form-item>
          </div>
        </div>
      </div>
      <el-form-item label="发货方式:">
        <el-radio-group v-model="dataForm.deliveryType" @change="clear()">
          <!-- <el-radio :label="2" :disabled="!isDvy">自提</el-radio> -->
          <el-radio :label="1">自己联系快递</el-radio>
          <el-radio :label="3">无需快递</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="dataForm.deliveryType === 1">
        <el-form-item label="快递公司：">
          <!-- <span>快递公司：</span> -->
          <el-select v-model="dataForm.dvyId" placeholder="请选择">
            <el-option
              v-for="item in dataForm.dvyNames"
              :key="item.dvyId"
              :label="item.dvyName"
              :value="item.dvyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号：" prop="dvyFlowId">
          <el-input v-model="dataForm.dvyFlowId" width="80" label="快递单号"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitProds()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        dvyId: '',
        userAddrOrder: {},
        dvyFlowId: 0,
        dvyNames: [],
        orderNumber: 0,
        deliveryType: 1
      },
      dataList: [],
      selectOrderItems: [],
      isSubmit: false,
      checkAll: false,
      orderItems: [],
      isTrue: false,
      errorInfo: '',
      orderId: 0,
      order: null,
      isIndeterminate: true,
      orderNumber: 0,
      freightAmount: 0,
      lossAmount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {},
  mounted () { },
  methods: {
    processingStr (str) {
      // str = str.replace(/\u200B/g,'');
      // return str
    },

    /**
     * 获取数据列表
     */
    init (order) {
      this.isSubmit = false
      this.dataForm.userAddrOrder = {}
      this.visible = true
      this.orderNumber = order.orderNumber
      this.clear()
      // 修改
      this.$http({
        url: this.$http.adornUrl(`/order/delivery/getOrderItemUnDelivery/${order.orderNumber}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        // console.log('data', data)
        // console.log('orderItems', data.orderItems)
        this.dataForm.userAddrOrder = data.userAddrOrder
        this.dataList = data.orderItems
        this.dataList.forEach(element => {
          console.log('element', element)
          element.changeNum = element.prodCount
        })
      })
      this.getDeliveryList()
    },
    getDeliveryList () {
      this.$http({
        url: this.$http.adornUrl('/admin/delivery/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm.dvyNames = data
      })
    },
    /**
     * 修改状态
     */
    handleSelectionChange (val) {
      this.selectOrderItems = val
    },
    /**
     * 禁用多选按钮
     */
    checkSelectable (row) {
      // console.log('row', row)
      return row.status !== 0 && (!row.returnMoneySts || row.returnMoneySts < 0 || row.returnMoneySts > 5)
    },
    clear () {
      this.dataForm.dvyFlowId = 0
      this.dataForm.dvyId = ''
    },
    /**
      * 校验数量
      */
    check () {
      this.isTrue = false
      if (this.selectOrderItems.length <= 0) {
        this.isTrue = true
        this.errorInfo = '请选择需要发货的订单'
        return true
      }
      this.selectOrderItems.forEach(element => {
        if (element.prodCount <= 0 || element.prodCount < element.changeNum || element.changeNum <= 0) {
          this.isTrue = true
          this.errorInfo = element.prodName + '订单可发货数量不足！'
          return true
        }
        if (element.changeNum <= 0) {
          this.isTrue = true
          this.errorInfo = element.prodName + '发货数量不能为0！'
          return true
        }
        if (element.changeNum == null) {
          this.isTrue = true
          this.errorInfo = element.prodName + '发货数量不能为空！'
          return true
        }
      })
      if (this.dataForm.dvyId === '' && this.dataForm.deliveryType === 1) {
        this.isTrue = true
        this.errorInfo = '请选择快递公司'
        return true
      }
      if ((this.dataForm.dvyFlowId === 0 || !this.dataForm.dvyFlowId) && this.dataForm.deliveryType === 1) {
        this.isTrue = true
        this.errorInfo = '请输入快递单号'
        return true
      }
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
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      // let param = this.dataForm
      this.$http({
        url: this.$http.adornUrl(`/order/delivery/orderItemsDelivery`),
        method: 'put',
        data: this.$http.adornData({
          orderNumber: this.orderNumber,
          dvyId: this.dataForm.dvyId,
          dvyFlowId: this.dataForm.dvyFlowId,
          freightAmount: this.freightAmount,
          deliveryType: this.dataForm.deliveryType,
          selectOrderItems: this.selectOrderItems
        })
      }).then(({ data }) => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshOrderAmountUpdate')
          }
        })
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

<style>
.el-input__inner {
  border: 1px solid #dcdfe6 !important;
}
</style>
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
