<template>
  <div class="distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">积分说明设置</div>
    <el-form
      ref="dataForm"
      label-width="80px"
      size="mini"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
    >
      <el-form-item label="积分说明" prop="content">
        <!-- <tiny-mce v-model="dataForm.paramValue"
        style="width:900px"></tiny-mce>-->
        <el-input
          type="textarea"
          style="width:600px"
          autosize
          v-model="dataForm.paramValue"
          witdt="230"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="dataFormSubmit()">保存</el-button>
  </div>
</template>

<script>
import TinyMce from '@/components/tiny-mce'

export default {
  components: {
    TinyMce
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取数据
    getData () {
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl('/user/scoreExplainConfig/info/' + 'SCORE_EXPLAIN'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data !== null) {
            this.dataForm = data
          }
        })
        this.$refs['dataForm'].resetFields()
      })
    },
    // 设置数据
    setDate (data) {
      this.dataForm = data
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let param = this.dataForm
          this.$http({
            url: this.$http.adornUrl(`/user/scoreExplainConfig/`),
            method: this.dataForm.id ? 'put' : 'post',
            data: this.$http.adornData(param)
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          }).catch(() => {

          })
        }
      })
    }
  },
  data () {
    return {
      addOrUpdateVisible: false,
      dataForm: {
        'paramValue': ''
      },
      dataRule: {
        paramValue: [
          { required: true, message: '请输入内容', trigger: 'brue' }
        ]
      }
    }
  }
}
</script>
<style lang="scss">
.distribution-withdraw-cash-set {
  .input-tips {
    font-size: 12px;
  }
}
</style>
