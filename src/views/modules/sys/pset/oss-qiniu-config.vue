<template>
  <div class="uploadfile-七牛云文件上传配置-set gray-box top-redius border-bottom-gray">
    <div class="title">七牛云文件上传配置</div>
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
      <el-form-item label="七牛云accessKey:" style="width:640px" prop="accessKey">
        <el-input v-model="dataForm.accessKey" placeholder="七牛云accessKey" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="七牛云secretKey:" style="width:640px" prop="secretKey">
        <el-input v-model="dataForm.secretKey" placeholder="七牛云secretKey" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="七牛云bucket:" style="width:640px" prop="bucket">
        <el-input v-model="dataForm.bucket" placeholder="七牛云bucket" controls-position="right"></el-input>
      </el-form-item>
      <el-form-item label="七牛云zone的选择:" style="width:640px" prop="zone">
        <!-- <el-input v-model="dataForm.zone" placeholder="七牛云zone的选择" controls-position="right"></el-input> -->
        <el-select
          v-model="dataForm.zone"
          filterable
          allow-create
          default-first-option
          placeholder="请选择七牛云zone"
        >
          <el-option
            v-for="item in optionsZone"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否激活:" style="width:640px" prop="isOpen">
        <el-switch v-model="dataForm.isOpen" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
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
        // paramKey: 'QINIU_CONFIG',
        accessKey: null,
        secretKey: null,
        bucket: null,
        resourcesUrl: null,
        zone: null
        // paramValue: null
      },
      // qiniu: {
      //   accessKey: null,
      //   secretKey: null,
      //   bucket: null,
      //   resourcesUrl: null,
      //   zone: null
      // },
      optionsZone: [{
        value: 'HUA_DONG',
        label: '华东'
      }, {
        value: 'HUA_BEI',
        label: '华北'
      }, {
        value: 'HUA_NAN',
        label: '华南'
      }, {
        value: 'BEI_MEI',
        label: '北美'
      }, {
        value: 'XIN_JIA_PO',
        label: '新加坡'
      }],
      value: [],
      dataRule: {
        accessKey: [
          { required: true, message: '七牛云accessKey不能为空', trigger: 'blur' }
        ],
        secretKey: [
          { required: true, message: '七牛云secretKey不能为空', trigger: 'blur' }
        ],
        bucket: [
          { required: true, message: '七牛云bucket不能为空', trigger: 'blur' }
        ],
        resourcesUrl: [
          { required: true, message: '七牛云resourcesUrl不能为空', trigger: 'blur' }
        ],
        zone: [
          { required: true, message: '七牛云zone的选择不能为空', trigger: 'blur' }
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
          url: this.$http.adornUrl('/sys/pconfig/info/' + 'QINIU_CONFIG'),
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
      console.log(this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/pconfig/save'),
            method: 'post',
            data: this.$http.adornData({
              'paramKey': 'QINIU_CONFIG',
              'paramValue': JSON.stringify(this.dataForm),
              'remark': '七牛云配置参数'
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
     * dataform -> qiniu
     */
    // getQiniuParam () {
    //   this.qiniu.accessKey = this.dataForm.accessKey
    //   this.qiniu.secretKey = this.dataForm.secretKey
    //   this.qiniu.bucket = this.dataForm.bucket
    //   this.qiniu.resourcesUrl = this.dataForm.resourcesUrl
    //   this.qiniu.zone = this.dataForm.zone
    // },
    // /**
    //  *  qiniu -> dataform
    //  */
    // getDataParam (data) {
    //   this.dataForm.id = data.id
    //   this.dataForm.paramKey = data.paramKey
    //   this.dataForm.paramValue = data.paramValue
    //   this.dataForm.accessKey = this.qiniu.accessKey
    //   this.dataForm.secretKey = this.qiniu.secretKey
    //   this.dataForm.bucket = this.qiniu.bucket
    //   this.dataForm.resourcesUrl = this.qiniu.resourcesUrl
    //   this.dataForm.zone = this.qiniu.zone
    // }
  }
}
</script>
