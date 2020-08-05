<template>
  <el-dialog :modal="false" :close-on-click-modal="false" :visible.sync="visible">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="常规配置" name="first">
        <div class="prods-select-body">
          <el-form label-width="120px">
            <el-form-item label="等级名称" prop="levelName">
              <el-input v-model="dataForm.levelName" placeholder="请输入等级名称" type="texe"></el-input>
            </el-form-item>
            <el-form-item label="背景图片" prop="img">
              <img-upload v-model="dataForm.img"></img-upload>
            </el-form-item>
            <el-form-item label="付费会员价格" prop="needAmount" v-if="dataForm.levelType === 1">
              <el-input
                v-model="dataForm.needAmount"
                placeholder="请输入整数"
                min="1"
                type="number"
                precision="0"
                @change="changeNeedAmount()"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="时间类型" prop="termType" v-if="dataForm.levelType === 1">
              <el-radio-group v-model="dataForm.termType">
                <el-radio :label="1">天</el-radio>
                <el-radio :label="2">周</el-radio>
                <el-radio :label="3">月</el-radio>
                <el-radio :label="4">季</el-radio>
                <el-radio :label="5">年</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="时间" prop="term" v-if="dataForm.levelType === 1">
              <el-input
                v-model="dataForm.term"
                placeholder="请输入整数"
                min="1"
                precision="0"
                type="number"
                @change="changeTerm()"
              >
                <template
                  slot="append"
                >{{dataForm.termType === 1?'天':dataForm.termType === 2?'周':dataForm.termType === 3?'月':dataForm.termType === 4?'季':'年'}}</template>
              </el-input>
            </el-form-item>
            <el-form-item label="所需成长值" prop="needGrowth">
              <el-input
                v-model="dataForm.needGrowth"
                placeholder="请输入整数"
                type="number"
                :min="minNeedGrowth"
                :max="maxNeedGrowth"
                precision="0"
                @change="changeNeedGrowth()"
                :disabled="dataForm.level === 1 && dataForm.levelType === 0"
              >
                <template slot="append">成长值</template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="权益配置" name="third">
        <div class="prods-select-body">
          <el-form label-width="30px">
            <el-form-item prop="isFreeFee">
              <el-checkbox v-model="isFreeFee">包邮</el-checkbox>
            </el-form-item>
            <el-form-item prop="rateScore">
              <el-checkbox v-model="isRateScore">积分回馈倍率</el-checkbox>
              <el-input-number
                v-model="dataForm.rateScore"
                placeholder="请输入倍率数"
                size="medium"
                :min="1"
                :precision="2"
                controls-position="right"
                v-if="isRateScore"
              ></el-input-number>
            </el-form-item>
            <el-form-item prop="couponList">
              <el-checkbox v-model="isCoupon">优惠卷</el-checkbox>
              <template v-if="isCoupon">
                <span>
                  <el-button
                    @click.native.prevent="conpouSelectHandle()"
                    type="text"
                    size="small"
                  >选择优惠卷</el-button>
                </span>
                <span v-for="(item,index) in dataForm.couponList" :key="index">
                  <span
                    v-if="index < 2"
                  >{{item.couponName}} {{dataForm.couponList.length>2?'等优惠券':''}}</span> &nbsp;
                </span>
              </template>
            </el-form-item>
            <el-form-item prop="presScore">
              <el-checkbox v-model="isPresScore">赠送积分</el-checkbox>
              <el-input-number
                v-model="dataForm.presScore"
                placeholder="请输入整数"
                :min="0"
                :precision="0"
                size="medium"
                controls-position="right"
                v-if="isPresScore"
              >
                <template slot="append">积分</template>
              </el-input-number>
            </el-form-item>
            <el-form-item prop="discount">
              <el-checkbox v-model="isDiscount">折扣</el-checkbox>
              <el-input-number
                v-model="dataForm.discount"
                placeholder="请输入1-10的整数"
                :min="1"
                :max="10"
                :precision="2"
                size="medium"
                controls-position="right"
                v-if="isDiscount"
              >
                <template slot="append">折</template>
              </el-input-number>
            </el-form-item>
            <el-form-item prop="discountRange" v-if="isDiscount">
              <el-radio-group v-model="dataForm.discountRange">
                <el-radio :label="0">全平台</el-radio>
                <el-radio :label="1">自营店</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="discountType">
              <el-radio-group v-model="dataForm.discountType" v-if="isDiscount">
                <el-radio :label="0">全部商品</el-radio>
                <!-- <el-radio :label="1">分类下的商品</el-radio> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="categorys" v-if="isDiscount && dataForm.discountType === 1">
              <el-tree
                :data="categoryList"
                :props="categoryListTreeProps"
                node-key="categoryId"
                ref="categoryTree"
                show-checkbox
              ></el-tree>
            </el-form-item>
            <el-form-item prop="presScore">
              <el-form-item prop="discountRange">
                <el-checkbox v-model="isOrther">其他权益</el-checkbox>
                <el-checkbox-group v-model="userRightsIds" v-if="isOrther" @change="checkbox">
                  <el-checkbox
                    v-for="item in rightsDataList"
                    :key="item.rightsId"
                    :label="item.rightsId"
                    border
                  >{{item.rightsName}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form-item>
          </el-form>
          <coupon-select
            v-if="couponSelectVisible"
            ref="couponSelect"
            @refreshSelectCouponList="selectDistributionCoupon"
          ></coupon-select>
        </div>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer">
      <el-button type="primary" @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitProds()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import CouponSelect from '@/components/coupon-select'
// import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
export default {
  components: {
    CouponSelect,
    ImgUpload
  },
  data () {
    return {
      visible: false,
      couponSelectVisible: false,
      activeName: 'first',
      dataForm: {
        id: null,
        level: 0,
        levelName: '',
        levelType: 0,
        needGrowth: 0,
        needAmount: 0,
        term: 1,
        termType: 1,
        img: '',
        discount: 10,
        discountRange: 0,
        discountType: 0,
        presScore: 0,
        rateScore: 1,
        isFreeFee: 0,
        couponList: [],
        userRightsIds: [],
        categoryList: [],
        categorys: []
      },
      isRateScore: false,
      isFreeFee: false,
      isCoupon: false,
      isPresScore: false,
      isDiscount: false,
      isOrther: false,
      minNeedGrowth: null,
      maxNeedGrowth: null,
      changeRights: [],
      userRightsIds: [],
      rightsDataList: [],
      categoryList: [],
      categoryListTreeProps: {
        label: 'categoryName',
        children: 'children'
      },
      dataRule: {
        // discount: [
        //   { required: true, message: '会员折扣不能为空', trigger: 'blur' }
        // ]
      }
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    init (userLevels, index) {
      // 初始化
      this.visible = true
      this.dataListLoading = true
      this.activeName = 'first'
      this.isRateScore = false
      this.isFreeFee = false
      this.isCoupon = false
      this.isPresScore = false
      this.isDiscount = false
      this.isOrther = false
      if (userLevels[index].id) {
        this.getDataList(userLevels, index)
      } else {
        // 保存直接写入数据
        this.dataForm = userLevels[index]
        this.userRightsIds = this.dataForm.userRightsIds
        // 设置所需积分最大最小值
        this.serMinOrMaxNeedGrowth(userLevels, index)
        this.getCategoryDataList()
        this.getRightsDataList()
      }
    },
    /**
     * 获取初始话数据
     */
    getDataList (userLevels, index) {
      this.$http({
        url: this.$http.adornUrl('/user/userLevel/info/' + parseInt(userLevels[index].id)),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
        this.userRightsIds = data.userRightsIds
        this.setRightsStatus(data)
        this.serMinOrMaxNeedGrowth(userLevels, index)
        this.getCategoryDataList()
        this.getRightsDataList()
      })
    },
    /**
     * 获取商品分类列表
     */
    getCategoryDataList () {
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({
          maxGrade: 1
        })
      }).then(({ data }) => {
        this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
        if (this.dataForm.discountType === 1) {
          this.$refs.categoryTree.setCheckedKeys(this.dataForm.categorys)
        }
      })
    },
    /**
     * 获取用户权益列表
     */
    getRightsDataList () {
      this.$http({
        url: this.$http.adornUrl('/user/userRights/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.rightsDataList = data
      })
    },
    /**
     * 设置所需积分最大最小值
     */
    serMinOrMaxNeedGrowth (userLevels, index) {
      if (userLevels[index].level > 1 && userLevels[index - 1].needGrowth !== 0) {
        this.minNeedGrowth = userLevels[index - 1].needGrowth + 1
      } else {
        this.minNeedGrowth = 0
      }
      if (index < userLevels.length - 1 && userLevels[index + 1].needGrowth !== 0) {
        this.maxNeedGrowth = userLevels[index + 1].needGrowth - 1
      } else {
        this.maxNeedGrowth = 1000000000000
      }
    },
    /**
     * 显示添加指定优惠券弹框
     */
    conpouSelectHandle () {
      this.couponSelectVisible = true
      this.$nextTick(() => {
        this.$refs.couponSelect.init(this.dataForm.couponList)
      })
    },
    /**
     * 优惠券选择回调
     */
    selectDistributionCoupon (coupons) {
      // console.log('coupons', coupons)
      if (coupons.length > 0) {
        this.dataForm.couponList = coupons
      } else {
        this.dataForm.couponList = []
        this.isCoupon = false
      }
    },
    /**
     * 权益选项数据校验
     */
    setRights () {
      // 邮费
      if (this.isFreeFee) {
        this.dataForm.isFreeFee = 1
      } else {
        this.dataForm.isFreeFee = 0
      }
      // 折扣
      if (!this.isDiscount) {
        this.dataForm.discount = 10
        this.dataForm.discountRange = 0
        this.dataForm.discountType = 0
      }
      // 优惠券
      if (!this.isCoupon) {
        this.dataForm.couponList = []
      }
      // 积分倍率
      if (!this.isRateScore) {
        this.dataForm.rateScore = 1
      }
      // 赠送积分
      if (!this.isPresScore) {
        this.dataForm.presScore = 0
      }
      // 其他权益
      if (!this.isOrther) {
        this.dataForm.userRightsIds = []
      } else {
        this.dataForm.userRightsIds = this.userRightsIds
      }
    },
    /**
     * 确定事件
     */
    submitProds () {
      this.setRights()
      // console.log(this.$refs.categoryTree.getCheckedKeys().length)
      if (this.dataForm.discountType === 1 && this.$refs.categoryTree.getCheckedKeys().length === 0) {
        this.errorMsg('请选择分类')
        return
      } else if (this.dataForm.discountType === 1) {
        this.dataForm.categorys = this.$refs.categoryTree.getCheckedKeys()
      }
      // 校验数据
      if (this.dataForm.levelName.length < 1) {
        this.errorMsg('等级名称不能为空')
        return
      }
      if (this.dataForm.levelType === 1) {

      }
      this.$http({
        url: this.$http.adornUrl(`/user/userLevel`),
        method: 'put',
        data: this.$http.adornData(this.dataForm)
      }).then(({ data }) => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500
        })
        this.$emit('refreshDataList')
      }).catch(() => { })
      this.dataForm = []
      this.visible = false
    },
    setRightsStatus (data) {
      data.isFreeFee === 0 ? this.isFreeFee = false : this.isFreeFee = true
      data.discount === 10 ? this.isDiscount = false : this.isDiscount = true
      data.rateScore === 1 ? this.isRateScore = false : this.isRateScore = true
      data.presScore === 0 ? this.isPresScore = false : this.isPresScore = true
      data.couponList.length < 1 ? this.isCoupon = false : this.isCoupon = true
      data.userRightsIds.length < 1 ? this.isOrther = false : this.isOrther = true
    },
    /**
     * 所需成长值数据变化校验
     */
    changeNeedGrowth () {
      let num = this.setNumber(this.dataForm.needGrowth)
      if (this.maxNeedGrowth) {
        num = num > this.maxNeedGrowth ? this.maxNeedGrowth : num
      }
      this.dataForm.needGrowth = num < this.minNeedGrowth ? this.minNeedGrowth : num
    },
    /**
     * 所需金额数据变化校验
     */
    changeNeedAmount () {
      let needAmount = this.setNumber(this.dataForm.needAmount)
      this.dataForm.needAmount = needAmount === 0 ? 1 : needAmount
    },
    /**
     * 会员时间数据变化校验
     */
    changeTerm () {
      let term = this.setNumber(this.dataForm.term)
      this.dataForm.term = term === 0 ? 1 : term
    },
    /**
     * 权益多选时触发事件
     */
    checkbox (value) {
      // if (value.length < 1) {
      //   this.isOrther = false
      // }
    },
    /**
     * 判断数据
     */
    setNumber (value) {
      var num = Math.round(value)
      if (num < 0) {
        return 0
      } else {
        return num
      }
    },
    /**
     * 错误提示框
     */
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
.prods-select-body {
  height: 500px;
  weight: 500px;
  overflow: auto;
}
</style>
