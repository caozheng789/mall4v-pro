<template>
  <el-dialog :title="'修改'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="待结算金额"
                    prop="userName">
        <el-input v-model="dataForm.unsettledAmount"></el-input>
      </el-form-item>
      <el-form-item label="可提现金额"
                    prop="userName">
        <el-input v-model="dataForm.settledAmount"></el-input>
      </el-form-item>
      <el-form-item label="已失效金额"
                    prop="userName">
        <el-input v-model="dataForm.invalidAmount"></el-input>
      </el-form-item>
      <el-form-item label="积累收益"
                    prop="userName">
        <el-input v-model="dataForm.addupAmount"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        walletId: null,
        distributionUserId: null,
        unsettledAmount: null,
        settledAmount: null,
        invalidAmount: null,
        addupAmount: null,
        version: null
      },
      dataRule: {
      }
    }
  },
  methods: {
    init (walletData) {
      this.dataForm = Object.assign({}, walletData)
      this.visible = true
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/distribution/distributionUserWallet'),
            method: 'put',
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
