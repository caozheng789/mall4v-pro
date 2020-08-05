<template>
  <div class="distribution-积分获取设置-set gray-box top-redius border-bottom-gray">
    <div class="title">积分获取设置</div>
    <!-- <el-form :model="dataForm"
             :rules="dataRule"
             :label-position="'left'"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="180px"> -->
    <el-form ref="dataForm"
             label-width="180px"
             size="mini"
             class="set-form"
             label-position="left"
             @keyup.enter.native="dataFormSubmit()"
             :rules="dataRule"
             :model="dataForm">
      <!-- <el-form-item style="width:440px"
                    prop="scoreLevelId">
        <span class="tips">积分配置</span>
      </el-form-item> -->
      <!-- <el-form-item label="购物时每满"
                    style="width:440px"
                    prop="shopUserScore">
        <el-input v-model="dataForm.shopUserScore"><template slot="append">积分抵扣1元</template></el-input> -->
      <!-- <span class="tips">积分抵扣1元</span> <template slot="append"></template>-->
      <!-- </el-form-item> -->
      <el-form-item label="注册可获取的积分:"
                    style="width:440px"
                    prop="registerScore">
        <el-input-number v-model="dataForm.registerScore"
                         placeholder="积分"
                         :precision="0"
                         :min="1"
                         controls-position="right"
                         size="small"
                         type="number"></el-input-number>
      </el-form-item>
      <el-form-item label="购买商品每消费:"
                    style="width:440px"
                    prop="shopGetScore">
        <el-input v-model="dataForm.shopGetScore"
                  size="small"><template slot="append">元可获取1积分</template></el-input>
      </el-form-item>
      <el-form-item label="连续签到1天可获取积分:"
                    style="width:440px"
                    prop="signInScore0">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number v-model="dataForm.signInScore[0]"
                         placeholder="积分"
                         controls-position="right"
                         size="small"
                         :precision="0"
                         :min="1"
                         type="number"><template slot="append">积分</template></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到2天可获取积分:"
                    style="width:440px"
                    prop="signInScore1">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number v-model="dataForm.signInScore[1]"
                         controls-position="right"
                         size="small"
                         :precision="0"
                         :min="1"
                         placeholder="积分"
                         type="number"></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到3天可获取积分:"
                    style="width:440px"
                    prop="signInScore2">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number v-model="dataForm.signInScore[2]"
                         controls-position="right"
                         :precision="0"
                         :min="1"
                         size="small"
                         placeholder="积分"
                         type="number"></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到4天可获取积分:"
                    style="width:440px"
                    prop="signInScore3">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number v-model="dataForm.signInScore[3]"
                         controls-position="right"
                         :precision="0"
                         :min="1"
                         size="small"
                         placeholder="积分"
                         type="number"></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到5天可获取积分:"
                    style="width:440px"
                    prop="signInScore4">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number v-model="dataForm.signInScore[4]"
                         controls-position="right"
                         :precision="0"
                         :min="1"
                         size="small"
                         placeholder="积分"
                         type="number"></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到6天可获取积分:"
                    style="width:440px"
                    prop="signInScore5">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number v-model="dataForm.signInScore[5]"
                         controls-position="right"
                         :precision="0"
                         :min="1"
                         size="small"
                         placeholder="积分"
                         type="number"></el-input-number>
      </el-form-item>
      <el-form-item label="连续签到7天可获取积分:"
                    style="width:440px"
                    prop="signInScore6">
        <!-- <el-input v-model="dataForm.signInScore"></el-input> -->
        <el-input-number v-model="dataForm.signInScore[6]"
                         controls-position="right"
                         :precision="0"
                         :min="1"
                         size="small"
                         placeholder="积分"
                         type="number"></el-input-number>
      </el-form-item>
      <el-button @click="dataFormSubmit()">保存</el-button>

    </el-form>
    <span slot="footer"
          class="dialog-footer">
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
        signInScore: [1, 1, 1, 1, 1, 1, 1],
        shopGetScore: 0,
        shopUseScore: 0
      },
      dataRule: {
        registerScore: [
          { required: true, message: '注册积分获取不能为空', trigger: 'blur' }
        ],
        // signInScore0: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScore1: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScore2: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScore3: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScore4: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScore5: [
        //   { required: true, message: '签到积分获取不能为空', trigger: 'blur' }
        // ],
        // signInScore6: [
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
      // this.$refs['dataForm'].resetFields()
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/user/scoreConfig/info/' + 'SCORE_CONFIG'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          console.log(data)
          if (data.id) {
            this.dataForm.id = data.id
          }
          if (data.shopGetScore) {
            this.dataForm = data
          }
        })
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.dataForm)
          this.$http({
            url: this.$http.adornUrl('/user/scoreConfig'),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    }
  }
}
</script>
