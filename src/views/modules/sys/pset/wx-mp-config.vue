<template>
  <div class="public-微信公众号配置-set gray-box top-redius border-bottom-gray">
    <div class="title">微信公众号配置</div>
    <el-form
      ref="dataForm"
      label-width="240px"
      size="mini"
      class="set-form"
      label-position="left"
      @keyup.enter.native="dataFormSubmit()"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item label="微信公众号-appId:" style="width:640px" prop="appId">
        <el-input v-model="dataForm.appId" placeholder="微信公众号-appId" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="微信公众号-secret:" style="width:640px" prop="secret">
        <el-input v-model="dataForm.secret" placeholder="微信公众号-secret" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="微信公众号-消息加解密token:" style="width:640px" prop="token">
        <el-input
          v-model="dataForm.token"
          type="textarea"
          placeholder="微信公众号-消息加解密token"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="微信公众号-消息加解密aesKey:" style="width:640px" prop="aesKey">
        <el-input
          v-model="dataForm.aesKey"
          type="textarea"
          placeholder="微信公众号-消息加解密aesKey"
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
        // id: null,
        // paramKey: 'MP_CONFIG',
        appId: null,
        secret: null,
        token: null,
        aesKey: null
        // paramValue: null
      },
      dataRule: {
        appId: [
          { required: true, message: '微信公众号-appId不能为空', trigger: 'blur' }
        ],
        secret: [
          { required: true, message: '微信公众号-secret不能为空', trigger: 'blur' }
        ]
        // ,
        // token: [
        //   { required: true, message: '微信公众号-消息加解密token不能为空', trigger: 'blur' }
        // ],
        // aesKey: [
        //   { required: true, message: '微信公众号-消息加解密aesKey不能为空', trigger: 'blur' }
        // ]
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'MP_CONFIG'),
          method: 'get',
          params: this.$http.adornParams({
            id: this.dataForm.id,
            key: this.dataForm.paramKey
          })
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
      let obj = {}
      obj.appId = this.dataForm.appId
      obj.secret = this.dataForm.secret
      obj.token = this.dataForm.token
      obj.aesKey = this.dataForm.aesKey
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'MP_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': '微信公众号参数配置'
            })
          }).then(({ data }) => {
            if (data) {
              this.init()
            }
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
