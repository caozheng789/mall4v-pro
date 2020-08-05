<template>
  <div class="pay-wx-set gray-box top-redius border-bottom-gray">
    <div class="title">微信支付配置</div>
    <el-form
      ref="dataForm"
      label-width="180px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item label="微信支付mchId:" style="width:640px" prop="mchId">
        <el-input v-model="dataForm.mchId" placeholder="微信支付mchId" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="微信支付mchKey:" style="width:640px" prop="mchKey">
        <el-input v-model="dataForm.mchKey" placeholder="微信支付mchKey" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="支付证书路径:" style="width:640px" prop="keyPath">
        <el-input v-model="dataForm.keyPath" placeholder="支付证书路径" controls-position="right"></el-input>
      </el-form-item>
      <el-button @click="dataFormSubmit()">保存</el-button>
    </el-form>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>-->
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        // id: null,
        // paramKey: 'WXPAY_CONFIG',
        mchId: null,
        mchKey: null,
        keyPath: null,
        signType: null
        // paramValue: null
      },
      value: [],
      dataRule: {
        mchId: [
          { required: true, message: '微信支付mchId不能为空', trigger: 'blur' }
        ],
        mchKey: [
          { required: true, message: '微信支付mchKey不能为空', trigger: 'blur' }
        ],
        keyPath: [
          { required: true, message: '支付证书路径不能为空', trigger: 'blur' }
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'WXPAY_CONFIG'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data) {
            this.dataForm = data
          }
        })
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        // this.dataForm.signType = JSON.stringify(this.value)
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'WXPAY_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': '微信支付参数配置'
            })
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

