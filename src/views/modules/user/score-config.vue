<template >
  <div class="distribution-积分设置-set gray-box top-redius border-bottom-gray">
    <div class="title">积分获取设置</div>
    <el-form
      label-width="180px"
      class="set-form"
      :rules="dataRule"
      :model="dataForm"
      ref="dataForm"
      size="mini"
    >
      <!-- <el-form-item label="奖励设置"> -->
      <!-- <el-checkbox v-model="dataForm.awardSwitch"
                     :false-label='0'
      :true-label='1'>默认奖励</el-checkbox>-->
      <!-- </el-form-item> -->
      <!-- <el-checkbox v-model="dataForm.levelSetConditionsSwitch.boundCustomers">绑定客户数</el-checkbox>
      <el-checkbox v-model="dataForm.levelSetConditionsSwitch.invitedVeeker">邀请分销员数</el-checkbox>-->
      <br />
      <!-- <el-button @click="addRow"                    :rules="[{required: true, message: '注册积分获取不能为空', trigger: 'blur'}]"
      style="margin-top:15px">添加等级</el-button>-->
      <el-form-item label="注册可获取的积分:" style="width:440px" prop="registerScore">
        <el-input-number
          v-model="dataForm.registerScore"
          placeholder="积分"
          :precision="0"
          :min="1"
          controls-position="right"
          size="small"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到1天可获取积分:" style="width:440px" prop="signInScoreOne">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreOne"
          placeholder="积分"
          controls-position="right"
          size="small"
          :precision="0"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到2天可获取积分:" style="width:440px" prop="signInScoreTwo">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreTwo"
          controls-position="right"
          size="small"
          :precision="0"
          :min="1"
          placeholder="积分"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到3天可获取积分:" style="width:440px" prop="signInScoreThree">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreThree"
          controls-position="right"
          :precision="0"
          :min="1"
          size="small"
          placeholder="积分"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到4天可获取积分:" style="width:440px" prop="signInScoreFour">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreFour"
          controls-position="right"
          :precision="0"
          :min="1"
          size="small"
          placeholder="积分"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到5天可获取积分:" style="width:440px" prop="signInScoreFive">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreFive"
          controls-position="right"
          :precision="0"
          :min="1"
          size="small"
          placeholder="积分"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到6天可获取积分:" style="width:440px" prop="signInScoreSix">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreSix"
          controls-position="right"
          :precision="0"
          :min="1"
          size="small"
          placeholder="积分"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到7天可获取积分:" style="width:440px" prop="signInScoreSeven">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number
          v-model="signInScoreSeven"
          controls-position="right"
          :precision="0"
          :min="1"
          size="small"
          placeholder="积分"
          type="number"
        ></el-input-number>
      </el-form-item>

      <!-- <div class="title">积分使用设置</div> -->
      <!-- <br> -->
      <el-form-item label="购买商品每消费:" style="width:440px" prop="shopGetScore">
        <el-input
          v-model="dataForm.shopGetScore"
          size="small"
          type="number"
          min="1"
          @change="setShopGetScore"
        >
          <template slot="append">元可获取1积分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="积分购买商品:" style="width:440px" placeholder="积分" prop="shopUseScore">
        <el-input
          v-model="dataForm.shopUseScore"
          size="small"
          type="number"
          min="1"
          @change="setShopUseScore"
        >
          <template slot="append">积分可抵扣1元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="积分获取上限:" style="width:440px">
        <el-radio-group v-model="getDiscountRange">
          <el-radio :label="0">全平台比例</el-radio>
          <el-radio :label="1">商品分类比例</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="积分使用上限:" style="width:440px">
        <el-radio-group v-model="useDiscountRange">
          <el-radio :label="0">全平台比例</el-radio>
          <el-radio :label="1">商品分类比例</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="获取比例上限(%):" v-if="getDiscountRange === 0">
        <el-input-number
          v-model="dataForm.getDiscount"
          controls-position="right"
          :precision="0"
          :min="0"
          :max="100"
          size="small"
          placeholder="比例"
          type="number"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="使用比例上限(%):" v-if="useDiscountRange === 0">
        <el-input-number
          v-model="dataForm.useDiscount"
          controls-position="right"
          :precision="0"
          :min="0"
          :max="100"
          size="small"
          placeholder="比例"
          type="number"
        ></el-input-number>
      </el-form-item>
      <!-- <el-form-item label="比例上限(%):" style="width:1840px"> -->
      <el-table
        :data="dataForm.categoryConfigs"
        class="elTable"
        v-if="useDiscountRange === 1 || getDiscountRange === 1"
        border
        align="left"
        style="width:100%"
      >
        <el-table-column prop="levelName" style="width:20%" label="分类名称" align="center">
          <template slot-scope="scope" align="left">
            <!-- <div class="table-template"> -->
            <!-- <div class="table-input-box" align="left"> -->
            <el-form-item
              :prop="'categoryConfigs.' + scope.$index + '.categoryName'"
              align="center"
            >
              <div class="table-input-box" align="left">{{scope.row.categoryName}}</div>
              <!-- <el-tag v-model=""></el-tag> -->
              <!-- <el-input :disabled="true"
              v-model="scope.row.categoryName"></el-input>-->
            </el-form-item>
            <!-- </div> -->
            <!-- </div> -->
          </template>
        </el-table-column>

        <el-table-column
          prop="presScore"
          style="width:40%"
          label="获取积分上限(%)"
          align="center"
          v-if="getDiscountRange === 1"
        >
          <template slot-scope="scope" align="left">
            <div class="table-template">
              <!-- <div class="table-input-box"> -->
              <el-form-item
                :prop="'categoryConfigs.' + scope.$index + '.getScoreLimit'"
                align="left"
              >
                <el-input-number
                  v-model="scope.row.getScoreLimit"
                  size="medium"
                  :max="100"
                  :min="0"
                  :precision="1"
                ></el-input-number>
              </el-form-item>
              <!-- </div> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="presScore"
          style="width:40%"
          label="使用积分上限(%)"
          align="center"
          v-if="useDiscountRange === 1"
        >
          <template slot-scope="scope" align="left">
            <div class="table-template">
              <!-- <div class="table-input-box"> -->
              <el-form-item
                :prop="'categoryConfigs.' + scope.$index + '.useScoreLimit'"
                align="left"
              >
                <el-input-number
                  v-model="scope.row.useScoreLimit"
                  size="medium"
                  :max="100"
                  :min="0"
                  :precision="1"
                ></el-input-number>
              </el-form-item>
              <!-- </div> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-form-item> -->
    </el-form>
    <el-button @click="dataFormSubmit()">保存</el-button>

    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        id: null,
        registerScore: 0,
        useDiscountRange: 0,
        getDiscountRange: 0,
        signInScore: [],
        shopGetScore: 0,
        useDiscount: 0,
        getDiscount: 0,
        shopUseScore: 0,
        categoryConfigs: []
      },
      useDiscountRange: 0,
      getDiscountRange: 0,
      signInScoreOne: 0,
      signInScoreTwo: 0,
      signInScoreThree: 0,
      signInScoreFour: 0,
      signInScoreFive: 0,
      signInScoreSix: 0,
      signInScoreSeven: 0,
      isConfig: false,
      value: '',
      dataRule: {
        registerScore: [
          { required: true, message: '注册积分获取不能为空', trigger: 'blur' }
        ],
        // signInScoreSeven: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreOne: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreTwo: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreThree: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreFour: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreFive: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScoreSix: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        shopGetScore: [
          { required: true, message: '购物积分获取不能为空', trigger: 'blur' }
        ],
        shopUseScore: [
          { required: true, message: '购物积分抵扣不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      console.log('aaaaa')
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/user/scoreConfig/info/' + 'SCORE_CONFIG'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          console.log('data', data)
          this.dataForm = data
          this.signInScoreOne = data.signInScore[0]
          this.signInScoreTwo = data.signInScore[1]
          this.signInScoreThree = data.signInScore[2]
          this.signInScoreFour = data.signInScore[3]
          this.signInScoreFive = data.signInScore[4]
          this.signInScoreSix = data.signInScore[5]
          this.signInScoreSeven = data.signInScore[6]
          if (data.signInScoreString) {
            if (!data.useDiscountRange) {
              console.log('asdf')
              this.useDiscountRange = 0
            } else {
              this.useDiscountRange = this.dataForm.useDiscountRange
            }
            if (!data.getDiscountRange) {
              this.getDiscountRange = 0
            } else {
              this.getDiscountRange = this.dataForm.getDiscountRange
            }
          }
          this.dataForm.categoryConfigs = data.categoryConfigs
        })
      })
    },
    setShopGetScore () {
      let num = Math.round(this.dataForm.shopGetScore)
      this.dataForm.shopGetScore = num < 1 ? 1 : num
    },
    setShopUseScore () {
      let num = Math.round(this.dataForm.shopUseScore)
      this.dataForm.shopUseScore = num < 1 ? 1 : num
    },
    comparaConfig () {
      this.isConfig = false
      this.dataForm.categoryConfigs.forEach(item => {
        console.log(!item.useScoreLimit, item.useScoreLimit)
        console.log(!item.useScoreLimit, item.useScoreLimit)
        if (this.dataForm.useDiscountRange === 1 && !item.useScoreLimit) {
          this.value = '使用积分上限百分比不能为零或者空'
          this.isConfig = true
          console.log('a')
          return true
        }
        if (this.dataForm.getDiscountRange === 1 && !item.getScoreLimit) {
          this.value = '获取积分上限百分比不能为零或者空'
          this.isConfig = true
          console.log('b')
          return true
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.comparaConfig()
      console.log('this.isConfig', this.isConfig)
      if (this.isConfig) {
        this.errorMsg(this.value)
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.signInScore = []
          this.dataForm.useDiscountRange = this.useDiscountRange
          this.dataForm.getDiscountRange = this.getDiscountRange
          console.log(this.dataForm)
          this.dataForm.signInScore.push(this.signInScoreOne || 0)
          this.dataForm.signInScore.push(this.signInScoreTwo || 0)
          this.dataForm.signInScore.push(this.signInScoreThree || 0)
          this.dataForm.signInScore.push(this.signInScoreFour || 0)
          this.dataForm.signInScore.push(this.signInScoreFive || 0)
          this.dataForm.signInScore.push(this.signInScoreSix || 0)
          this.dataForm.signInScore.push(this.signInScoreSeven || 0)
          this.$http({
            url: this.$http.adornUrl('/user/scoreConfig'),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init()
              }
            })
          })
        }
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
