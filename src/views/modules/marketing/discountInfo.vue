<template>
  <div class="mod-discountInfo">
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
      style="width:700px"
    >
      <el-form-item label="活动名称" prop="discountName" :rules="[{required: true, message: '不能为空'}]">
        <el-input v-model="dataForm.discountName" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="手机端活动图  （710*260）" prop="mobilePic">
        <img-upload v-model="dataForm.mobilePic"></img-upload>
        <span>建议：手机端活动图尽量使用深色的图片</span>
      </el-form-item>
      <el-form-item label="PC活动列表图 （590*240）" prop="pcPic">
        <img-upload v-model="dataForm.pcPic"></img-upload>
      </el-form-item>
      <el-form-item label="PC活动背景图 （1200*360）" prop="pcBackgroundPic">
        <img-upload v-model="dataForm.pcBackgroundPic"></img-upload>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-col :span="10">
          <el-form-item prop="startTime" :rules="[{required: true, message: '不能为空'}]">
            <el-date-picker
              v-model="dataForm.startTime"
              type="datetime"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="1">-</el-col>
        <el-col :span="10">
          <el-form-item prop="endTime" :rules="[{required: true, message: '不能为空'}]">
            <el-date-picker
              v-model="dataForm.endTime"
              type="datetime"
              placeholder="选择结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="活动类型" size="mini" prop="discountRule">
        <el-radio-group
          v-model="dataForm.discountRule"
          @change="changeDiscountRule"
          :disabled="!!dataForm.discountId"
        >
          <el-radio :label="0">满钱减钱</el-radio>
          <!-- <el-radio :label="1">满件减钱</el-radio> -->
          <el-radio :label="2">满钱打折</el-radio>
          <el-radio :label="3">满件打折</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="减免类型"
        size="mini"
        prop="discountType"
        v-if="dataForm.discountRule === 0 || dataForm.discountRule === 1"
      >
        <el-radio-group v-model="dataForm.discountType" @change="discountTypeChange">
          <el-radio :label="0">按满足最高层级减一次</el-radio>
          <el-radio :label="1">每满一次减一次</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 卡片 -->
      <el-form-item label="优惠内容">
        <el-card
          class="box-card"
          v-for="(discountItem, index) in dataForm.discountItems"
          :key="discountItem.discountItemId"
          style="margin-bottom:30px"
        >
          <div slot="header" class="clearfix" v-if="!dataForm.discountType">
            <span>活动层级 {{index+1}}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="deleteActivityClass(index)"
              v-if="dataForm.discountItems.length > 1"
            >删除</el-button>
          </div>
          <el-form-item
            class="text item"
            label="条件"
            style="margin-bottom:20px"
            :rules="[{required: true, message: '不能为空'}]"
          >
            <span v-if="dataForm.discountType === 1">每满</span>
            <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;满</span>
            <el-input
              type="number"
              size="small"
              v-model="discountItem.needAmount"
              style="width:200px"
              @change="checkNumber(index,1)"
            >
              <template slot="append">{{discountItemTexts[0]}}</template>
            </el-input>
            <el-button type="text" disabled>请输入大于0的整数</el-button>
            <el-tooltip
              class="item"
              effect="light"
              placement="top"
              v-if="dataForm.discountType === 0"
            >
              <div slot="content">使用条件需要随活动层级的递增而递增</div>
              <span>
                <i class="el-icon-question"></i>
              </span>
            </el-tooltip>
          </el-form-item>
          <el-form-item class="text item" label="优惠" :rules="[{required: true, message: '不能为空'}]">
            <span v-if="dataForm.discountRule<2">&nbsp;&nbsp;&nbsp;&nbsp;减</span>
            <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-input
              type="number"
              size="small"
              v-model="discountItem.discount"
              style="width:200px"
              @change="checkNumber(index,2)"
            >
              <template slot="append">{{discountItemTexts[1]}}</template>
            </el-input>
            <el-button type="text" disabled>{{dataForm.discountRule<2?'请输入大于0的数字':'请输入大于0小于10的数字'}}</el-button>
          </el-form-item>
        </el-card>
      </el-form-item>
      <!-- 卡片 -->
      <el-form-item
        label="优惠金额上限"
        prop="maxReduceAmount"
        v-if="dataForm.discountRule>=2 || dataForm.discountType !== 0"
        :rules="[{required: true, message: '不能为空'}]"
      >
        <el-input v-model="dataForm.maxReduceAmount" placeholder="优惠金额上限"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button plain @click="addActivityClass()" v-if="!dataForm.discountType">添加活动</el-button>
      </el-form-item>
      <el-form-item
        label="适用商品类型"
        size="mini"
        prop="suitableProdType"
        :rules="[{required: true, message: '不能为空'}]"
      >
        <el-radio-group v-model="dataForm.suitableProdType" @change="changeDiscountRule">
          <el-radio :label="0">全部商品参与</el-radio>
          <el-radio :label="1">指定商品参与</el-radio>
          <el-radio :label="2">指定商品不参与</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="width:1200px" v-if="dataForm.suitableProdType !== 0">
        <el-row>
          <el-col :span="3" v-for="(discountProd, index) in dataForm.discountProds" :key="index">
            <el-card :body-style="{ padding: '0px' }" style="height: 160px;width: 120px">
              <img :src="discountProd.pic" style="height:104px;width:100%" />
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{discountProd.prodName}}</span>
                <el-button type="text" class="card-prod-name-button" @click="deleteProd(index)">删除</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          v-if="dataForm.suitableProdType === 1 || dataForm.suitableProdType === 2"
          @click="prodsSelectHandle()"
        >选择商品</el-button>
      </el-form-item>
      <!-- 商品 -->
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeTag()">取消</el-button>
      <el-button type="primary" size="mini" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      @refreshSelectProds="selectDiscountProds"
    ></prods-select>
  </div>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
// import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
export default {
  data () {
    return {
      dataForm: {
        discountId: 0,
        discountName: '',
        mobilePic: '',
        pcPic: '',
        pcBackgroundPic: '',
        discountRule: 0,
        discountType: 0,
        suitableProdType: 0,
        maxReduceAmount: 0,
        shopId: '',
        startTime: '',
        endTime: '',
        status: 0,
        discountItems: [],
        discountProds: []
      },
      isSubmit: false,
      prodsSelectVisible: false,
      isTrue: false,
      errorValue: false,
      resourcesUrl: window.SITE_CONFIG.resourcesUrl
    }
  },
  components: {
    ProdsSelect,
    ImgUpload
  },
  computed: {
    discountItemTexts: function () {
      let texts = []
      if (this.dataForm.discountRule === 0 || this.dataForm.discountRule === 2) {
        texts[0] = '元'
      } else {
        texts[0] = '件'
      }
      if (this.dataForm.discountRule === 0 || this.dataForm.discountRule === 1) {
        texts[1] = '元'
      } else {
        texts[1] = '折'
      }
      return texts
    }
  },
  activated () {
    // if (this.$route.query.discountId !== undefined) {
    //   sessionStorage.setItem('discountInfo-params', JSON.stringify(this.$route.query || '{}'))
    // }
    // let sessionStorageParams = JSON.parse(sessionStorage.getItem('discountInfo-params'))
    if (this.$route.query.discountId !== undefined) {
      this.dataForm.discountId = this.$route.query.discountId
    }
    this.isSubmit = false
    this.getDataList()
  },
  watch: {
    'dataForm.discountRule': function (val) {
      if (val === 2 || val === 3) {
        this.dataForm.discountType = 0
      }
    }
  },
  methods: {
    getDataList () {
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.dataForm.discountItems = [{ needAmount: 1, discount: 0.01 }]
      })
      if (this.dataForm.discountId) {
        this.$http({
          url: this.$http.adornUrl(`/admin/discount/info/${this.dataForm.discountId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
        })
      }
    },
    /**
     * 活动类型变化时，更新优惠内容的值
     */
    changeDiscountRule () {
      for (var i = 0; i < this.dataForm.discountItems.length; i++) {
        this.checkNumber(i, 1)
        this.checkNumber(i, 2)
      }
    },
    /**
     * 输入框的数据改变时，对值进行校验
     */
    checkNumber (index, type) {
      var discountItem = this.dataForm.discountItems[index]
      // if(discountItem == null || discountItem.needAmount == null){

      // }
      // item.needAmount <= item.discount
      if (type === 1) {
        if (discountItem.needAmount < 1) {
          discountItem.needAmount = 1
        }
        discountItem.needAmount = Math.round(discountItem.needAmount)
      }
      if (type === 2) {
        // 如果小于零
        if (discountItem.discount <= 0) {
          if (this.dataForm.discountRule < 2) {
            discountItem.discount = 0.01
          } else {
            discountItem.discount = 0.1
          }
        }
        if (discountItem.discount >= 10 && this.dataForm.discountRule >= 2) {
          // 如果折扣大于10
          discountItem.discount = 9.9
        } else if (this.dataForm.discountRule < 2) {
          // 优惠金额保留两位小数
          discountItem.discount = parseFloat(discountItem.discount).toFixed(2)
        } else {
          // 保留一位小数
          discountItem.discount = parseFloat(discountItem.discount).toFixed(1)
          discountItem.discount = discountItem.discount >= 10 ? 9.9 : discountItem.discount
        }
      }
    },
    /**
     * 优惠金额上限校验
     */
    maxReduceAmountChange () {
      let maxReduceAmount = Math.round(this.dataForm.maxReduceAmount)
      this.dataForm.maxReduceAmount = maxReduceAmount < 1 ? 1 : maxReduceAmount
    },
    /**
     * 减免类型选择时，更新数据
     */
    discountTypeChange () {
      this.dataForm.discountItems = [this.dataForm.discountItems[0]]
    },
    // 添加活动层级
    addActivityClass () {
      this.dataForm.discountItems.push({})
    },
    // 删除活动层级
    deleteActivityClass (index) {
      this.dataForm.discountItems.splice(index, 1)
    },
    // 删除指定商品
    deleteProd (index) {
      this.dataForm.discountProds.splice(index, 1)
    },
    // 显示添加指定商品弹框
    prodsSelectHandle () {
      this.prodsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.prodsSelect.init(this.dataForm.discountProds)
      })
    },
    // 添加指定商品
    selectDiscountProds (prods) {
      if (prods) {
        this.dataForm.discountProds = prods
      }
    },
    // 关闭当前标签页
    closeTag () {
      // this.$store.commit('common/removeMainActiveTab')
      this.$router.go(-1)
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
    },
    /**
     * 校验优惠内容是否正确
     */
    checkDiscountItems () {
      this.isTrue = false
      // if (this.dataForm.discountItems.length === 0) {
      //   this.isTrue = true
      //   this.errorValue = '活动项不能为空，最少要有一个活动项'
      //   return true
      // }
      var minAmount = this.dataForm.discountItems[0].discount
      var maxAmount = this.dataForm.discountItems[0].discount
      var amount = 0
      var index = 1
      this.dataForm.discountItems.forEach(item => {
        if (this.dataForm.discountType === 0 && item.needAmount <= amount) {
          this.isTrue = true
          this.errorValue = '活动层级' + index + '的使用条件需要大于' + amount
          return true
        }
        amount = item.needAmount
        index = index + 1
        if (this.dataForm.discountRule === 0) {
          if (item.needAmount <= item.discount) {
            this.isTrue = true
            this.errorValue = '活动条件金额必须大于优惠金额'
            return true
          }
        }
        console.log('item', item)
        if (!item.needAmount) {
          this.isTrue = true
          this.errorValue = '活动的使用条件不能为空'
          return true
        } else if (!item.discount) {
          this.isTrue = true
          this.errorValue = '活动的优惠金额不能为空'
          return true
        }
        minAmount = item.discount < minAmount ? item.discount : minAmount
        maxAmount = item.discount > maxAmount ? item.discount : maxAmount
      })
      if (this.dataForm.discountRule < 2 && this.dataForm.discountType === 0) {
        this.dataForm.maxReduceAmount = maxAmount
      } else if (this.dataForm.discountRule < 2 && this.dataForm.discountType === 1) {
        if (this.dataForm.maxReduceAmount < minAmount) {
          this.isTrue = true
          this.errorValue = '优惠金额上限必须大于或等于最小的优惠金额'
          return true
        }
      }
      if (this.dataForm.suitableProdType !== 0 && this.dataForm.discountProds.length < 1) {
        this.isTrue = true
        this.errorValue = '请选择商品'
        return true
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.checkDiscountItems()
      if (this.isTrue) {
        this.errorMsg(this.errorValue)
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.endTime < this.dataForm.startTime) {
            this.errorMsg('活动开始时间不能大于结束时间')
            return
          }
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl(`/admin/discount`),
            method: this.dataForm.discountId ? 'put' : 'post',
            data: this.$http.adornData({
              'discountId': this.dataForm.discountId || undefined,
              'shopId': this.dataForm.shopId,
              'discountName': this.dataForm.discountName,
              'mobilePic': this.dataForm.mobilePic,
              'pcBackgroundPic': this.dataForm.pcBackgroundPic,
              'pcPic': this.dataForm.pcPic,
              'discountRule': this.dataForm.discountRule,
              'discountType': this.dataForm.discountType,
              'suitableProdType': this.dataForm.suitableProdType,
              'maxReduceAmount': this.dataForm.maxReduceAmount,
              'startTime': this.dataForm.startTime,
              'endTime': this.dataForm.endTime,
              'status': this.dataForm.status,
              'discountItems': this.dataForm.discountItems,
              'discountProds': this.dataForm.discountProds
            })
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                // this.$store.commit('common/removeMainActiveTab')
                this.$router.go(-1)
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.mod-discountInfo {
}
</style>
