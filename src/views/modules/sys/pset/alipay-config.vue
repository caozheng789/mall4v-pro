<template>
  <div class="alipay-config gray-box top-redius border-bottom-gray">
    <div class="title">支付宝支付配置</div>
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
      <el-form-item label="支付宝AppId:" style="width:640px" prop="appId">
        <el-input v-model="dataForm.appId" placeholder="支付宝支付appId" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="应用公钥证书:" style="width:640px" prop="appCertPath">
        <el-input v-model="dataForm.appCertPath" placeholder="应用公钥证书根路径" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="支付宝公钥证书:" style="width:640px" prop="alipayCertPath">
        <el-input v-model="dataForm.alipayCertPath" placeholder="支付宝公钥证书根路径" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="支付宝根证书:" style="width:640px" prop="alipayRootCertPath">
        <el-input
          type="text"
          v-model="dataForm.alipayRootCertPath"
          placeholder="支付宝根证书根路径"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="应用私钥:" style="width:640px" prop="appPrivateKey">
        <el-input
          v-model="dataForm.appPrivateKey"
          type="textarea"
          rows="28"
          placeholder="应用私钥"
          controls-position="right"
        ></el-input>
      </el-form-item>

      <el-button @click="dataFormSubmit()">保存</el-button>
    </el-form>
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
        appId: null,
        appCertPath: null,
        alipayCertPath: null,
        alipayRootCertPath: null,
        appPrivateKey: null
      },
      // alipay: {
      //   appId: null,
      //   appCertPath: null,
      //   alipayCertPath: null,
      //   alipayRootCertPath: null,
      //   appPrivateKey: null
      // },
      dataRule: {
        appId: [
          { required: true, message: 'appId不能为空', trigger: 'blur' }
        ],
        appCertPath: [
          { required: true, message: '应用公钥证书不能为空', trigger: 'blur' }
        ],
        alipayCertPath: [
          { required: true, message: '支付宝公钥证书不能为空', trigger: 'blur' }
        ],
        alipayRootCertPath: [
          { required: true, message: '支付宝根证书不能为空', trigger: 'blur' }
        ],
        appPrivateKey: [
          { required: true, message: '应用私钥不能为空', trigger: 'blur' }
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'ALIPAY_CONFIG'),
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
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'ALIPAY_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': '支付支付参数配置'
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
    /**
     * dataform -> alipay
     */
    // getAlipayParam () {
    //   this.alipay.appId = this.dataForm.appId
    //   this.alipay.appCertPath = this.dataForm.appCertPath
    //   this.alipay.alipayCertPath = this.dataForm.alipayCertPath
    //   this.alipay.alipayRootCertPath = this.dataForm.alipayRootCertPath
    //   this.alipay.appPrivateKey = this.dataForm.appPrivateKey
    // },
    /**
     *  alipay -> dataform
     */
    // getDataParam (data) {
    //   this.dataForm.id = data.id
    //   this.dataForm.paramKey = data.paramKey
    //   this.dataForm.paramValue = data.paramValue
    //   this.dataForm.appId = this.alipay.appId
    //   this.dataForm.appCertPath = this.alipay.appCertPath
    //   this.dataForm.alipayCertPath = this.alipay.alipayCertPath
    //   this.dataForm.alipayRootCertPath = this.alipay.alipayRootCertPath
    //   this.dataForm.appPrivateKey = this.alipay.appPrivateKey
    // }
  }
}
</script>
