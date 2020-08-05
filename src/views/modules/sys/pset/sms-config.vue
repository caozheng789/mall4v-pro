<template>
  <div class="shortmsg-短信服务平台配置-set gray-box top-redius border-bottom-gray">
    <div class="title">阿里大鱼短信服务平台</div>
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
      <!-- <el-form-item label="短信服务平台名称" style="width:640px" prop="shortmsgName">
        <el-input
          disabled="true"
          v-model="dataForm.shortmsgName"
          placeholder="短信服务平台名称"
          controls-position="right"
        ></el-input>
      </el-form-item>-->
      <el-form-item label="短信服务accessKeyId" style="width:640px" prop="accessKeyId">
        <el-input
          v-model="dataForm.accessKeyId"
          placeholder="短信服务accessKeyId"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="短信accessKeySecret" style="width:640px" prop="accessKeySecret">
        <el-input
          v-model="dataForm.accessKeySecret"
          placeholder="短信服务accessKeySecret"
          controls-position="right"
        ></el-input>
      </el-form-item>
      <el-form-item label="短信签名signName" style="width:640px" prop="signName">
        <el-input v-model="dataForm.signName" placeholder="短信签名signName" controls-position="right"></el-input>
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
        // id: null,
        // paramKey: 'ALIDAYU_CONFIG',
        // shortmsgName: '阿里大鱼短信服务平台',
        accessKeyId: null,
        accessKeySecret: null,
        signName: null
        // paramValue: null
      },
      searchForm: {},
      dataRule: {
        // shortmsgName: [
        //   { required: true, message: '短信服务平台名称不能为空', trigger: 'blur' }
        // ],
        accessKeyId: [
          { required: true, message: '短信服务accessKeyId不能为空', trigger: 'blur' }
        ],
        accessKeySecret: [
          { required: true, message: '短信accessKeySecret不能为空', trigger: 'blur' }
        ],
        signName: [
          { required: true, message: '短信签名signName不能为空', trigger: 'blur' }
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'ALIDAYU_CONFIG'),
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
              'paramKey': 'ALIDAYU_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': '阿里大鱼短信服务配置参数'
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
