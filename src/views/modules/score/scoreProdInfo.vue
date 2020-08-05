<template>
  <div class="mod-prod-info">
    <!-- <div class="title">新增积分商品</div> -->
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="产品视频">
        <video-upload v-model="dataForm.video" />
      </el-form-item>
      <el-form-item label="产品图片">
        <imgs-upload v-model="dataForm.imgs" />
        <span>建议图片尺寸为800*800，可拖动排序，首图为主图，最多上传6张。</span>
      </el-form-item>
      <el-form-item label="产品名称" prop="prodName" :rules="[{ required: true, message: '产品名称不能为空'}]">
        <el-col :span="8">
          <el-input v-model="dataForm.prodName" placeholder="产品名称" maxlength="50"></el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="兑换方式"
                    prop="categoryId">
        <el-radio-group v-model="dataForm.scoreProdType">
          <el-radio :label="0">仅积分兑换</el-radio>
          <el-radio :label="1">积分加金额</el-radio>
          
        </el-radio-group>
      </el-form-item>-->
      <!-- <el-form-item label="产品积分"
                    prop="prodName">
        <el-col :span="8">
          <el-input v-model="dataForm.scorePrice"
                    placeholder="产品积分"
                    maxlength="50"></el-input>
        </el-col>
      </el-form-item>-->
      <el-form-item label="产品卖点" prop="brief">
        <el-col :span="8">
          <el-input
            v-model="dataForm.brief"
            type="textarea"
            :autosize="{minRows: 2, maxRows: 4}"
            placeholder="产品卖点"
          ></el-input>
        </el-col>
      </el-form-item>
      <!-- <prod-transport v-show="dataForm.deliveryMode.hasShopDelivery"
      v-model="dataForm.deliveryTemplateId"></prod-transport>-->
      <sku-tag ref="skuTag" @change="skuTagChangeSkuHandler" :skuList="dataForm.skuList"></sku-tag>
      <sku-table ref="skuTable" v-model="dataForm.skuList" :prodName.sync="dataForm.prodName"></sku-table>

      <el-form-item label="产品详情" prop="content">
        <tiny-mce v-model="dataForm.content" ref="content" style="width:1000px"></tiny-mce>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import MulPicUpload from '@/components/mul-pic-upload'
import VideoUpload from '@/components/video-upload'
import ImgsUpload from '@/components/imgs-upload'
// import ProdTransport from './prod-transport'
import SkuTag from './sku-tag'
import SkuTable from './sku-table'
import TinyMce from '@/components/tiny-mce'
// import { treeDataTranslate, idList } from '@/utils'

export default {
  data () {
    return {
      // 平台分类树展示与回显
      // category: {
      //   list: [],
      //   selected: [],
      //   props: {
      //     value: 'categoryId',
      //     label: 'categoryName'
      //   }
      // },
      // 本店分类
      // categoryList: [],
      // 规格列表
      dataForm: {
        prodName: '',
        brief: '',
        video: '',
        pic: '',
        imgs: '',
        categoryId: this.$route.query.categoryId ? parseInt(this.$route.query.categoryId) : null,
        shopCategoryId: null, // 店铺分类id
        prodId: 0,
        prodScore: 0,
        scorePrice: 0,
        skuList: [],
        scoreProdType: 0,
        content: '',
        deliveryMode: {
          hasShopDelivery: false,
          hasUserPickUp: false
        },
        isCheck: false,
        value: false,
        isSubmit: false,
        skuPartyCodes: true,
        deliveryTemplateId: null
      },
      resourcesUrl: window.SITE_CONFIG.resourcesUrl
    }
  },
  components: {
    ImgsUpload,
    VideoUpload,
    TinyMce,
    // ProdTransport,
    SkuTag,
    SkuTable
  },
  computed: {
    defalutSku () {
      return this.$store.state.prod.defalutSku
    }
  },
  activated () {
    // console.log(2222222)
    this.dataForm.prodId = this.$route.query.prodId
    // this.getCategoryList()
    // this.getCategoryTree()
    this.isSubmit = false
    this.getDataList()
  },
  methods: {
    // 获取分类数据
    getDataList () {
      if (this.dataForm.prodId) {
        // 获取产品数据
        this.$http({
          url: this.$http.adornUrl(`/prod/prod/info/${this.dataForm.prodId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.dataForm.deliveryMode = JSON.parse(data.deliveryMode)
          // this.category.selected = idList(this.category.list, this.dataForm.categoryId, 'categoryId', 'children').reverse()
          this.$refs.skuTag.init(data.skuList)
          this.$refs.skuTable.init()
        })
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.skuTag.init()
          this.dataForm.pic = ''
          this.dataForm.imgs = ''
          this.dataForm.video = ''
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        // if (!valid) {
        //   return
        // }
        if (!this.dataForm.imgs) {
          this.errorMsg('请选择图片上传')
          return
        }
        // 校验sku列表
        this.checkSkuList()
        if (this.isCheck) {
          this.errorMsg(this.value)
          return
        }
        // if (!this.dataForm.deliveryMode) {
        //   this.errorMsg('请选择配送方式')
        //   return
        // }
        // if (this.dataForm.deliveryMode.hasShopDelivery && !this.dataForm.deliveryTemplateId) {
        //   this.errorMsg('请选择运费模板')
        //   return
        // }
        let param = Object.assign({}, this.dataForm)
        // 设置价格和库存
        this.paramSetPriceAndStocks(param)
        console.log(this.skuPartyCodes)
        console.log(this.partyCode)
        if (this.partyCode != null && this.partyCode !== '' && this.skuPartyCodes) {
          this.errorMsg('商品编码 ' + this.partyCode + ' 已存在，请输入新的编码')
          return
        }

        param.deliveryMode = undefined
        param.deliveryModeVo = this.dataForm.deliveryMode
        // 商品主图
        param.pic = this.dataForm.imgs.split(',')[0]
        console.log('this.dataForm', this.dataForm.skuList)
        if (this.isSubmit) {
          return false
        }
        this.isSubmit = true
        this.$http({
          url: this.$http.adornUrl(`/admin/scoreProduct`),
          method: param.prodId ? 'put' : 'post',
          data: this.$http.adornData(param)
        }).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$store.commit('common/removeMainActiveTab')
              this.$router.push({ name: 'score-scoreProdList' })
              this.$emit('refreshDataList')
            }
          })
        }).catch((e) => {
          this.isSubmit = false
        })
      })
    },
    checkSkuList () {
      // console.log('skuList', this.dataForm.skuList)
      this.dataForm.skuList.forEach(item => {
        this.isCheck = false
        // if (!item.pic) {
        //   this.isCheck = true
        //   this.value = '请上传sku图片'
        //   return false
        // }
        if (!item.price && item.price !== 0) {
          this.isCheck = true
          this.value = '销售价不能为空'
          return false
        }
        if (!item.oriPrice && item.oriPrice !== 0) {
          this.isCheck = true
          this.value = '市场价不能为空'
          return false
        }
        console.log('aaa', this.isCheck, this.value)
        if (!item.skuScore) {
          this.isCheck = true
          this.value = '积分价不能为空'
          return false
        }
        if (item.stocks == null) {
          this.isCheck = true
          this.value = '库存不能为空'
          return false
        }
      })
    },
    paramSetPriceAndStocks (param) {
      // 获取规格属性信息
      // param.skuList = this.$refs.prodSpec.getTableSpecData()
      // 商品库存
      param.totalStocks = 0
      // 商品价格
      param.price = 0
      // 商品原价
      param.oriPrice = 0
      // 商品积分价格
      param.scorePrice = param.skuList[0].skuScore
      // 商品实际库存
      var partyCodes = []
      this.skuPartyCodes = false
      for (let i = 0; i < param.skuList.length; i++) {
        const element = param.skuList[i]
        if (element.partyCode != null && element.partyCode !== '' && partyCodes.indexOf(element.partyCode) !== -1) {
          this.partyCode = element.partyCode
          this.skuPartyCodes = true
          return false
        }
        partyCodes.push(element.partyCode)
        if (element.status !== 1) {
          continue
        }
        if (param.price === 0) {
          param.price = element.price ? Number.parseFloat(element.price) : 0
        }
        if (param.scorePrice === 0) {
          param.scorePrice = element.skuScore ? Number.parseFloat(element.skuScore) : 0
        }
        // 商品价格为最低价的那件商品的价格
        param.price = Math.min(param.price, element.price)
        param.scorePrice = Math.min(param.scorePrice, element.skuScore)
        // console.log(param.price)
        // console.log(element.price)
        if (param.price === element.price) {
          param.oriPrice = element.oriPrice ? Number.parseFloat(element.oriPrice) : 0
        }
        param.totalStocks += element.stocks ? Number.parseInt(element.stocks) : 0
      }
      // 如果sku没有商品名称，则使用商品的商品名称
      if (param.skuList.length === 1) {
        param.skuList[0].prodName = this.dataForm.prodName
      }
    },
    skuTagChangeSkuHandler (skuList) {
      const prodName = this.dataForm.prodName
      skuList.forEach(sku => {
        if (sku.properties) {
          sku.skuName = ''
          let properties = sku.properties.split(';')
          for (const propertiesKey in properties) {
            sku.skuName += properties[propertiesKey].split(':')[1] + ' '
          }
          sku.prodName = prodName + ' ' + sku.skuName
        }
      })
      this.dataForm.skuList = skuList
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
