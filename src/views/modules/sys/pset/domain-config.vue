<template>
  <div class="domain-set gray-box top-redius border-bottom-gray">
    <div class="title">域名配置（必须！！）</div>
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
      <el-form-item label="文件资源服务器域名" style="width:640px" prop="resourcesDomainName">
        <el-input
          v-model="dataForm.resourcesDomainName"
          placeholder="就是能访问图片的域名"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="api接口域名" style="width:640px" prop="apiDomainName">
        <el-input
          v-model="dataForm.apiDomainName"
          placeholder="就是能访问api.jar这个应用的域名"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="admin接口域名" style="width:640px" prop="adminDomainName">
        <el-input
          v-model="dataForm.adminDomainName"
          placeholder="就是能访问admin.jar这个应用的域名"
          controls-position="right"
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      <el-button @click="dataFormSubmit()">保存</el-button>
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        accessKeyId: null,
        accessKeySecret: null,
        signName: null
      },
      searchForm: {},
      dataRule: {
        apiDomainName: [
          { required: true, message: 'api接口域名不能为空', trigger: 'blur' }
        ],
        adminDomainName: [
          { required: true, message: 'admin接口域名不能为空', trigger: 'blur' }
        ],
        resourcesDomainName: [
          { required: true, message: '资源服务器域名不能为空', trigger: 'blur' }
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'DOMAIN_CONFIG'),
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
              'paramKey': 'DOMAIN_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': '域名配置'
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
