<template>
  <div class="quickbird-快递鸟物流配置-set gray-box top-redius border-bottom-gray">
    <div class="title">快递鸟物流配置</div>
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
      <el-form-item label="快递鸟用户id:" style="width:640px" prop="eBusinessID">
        <el-input v-model="dataForm.eBusinessID" placeholder="快递鸟用户id" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="快递鸟appKey:" style="width:640px" prop="appKey">
        <el-input v-model="dataForm.appKey" placeholder="快递鸟appKey" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="快递鸟reqUrl:" style="width:640px" prop="reqUrl">
        <el-input v-model="dataForm.reqUrl" placeholder="快递鸟reqUrl" controls-position="right"></el-input>
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
        // paramKey: 'QUICKBIRD_CONFIG',
        eBusinessID: null,
        appKey: null,
        reqUrl: null
        // paramValue: null
      },
      quickBird: {
        // eBusinessID: null,
        // appKey: null,
        // reqUrl: null
      },
      dataRule: {
        eBusinessID: [
          { required: true, message: '快递鸟用户id', trigger: 'blur' }
        ],
        appKey: [
          { required: true, message: '快递鸟appKey', trigger: 'blur' }
        ],
        reqUrl: [
          { required: true, message: '快递鸟reqUrl不能为空', trigger: 'blur' }
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'QUICKBIRD_CONFIG'),
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
          this.getQuickBirdParam()
          this.$http({
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'QUICKBIRD_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': '快递鸟配置参数'
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
    },
    /**
     * dataform -> quickBird
     */
    getQuickBirdParam () {
      this.quickBird.eBusinessID = this.dataForm.eBusinessID
      this.quickBird.appKey = this.dataForm.appKey
      this.quickBird.reqUrl = this.dataForm.reqUrl
    },
    /**
     *  quickBird -> dataform
     */

    getDataParam (data) {
      let obj = JSON.parse(data.paramValue)
      this.dataForm.id = data.id
      this.dataForm.paramKey = data.paramKey
      this.dataForm.paramValue = data.paramValue
      this.dataForm.eBusinessID = data.quickBird.eBusinessID == null ? obj.eBusinessID : data.quickBird.eBusinessID
      this.dataForm.appKey = data.quickBird.appKey
      this.dataForm.reqUrl = data.quickBird.reqUrl
    }
  }
}
</script>
