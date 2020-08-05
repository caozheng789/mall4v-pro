<template>
  <el-dialog
    :title="!dataForm.userLevelCategoryId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="权益名称" prop="rightsName">
        <el-input
          v-model="dataForm.rightsName"
          placeholder="请输入内容，长度不超过五个字符"
          maxlength="5"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="权益图标" prop="icon">
        <img-upload v-model="dataForm.icon"></img-upload>
      </el-form-item>
      <el-form-item label="权益简介" prop="description">
        <el-input
          v-model="dataForm.description"
          type="textarea"
          :autosize="{ minRows: 2}"
          maxlength="250"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="顺序" prop="seq">
        <el-input v-model="dataForm.seq" placeholder="请输入整数" min="1" type="number" precision="0"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
export default {
  components: {
    ImgUpload
  },
  data () {
    return {
      visible: false,
      dataForm: {
        rightsId: null,
        rightsName: null,
        icon: null,
        description: null,
        seq: 1
      },
      isSubmit: false,
      dataRule: {
        rightsName: [
          { required: true, message: '权益名称不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '权益图标不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '权益简介不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (rightsId) {
      this.dataForm.rightsId = rightsId || 0
      this.visible = true
      this.isSubmit = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.rightsId) {
          this.$http({
            url: this.$http.adornUrl('/user/userRights/info/' + this.dataForm.rightsId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        } else {
          // 获取最大的序号
          this.$http({
            url: this.$http.adornUrl('/user/userRights/getMaxSeq'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm.seq = data
          })
        }
      })
    },
    /**
     * 表单提交
     */
    dataFormSubmit () {
      console.log('dataF', this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/user/userRights'),
            method: this.dataForm.rightsId ? 'put' : 'post',
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
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    }
  }
}
</script>
