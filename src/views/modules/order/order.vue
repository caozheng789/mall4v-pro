<template>
  <div class="mod-order-order">
    <div class="screening-conditions">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList(this.page)">
        <div>
          &nbsp;&nbsp;&nbsp;
          <el-form-item label="订单编号：">
            <el-input v-model="dataForm.orderNumber" placeholder="订单编号" clearable size="small"></el-input>
          </el-form-item>

          <!-- <el-form-item label="商品名称：">
            <el-input v-model="dataForm.prodName" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>-->

          <el-form-item label="订单类型：">
            <template>
              <el-select v-model="dataForm.orderType" clearable placeholder="请选择订单类型" size="small">
                <el-option
                  v-for="item in orderType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item label="订单状态：">
            <template>
              <el-select
                v-model="status"
                clearable
                placeholder="请选择订单状态"
                size="small"
                @change="orderStatus"
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
        </div>

        <div>
          <el-form-item label="收件人姓名：">
            <el-input v-model="dataForm.receiver" placeholder="请输入收件人姓名" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="dataForm.mobile" placeholder="请输入收件人手机号" clearable size="small"></el-input>
          </el-form-item>

          <el-form-item label="售后状态：">
            <template>
              <el-select
                v-model="dataForm.refundStatus"
                clearable
                placeholder="请选择售后状态"
                size="small"
              >
                <el-option
                  v-for="item in refund"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>
        </div>

        <div>
          <!-- <el-form-item label="支付方式：">
            <template>
              <el-select v-model="dataForm.payType" clearable placeholder="请选择支付方式">
                <el-option
                  v-for="item in payType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>-->
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
            ></el-date-picker>&nbsp;&nbsp;&nbsp;
            <el-button size="small" @click="setDateRange(1)">今天</el-button>
            <el-button size="small" @click="setDateRange(2)">昨天</el-button>
            <el-button size="small" @click="setDateRange(3)">近七天</el-button>
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
            <!-- <el-button @click="showConsignmentInfo()"
                      type="primary"
            size="small">导出待发货订单</el-button>-->
          </el-form-item>
          <el-form-item>
            <el-button
              class="operation-btn"
              @click="getSoldExcel()"
              size="small"
              icon="el-icon-document-checked"
            >导出</el-button>
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
          <ul class="nav-list clearfix">
            <li
              :class="['nav-item',sts == 0?'selected':'']"
              data-sts="0"
              @click="selectNav($event)"
            >全部</li>
            <li
              :class="['nav-item',sts == 1?'selected':'']"
              data-sts="1"
              @click="selectNav($event)"
            >待付款</li>
            <li
              :class="['nav-item',sts == 2?'selected':'']"
              data-sts="2"
              @click="selectNav($event)"
            >待发货</li>
            <li
              :class="['nav-item',sts == 3?'selected':'']"
              data-sts="3"
              @click="selectNav($event)"
            >待收货</li>
            <li
              :class="['nav-item',sts == 5?'selected':'']"
              data-sts="5"
              @click="selectNav($event)"
            >成功</li>
            <li
              :class="['nav-item',sts == 6?'selected':'']"
              data-sts="6"
              @click="selectNav($event)"
            >失败</li>
            <li
              :class="['nav-item',sts == 7?'selected':'']"
              data-sts="7"
              @click="selectNav($event)"
            >待成团</li>
          </ul>
        </div>

        <!-- 列标题 -->
        <div :class="['tit',showHeadScroll?'fixed-top':'']">
          <el-row style="width:100%">
            <el-col :span="7">
              <span class="item product">商品</span>
            </el-col>
            <el-col :span="3" class="transaction-price">
              <span class="item">成交单价(元)/数量</span>
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">实付金额(元)</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">支付方式</span>
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">买家/收货人</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">订单状态</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">售后</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">操作</span>
            </el-col>
          </el-row>
        </div>

        <div
          class="prod"
          v-for="order in dataList"
          :key="order.orderId"
          style="margin-bottom: 15px;"
        >
          <div class="prod-tit">
            <span>订单编号：{{order.orderNumber}}</span>
            <span>下单时间：{{order.createTime}}</span>
            <!-- <span>店铺名称：{{order.shopName}}</span> -->
            <!-- <span>买家：19999999999</span>
            <span >联系电话：19999999999</span>-->
          </div>
          <div class="prod-cont">
            <el-row style="width:100%">
              <el-col :span="10">
                <div class="prod-item">
                  <div
                    class="items name"
                    v-for="orderItem in order.orderItems"
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
                          v-if="order.orderType === 1 || order.orderType === 2"
                        >{{order.orderType === 1?'团购订单':order.orderType === 2?'秒杀订单':''}}</div>
                        <div
                          class="order-status"
                          v-if="!orderItem.returnMoneySts || orderItem.returnMoneySts < 0 || orderItem.returnMoneySts > 5"
                        >
                          {{orderItem.status === 0 && order.status === 2
                          ?'待收货':['','待付款','待发货','待收货','','交易成功','交易失败','待成团'][order.status]}}
                        </div>
                        <div
                          class="order-status"
                          v-else
                        >{{['','买家申请','卖家接受','买家发货','卖家收货','退款成功'][orderItem.returnMoneySts]}}</div>
                        <!-- <span class="prod-info">{{orderItem.skuName}}</span> -->
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
                    <span class="totalprice">{{(order.actualTotal).toFixed(2)}}</span>
                    <span v-if="order.freightAmount">（含运费：￥{{(order.freightAmount).toFixed(2)}}）</span>
                    <br />
                    <span>共{{order.productNums}}件</span>
                    <br />
                    <el-button
                      type="text"
                      size="small"
                      @click="editAmount(order)"
                      v-if="order.status === 1"
                    >修改金额</el-button>
                  </div>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%;">
                <div class="item">
                  <div>
                    <span v-if="order.payType === null">未支付</span>
                    <span
                      v-else
                    >{{['','微信小程序支付','支付宝PC端支付','微信扫码支付','微信H5支付','微信公众号支付','支付宝H5支付'][order.payType]}}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%;">
                <div class="item">
                  <div class="buyer-info">
                    <div class="buyer-name">{{order.userAddrOrder.receiver}}</div>
                    <div class="buyer-phone">{{order.userAddrOrder.mobile}}</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%;">
                <div class="item">
                  <!-- <span v-if="order.refundStatus === 1" size="small" type="danger">退款申请中</span> -->
                  <span>
                    <span v-if="order.status === 1" size="small" type="danger">待付款</span>
                    <span v-else-if="order.status === 2" size="small" type="danger">待发货</span>
                    <span v-else-if="order.status === 3" size="small" type="danger">待收货</span>
                    <span v-else-if="order.status === 7" size="small" type="danger">待成团</span>
                    <span v-else-if="order.status === 5" size="small" type="danger">交易成功</span>
                    <span v-else-if="order.status === 6" size="small">交易失败</span>
                  </span>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%;">
                <div class="item">
                  <span v-if="order.refundStatus === 1" size="small" type="danger">退款申请中</span>
                  <span v-else-if="order.refundStatus === 2" size="small" type="danger">退款成功</span>
                  <span v-else-if="order.refundStatus === 3" size="small" type="danger">部分退款成功</span>
                  <span v-else-if="order.refundStatus === 4" size="small" type="danger">退款关闭</span>
                  <span v-else size="small" type="danger">暂无售后</span>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%;">
                <div class="item">
                  <div class="operate">
                    <!-- <button onclick="">打印订单</button><br> -->
                    <el-button
                      type="text"
                      size="small"
                      @click="addOrUpdateHandle(order.orderNumber)"
                    >查看详情</el-button>
                    <el-button
                      type="text"
                      size="small"
                      v-if="order.status == 3 && (!order.refundStatus || order.refundStatus > 2) && order.dvyType === 1"
                      @click="reviseLogistics(order.orderNumber)"
                    >修改物流</el-button>
                    <el-button
                      size="small"
                      v-if="order.status === 2"
                      type="text"
                      @click="changeOrder(order)"
                    >发货</el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="refundRoute(order.orderNumber)"
                      v-if="order.refundStatus"
                    >退款信息</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <devy-add v-if="devyVisible" ref="devyAdd" @refreshDataList="getDataList"></devy-add>
    <consignment-info
      v-if="consignmentInfoVisible"
      ref="consignmentInfo"
      @inputCallback="getWaitingConsignmentExcel"
    ></consignment-info>
    <orderAmount-update
      v-if="orderAmountUpdateVisible"
      ref="orderAmountUpdate"
      @refreshOrderAmountUpdate="getDataList"
    ></orderAmount-update>
    <order-delivery-update
      v-if="devyVisible"
      ref="orderDeliveryUpdate"
      @refreshOrderAmountUpdate="getDataList"
    ></order-delivery-update>
    <!-- 修改物流弹窗 -->
    <!-- <el-dialog :title="修改物流" width="70%"></el-dialog> -->
    <el-dialog title="修改物流信息" :close-on-click-modal="false" :visible.sync="logVisible" width="50%">
      <!-- 修改 -->
      <div class="revise-log" v-if="isReviseLog">
        <div class="change-logistics">
          <div class="warning">若修改物流信息，请仔细核对填写并核对</div>
          <div class="log-list">
            <div class="item" v-for="(logItem,index) in logisticsInfo" :key="index">
              <div class="i-tit">
                <div class="big">包裹{{index+1}}</div>
                <div class="text">共 {{logItem.productNums}} 件商品</div>
              </div>
              <!-- <div class="i-con">
                   <div class="label">发货方式：</div>
                   <div class="con">
                     <div class="con-radio">
                       <input type="radio" name="checkit" value="" checked="true"/><span>需要物流</span>
                     </div>
                   </div>
                 </div>
                 <div class="i-con">
                   <div class="label">物流公司：</div>
                   <div class="con">
                     <div class="con-select">申通快递</div>
                     <div class="con-text">
                       <div class="text">运单号编：</div>
                       <input type="text" />
                     </div>
                   </div>
              </div>-->

              <el-form
                :model="logDataForm"
                ref="logDataForm"
                @keyup.enter.native="logDataFormSubmit()"
                label-width="95px"
              >
                <el-form-item label="发货方式：" style="text-align: left;">
                  <el-radio disabled v-model="radio" label="1">需要物流</el-radio>
                </el-form-item>
                <div class="info-int">
                  <el-form-item label="快递公司：" class="form-item">
                    <div class="con">
                      <el-select class="int-frame" v-model="logItem.dvyId" placeholder="请选择">
                        <el-option
                          v-for="item in logDataForm.dvyNames"
                          :key="item.dvyId"
                          :label="item.dvyName"
                          :value="item.dvyId"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item label="快递单号：" class="form-item">
                    <el-input
                      v-model="logItem.dvyFlowId"
                      controls-position="right"
                      :min="0"
                      :class="['int-frame',errorNum == 1 ? 'errortip':'']"
                      label="快递单号"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>

      <!-- 确认 -->
      <div class="change-logistics" v-if="!isReviseLog">
        <div class="warning">若修改物流信息，请仔细核对填写并核对</div>
        <el-table class="log-info-table" :data="confirmList">
          <!-- <div v-for="(item,index) in confirmList" :key="index"> -->
          <el-table-column property="dvyIdName" label="包裹名称" width="220" style="text-align:left;"></el-table-column>
          <el-table-column property="productNums" label="商品数量" width="140"></el-table-column>
          <el-table-column property="delMethod" label="发货方式" width="140"></el-table-column>
          <el-table-column property="dvyName" label="物流公司" width="170"></el-table-column>
          <el-table-column property="dvyFlowId" label="快递单号"></el-table-column>
          <!-- </div> -->
        </el-table>
      </div>

      <div slot="footer" v-if="isReviseLog" class="dialog-footer">
        <el-button @click="logVisible = false">取消</el-button>
        <el-button type="primary" @click="logDataFormSubmit()">保存</el-button>
      </div>

      <div slot="footer" v-if="!isReviseLog" class="dialog-footer">
        <el-button @click="backToRevise()">返回修改</el-button>
        <el-button type="primary" @click="confirmRevise()">确认修改</el-button>
      </div>
    </el-dialog>
    <!-- /修改物流弹窗 -->
  </div>
</template>

<script>
import DevyAdd from './order-devy'
import AddOrUpdate from './orderInfo'
import ConsignmentInfo from './consignment-info'
import OrderAmountUpdate from './orderAmount-update'
import OrderDeliveryUpdate from './order-delivery-update'
export default {
  data () {
    return {
      showHeadScroll: false, // 修改物流相关
      logVisible: false,
      radio: '1',
      logisticsInfo: [],  // 包裹列表
      logDataForm: {
        dvyId: '', // 当前物流公司id
        dvyFlowId: '',  // 物流单号
        dvyNames: []  // 物流公司列表
      },
      // logDataRule: {
      //   dvyFlowId: [
      //     { required: true, message: '不能为空', trigger: 'blur' }
      //   ]
      // },
      errorNum: 0,
      // 确认修改弹窗
      isReviseLog: true,  // 是否正在修改物流信息
      confirmList: [],  // 确认修改信息
      dataForm: {},
      sts: 0,
      dateRange: [],
      status: null,
      options: [{
        value: 1,
        label: '待付款'
      },
      {
        value: 2,
        label: '待发货'
      },
      {
        value: 3,
        label: '待收货'
      },
      {
        value: 5,
        label: '交易成功'
      },
      {
        value: 6,
        label: '交易失败'
      },
      {
        value: 7,
        label: '待成团'
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
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      dataListSelections: [],
      devyVisible: false,
      addOrUpdateVisible: false,
      consignmentInfoVisible: false,
      orderAmountUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    DevyAdd,
    OrderAmountUpdate,
    OrderDeliveryUpdate,
    ConsignmentInfo
  },
  created () {
    // 携带参数查询
    this.getDataList(this.page, this.$route.query)

    // 请求物流公司
    this.getLogisticsList()
  },
  activated () {
    // 携带参数查询
    var query = this.$route.query
    if (Object.keys(query).length > 0) {
      this.getDataList(this.page, query)
    }
  },
  mounted () {
    // 监听页面滚动
    window.addEventListener('scroll', this.scrollToTop)
  },
  watch: {

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
     * 获取包裹物流信息
     */
    reviseLogistics (orderNumber) {
      // console.log(orderNumber)
      this.logVisible = !this.logVisible
      this.$http({
        url: this.$http.adornUrl('/order/delivery/getOrderDeliveries/' + orderNumber),
        method: 'put'
      }).then(({ data }) => {
        this.logisticsInfo = data
        this.logisticsInfo.forEach((el, index) => {
          el.newDvyFlowId = el.dvyFlowId
          el.newDvyId = el.dvyId
          el.dvyIdName = '包裹' + Number(index + 1)
          // 修改弹窗
          this.confirmList = []  // 清空确认列表
        })
      })
      this.errorNum = 0
      // console.log(this.logisticsInfo)
    },

    /**
     * 请求物流公司列表
     */
    getLogisticsList () {
      this.$http({
        url: this.$http.adornUrl('/admin/delivery/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.logDataForm.dvyNames = data
      })
    },

    /**
     * 点击保存
     */
    logDataFormSubmit () {
      //  let reviseLogList = []
      let flag = true
      let logisticsInfo = this.logisticsInfo

      logisticsInfo.map((el, index) => {
        if (!flag) {
          return false
        }
        // console.log('logisticsInfo', el.logisticsInfo)
        // console.log('el.dvyFlowId', el.dvyFlowId)
        if (el.dvyFlowId.length === 0) {
          this.$message({
            message: '物流单号不能为空',
            type: 'warning'
          })
          flag = false
          this.errorNum = 1
          // throw ('物流单号不能为空')
          // return false
        } else {
          this.errorNum = 0
          // console.log(el.newDvyFlowId)
          let confirmList = this.confirmList
          if ((el.newDvyFlowId.length !== 0 && el.newDvyFlowId !== el.dvyFlowId) || (el.newDvyId !== el.dvyId)) {
            confirmList.push(el)
            confirmList.forEach((el, index) => {
              el.delMethod = '物流配送'
              // el.packageName = "包裹" + Number(index+1)
              this.logDataForm.dvyNames.forEach((dvyName, index) => {
                if (el.dvyId === dvyName.dvyId) {
                  el.dvyName = dvyName.dvyName
                }
              })
            })
            this.confirmList = confirmList
          }
        }
        // console.log('确认列表:', this.confirmList)
        // this.confirmList.forEach((el, index) => {

        // })
      })
      // console.log(this.errorNum)
      if (this.errorNum === 1) {
        return
      } else if (this.confirmList.length === 0) {
        this.$message({
          message: '未更改任何物流信息',
          type: 'warning'
        })
        flag = false
      }
      if (flag) {
        this.isReviseLog = false // 修改弹窗
      }
    },
    /**
     * 确认修改物流信息
     */
    confirmRevise () {
      // let dvyOrderParam = {
      //   deliveryOrders: this.confirmList
      // }
      this.$http({
        url: this.$http.adornUrl('/order/delivery/updateOrderDeliveries'),
        method: 'put',
        data: this.$http.adornData({
          deliveryOrders: this.confirmList
        }),
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.isReviseLog = true
        this.logVisible = false
      })
    },
    /**
     * 返回修改（物流信息）
     */
    backToRevise () {
      this.isReviseLog = true
      // 修改弹窗
      this.confirmList = []  // 清空确认列表
    },

    /**
     * 获取数据列表
     */
    getDataList (page, params) {
      page = (page === undefined ? this.page : page)
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/order/order/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
              'orderNumber': this.dataForm.orderNumber,
              // 'prodName': this.dataForm.prodName,
              'orderType': this.dataForm.orderType,
              'receiver': this.dataForm.receiver,
              'mobile': this.dataForm.mobile,
              'status': this.status,
              'refundStatus': this.dataForm.refundStatus,
              'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
              'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
            },
            params
          ), false
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.sts = !this.status ? 0 : this.status
        this.dataListLoading = false
      })
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
      this.status = this.sts === 0 ? null : parseInt(sts)
      this.getDataList(this.page)
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    orderStatus (val) {
      this.status = val
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
    // 新增 / 修改
    addOrUpdateHandle (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(val)
      })
    },
    // 退款路由跳转
    refundRoute (val) {
      this.$router.push({
        path: '/order-orderRefund',
        query: { orderNumber: val }
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.orderId
      })
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/prod/spec/${ids}`),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.page)
            }
          })
        })
      }).catch(() => { })
    },
    showConsignmentInfo () {
      this.consignmentInfoVisible = true
      this.$nextTick(() => {
        this.$refs.consignmentInfo.init()
      })
    },
    // 清空按钮
    clear () {
      this.dataForm = {}
      this.dateRange = []
      this.status = null
    },
    // 搜索查询
    searchChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    /**
     * 更改订单金额
     */
    editAmount (order) {
      this.orderAmountUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.orderAmountUpdate.init(order)
      })
    },
    /**
       * 发货
       */
    changeOrder (order) {
      this.devyVisible = true
      this.$nextTick(() => {
        this.$refs.orderDeliveryUpdate.init(order)
      })
    },
    getSoldExcel () {
      if (this.dateRange.length < 2) {
        this.$message.error('请先选择导出订单的时间')
        return
      }
      this.$confirm(`导出报表会根据筛选条件导出`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/order/order/soldExcel'),
          method: 'get',
          params: this.$http.adornParams({
            'orderNumber': this.dataForm.orderNumber,
            // 'prodName': this.dataForm.prodName,
            'orderType': this.dataForm.orderType,
            'receiver': this.dataForm.receiver,
            'mobile': this.dataForm.mobile,
            'status': this.status,
            'refundStatus': this.dataForm.refundStatus,
            'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
            'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
          }),
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = '订单信息整理.xls'
          const elink = document.createElement('a')
          if ('download' in elink) { // 非IE下载
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
      })
    }
  },
  destroyed () {
    // 页面销毁时移除监听
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
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
.screening-conditions {
  display: block;
  padding: 20px;
  background: #f8f8f9;
  margin-bottom: 20px;
}
.operation-box {
  display: inline-block;
  margin-left: 30px;
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
      border-bottom: 1px solid #ddd;
      ul,
      li {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .nav-item {
        float: left;
        height: 40px;
        line-height: 40px;
        background: #f8f8f9;
        border: 1px solid #ddd;
        padding: 0 20px;
        margin: 0 -1px -1px 0;
        cursor: pointer;
      }

      .selected {
        background: #fff;
        border-bottom: 1px solid #fff;
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
  // .prod {
  //   margin-bottom: 15px;
  // }
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
  button.revise-btn {
    margin-top: 10px;
  }
  .el-button--text {
    padding-top: 0;
    padding-bottom: 0;
  }
  // .prod-cont .item span {
  //   display: block;
  // }
  .item span {
    display: inline-block !important;
  }
  .prod-cont .prod-item {
    // width: 38%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #dddee1;
  }
  .prod-name {
    width: 55%;
    text-align: left;
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
  .order-status {
    display: inline-block;
    margin-top: 15px;
    padding: 2px 4px;
    border: 1px solid #e43130;
    border-radius: 2px;
    color: #e43130;
    font-size: 12px;
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
  }
  .item .operate {
    color: #2d8cf0;
  }
  .item .operate .el-button + .el-button {
    display: block;
    margin-top: 10px;
    margin-left: 0;
  }
  .item .totalprice {
    color: #c00;
    margin-bottom: 10px;
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
  .empty {
    display: block;
    height: 200px;
    line-height: 200px;
    text-align: center;
    color: #aaa;
  }

  // 修改物流弹窗
  .change-logistics {
    color: #333;
    padding: 0 20px;
  }
  // .change-logistics,
  // .revise-log {
  //   max-height: 300px;
  //   overflow-y: auto;
  // }
  .log-list {
    max-height: 600px;
    overflow-y: auto;
  }

  .log-info-table {
    margin-top: 20px;
    max-height: 600px;
    overflow-y: auto;
  }

  .change-logistics .warning {
    padding: 10px;
    border: 1px solid #f1924e;
    background: #fff5ed;
  }

  .change-logistics .item {
    padding-bottom: 20px;
  }

  .change-logistics .item .i-tit {
    display: flex;
    align-items: center;
  }

  .change-logistics .item .i-tit .big {
    font-weight: 600;
    margin-right: 15px;
  }

  .change-logistics .item .i-con {
    display: flex;
    align-items: center;
    margin-top: 15px;
  }

  .change-logistics .item .i-con .label {
    width: 80px;
  }

  .change-logistics .item .i-con .con {
    display: flex;
    align-items: center;
  }

  .change-logistics .item .i-con .con .con-radio {
    margin-right: 10px;
  }

  .change-logistics .item .i-con .con .con-radio input,
  .change-logistics .item .i-con .con .con-radio span {
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }

  .change-logistics .item .i-con .con .con-radio input[type="radio"] {
    margin-left: 5px;
  }

  .change-logistics .item .i-con .con .con-select {
    position: relative;
    padding: 6px 25px 6px 12px;
    width: 220px;
    height: 32px;
    line-height: 18px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 2px;
  }

  .change-logistics .item .i-con .con .con-select::after {
    position: absolute;
    top: 13px;
    right: 8px;
    display: block;
    width: 0;
    height: 0;
    content: " ";
    font-size: 0;
    border: 5px solid transparent;
    border-top: 5px solid #333;
    border-radius: 2px;
  }

  .change-logistics .item .i-con .con .con-text {
    margin-left: 10px;
    display: flex;
    align-items: center;
  }

  .change-logistics .item .i-con .con .con-text .text {
    width: 80px;
  }

  .change-logistics .item .i-con .con .con-text input[type="text"] {
    border: 1px solid #ddd;
    padding: 0 10px;
    height: 30px;
    width: 160px;
    border-radius: 2px;
  }
  // 修改物流弹窗end

  // 修改物流信息弹窗
  .log-list {
    margin-top: 30px;
  }
  .el-form-item__label {
    text-align: left;
  }
  .el-form-item {
    margin-bottom: 0;
    margin-top: 10px;
  }
  .info-int {
    display: flex;
  }
  .form-item {
    margin-right: 15px;
  }
  .int-frame {
    border-radius: 0;
    border: 0;
    border: 1px solid #ddd;
  }
  .info-int .el-form-item__content,
  .info-int .el-form-item__label,
  .el-input__suffix-inner,
  .el-input__icon {
    height: 32px;
    line-height: 32px;
  }
  input.el-input__inner {
    border: 0;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
  // 修改物流信息弹窗end
  // 确认修改
  .el-table .cell {
    text-align: center;
  }
  .errortip {
    border-color: #e43130;
  }
}
</style>
