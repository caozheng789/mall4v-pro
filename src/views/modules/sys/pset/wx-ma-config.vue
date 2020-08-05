<template>
  <div class="miniapp-小程序配置-set gray-box top-redius border-bottom-gray">
    <div class="title">小程序配置</div>
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
      <el-form-item label="微信小程序AppId:" style="width:640px" prop="appId">
        <el-input v-model="dataForm.appId" placeholder="微信小程序AppId" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="微信小程序secret:" style="width:640px" prop="secret">
        <el-input v-model="dataForm.secret" placeholder="微信小程序secret" controls-position="right"></el-input>
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
        // paramKey: 'MA_CONFIG',
        appId: null,
        secret: null
        // paramValue: null
      },
      dataRule: {
        appId: [
          { required: true, message: '微信小程序AppId不能为空', trigger: 'blur' }
        ],
        secret: [
          { required: true, message: '微信小程序secret不能为空', trigger: 'blur' }
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'MA_CONFIG'),
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
      let obj = {}
      obj.appId = this.dataForm.appId
      obj.secret = this.dataForm.secret

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'MA_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': '微信小程序参数配置'
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
