<template>
  <div class="elx-imgbox">
    <el-dialog
      title="图片管理器"
      :visible.sync="visible"
      class="elx-imgbox-dialog"
      top="5vh"
      :append-to-body="visible"
    >
      <el-tabs v-model="options.activeTab" tab-position="left">
        <el-tab-pane label="选择图片" name="pick" class="pick-block">
          <div class="elx-img-list-loading" v-if="isLoading">
            <div class="el-icon-loading"></div>
          </div>
          <el-form :inline="true" :model="dataForm" class="demo-form-inline form">
            <el-form-item>
              <el-input v-model="fileName" size="medium" placeholder="图片名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchImg" icon="el-icon-search" size="medium">查询</el-button>
            </el-form-item>
          </el-form>
          <div class="elx-main elx-img-list">
            <div class="img-item" v-for="(img, itemIndex) in imgRes.records" :key="itemIndex">
              <div class="thumb-wp" @click="onClickListImage(img)">
                <img :src="resourcesUrl + img.filePath" alt="img.name" />
              </div>
              <div class="title" @click="onClickListImage(img)">{{img.fileName}}</div>
              <div class="operate">
                <el-link type="info" class="edit" @click="changeName(img)">修改</el-link>
                <el-link type="danger" class="del" @click="delectImg(img.fileId)">删除</el-link>
              </div>
              <!-- <div class="label" v-if="img.label">{{img.label}}</div> -->
              <span class="selected" v-if="img.selected" @click="onClickListImage(img)">
                <span class="icon el-icon-check"></span>
              </span>
            </div>
          </div>

          <el-pagination
            layout="total, prev, pager, next"
            :current-page="imgRes.current"
            :page-size="imgRes.size"
            :total="imgRes.total"
            @current-change="onPageNumChange"
          ></el-pagination>

          <div class="elx-foot">
            <el-badge :value="images.length" class="item" v-if="!type">
              <el-button
                type="primary"
                size="medium"
                :disabled="images.length == 0"
                @click="onConfirm"
              >确定</el-button>
            </el-badge>
            <el-button
              type="primary"
              size="medium"
              :disabled="disabled"
              @click="onConfirm"
              v-else
            >确定</el-button>
            <el-button
              type="primary"
              size="medium"
              @click="options.activeTab='upload'"
              plain
              v-if="options.enableUpload"
            >上传图片</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="上传图片" name="upload" class="upload-block" v-if="options.enableUpload">
          <div class="elx-main">
            <div class="upload-title">请选择本地图片上传：</div>
            <el-upload
              ref="upload"
              class="upload-img-preview"
              list-type="picture-card"
              accept="image/*"
              :action="$http.adornUrl('/admin/file/upload/img')"
              :headers="{Authorization: $cookie.get('Authorization')}"
              :auto-upload="false"
              :multiple="true"
              :limit="uploadNumberLimit()"
              :before-upload="beforeUpload"
              :on-change="onUploadChange"
              :on-progress="onUploadProgress"
              :on-success="onUploadSuccess"
              :on-error="onUploadError"
              :on-exceed="onUploadExceedTip"
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <div class="upload-tip">{{ uploadTips() }}</div>

            <div class="elx-foot">
              <el-button type="primary" size="medium" @click="onUploadConfirm">确定上传</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 修改物流弹窗 -->
    <el-dialog
      title="修改图片名称"
      :close-on-click-modal="false"
      :visible.sync="changeNameVisible"
      top="200px"
      :append-to-body="visible"
      width="600px"
    >
      <el-form :model="imageObject" ref="imgDataForm" label-width="80px" v-if="changeNameVisible">
        <el-form-item label="原名称">
          <span>{{imageObject.fileName}}</span>
        </el-form-item>
        <el-form-item label="修改名称">
          <el-input placeholder="请输入新的图片名称" v-model="newImgName" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeNameVisible = false">取消</el-button>
        <el-button @click="submitImgName()">确定</el-button>
      </span>
    </el-dialog>
    <!-- /修改物流弹窗 -->
  </div>
</template>

<script type="text/babel">
export default {
  name: 'ElxImgbox',
  data () {
    return {
      images: [], // 已选图片
      dataForm: null,
      options: {
        multiple: true, // 是否支持选取多个图片
        limit: 20, // 最多可选择图片数量
        maxSize: 2, // 最大尺寸（M）
        activeTab: 'pick',
        enableUpload: true, // 是否启用图片上传
        callback: null
      },
      newImgName: '',
      isTrue: true,
      imageObject: null,
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      type: 2,
      fileName: '',
      listType: 'picture',
      isLoading: true,
      changeNameVisible: false,
      visible: false,
      disabled: false,
      notImg: false,
      uploadSuccessCount: 0,
      imgRes: {
        current: 1
      }
    }
  },

  methods: {
    /**
     * 初始化
     * type 1：单图  2：多图
     */
    init (type, limit) {
      this.visible = true
      this.isLoading = false
      this.images = []
      this.type = type
      if (type === 1) {
        this.type = true
        this.disabled = true
      } else {
        this.limit = limit
        this.type = false
      }
      if (this.$refs.upload) {
        this.$refs.upload.uploadFiles = []
      }
      // 获取产品数据 - 第一页的数据
      this.loadListImage(1)
    },
    show () {
      this.visible = true
    },

    hide () {
      this.visible = false
    },

    onConfirm () {
      if (this.type) {
        this.$emit('refreshPic', this.images[0].filePath)
      } else {
        let imgPaths = this.images.map(file => {
          return file.filePath
        }).join(',')
        this.$emit('refreshPic', imgPaths)
      }
      this.visible = false
    },
    /**
         * 提交修改后的图片名称
         */
    submitImgName () {
      if (!this.isTrue) {
        return false
      }
      this.isTrue = false
      console.log('this.newImgName', this.newImgName)
      this.$http({
        url: this.$http.adornUrl('/admin/file/updateFileName'),
        method: 'put',
        data: this.$http.adornData({
          fileId: this.imageObject.fileId,
          fileName: this.newImgName
        })
      }).then(({ data }) => {
        this.newImgName = ''
        this.isTrue = true
        this.changeNameVisible = false
        this.loadListImage(this.imgRes.current)
      }).catch(({ e }) => {
        this.isTrue = true
      })
    },
    /**
     * 修改图片名称
     */
    changeName (img) {
      this.newImgName = ''
      this.imageObject = img
      this.isTrue = true
      this.changeNameVisible = true
    },
    /**
     * 删除图片
     */
    delectImg (fileId) {
      this.$confirm(`确定进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/file/deleteFile/' + fileId),
          method: 'delete'
        }).then(({ data }) => {
          console.log('asdfasdf')
          this.images = []
          this.loadListImage(this.imgRes.current)
        })
      })
    },
    /**
     * 点击图片时选中或取消选中图片
     * @param img object
     */
    onClickListImage (img) {
      // 单选图片
      if (this.type) {
        this.clearListSelected()
        this.images = []
        this.disabled = false
      } else {
        // 多选图片-如果已选中则取消选中
        var imgIndex = this.selectedImageIndex(img)
        if (imgIndex >= 0) {
          // 取消图片已选状态
          img.selected = false
          this.images.splice(imgIndex, 1)
          return
        }
        if (!this.type && this.images.length >= this.limit) {
          this.message('可选择照片数量已达上限')
          return false
        }
      }
      this.images.push(JSON.parse(JSON.stringify(img)))
      img.selected = true
    },
    /**
     * 清除所有已点击图片样式
     */
    clearListSelected () {
      if (this.type) {
        let list = this.imgRes.records
        list.forEach(element => {
          element.selected = false
        })
      }
    },
    /**
         * 按图片名称搜索图片
         */
    searchImg () {
      this.loadListImage(1)
    },
    /**
     * 加载图片列表数据
     * @param page
     */
    loadListImage (current) {
      this.isLoading = true
      this.$http({
        url: this.$http.adornUrl('/admin/file/attachFilePage'),
        method: 'get',
        params: this.$http.adornParams({
          current: current,
          size: 15,
          fileName: this.fileName ? this.fileName : null
        })
      }).then(({ data }) => {
        this.imgRes = data
        this.isLoading = false
      })
    },

    /**
     * 图片已选则返回下标，未选则返回-1
     */
    selectedImageIndex (img) {
      for (let i = 0; i < this.images.length; i++) {
        var selectedImg = this.images[i]
        if (selectedImg.fileId === img.fileId) {
          return i
        }
      }
      return -1
    },

    /**
     * 分页页面变化时刷新数据
     * @param page
     */
    onPageNumChange (page) {
      this.loadListImage(page)
    },

    /**
     * 提交上传图片
     */
    onUploadConfirm () {
      this.notImg = true
      this.images = []
      this.$refs.upload.submit()
    },

    onUploadProgress (event, file, fileList) {

    },

    onUploadChange (file, fileList) {
    },

    /**
     * 上传图片前检查合法性
     * @param file
     * @returns {boolean}
     */
    beforeUpload (file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isPNG = file.type === 'image/png'
      // const isGif = file.type === 'image/gif'

      // if (!isJPG && !isPNG && !isGif) {
      //   this.message.error(this.uploadTypeTip())
      //   return false
      // }
      let typeArray = file.type.split('/')
      if (typeArray[0] !== 'image') {
        if (this.notImg) {
          this.message('只能上传图片,其他文件已清除', true)
          this.notImg = false
        }
        return false
      }
      const isSize = file.size / (1024 * 1024) < 2
      if (!isSize) {
        this.message(this.uploadSizeTip())
        return false
      }

      return true
    },

    uploadNumberLimit () {
      if (!this.options.multiple) {
        return 1
      }

      return this.options.limit - this.images.length
    },

    uploadTypeTip () {
      return '仅支持 jpg/png/gif 图片'
    },

    uploadSizeTip () {
      return '大小不能超过2M'
    },

    uploadTips () {
      let tips = [this.uploadTypeTip(), this.uploadSizeTip()]

      if (!this.options.multiple) {
        return tips.join('，')
      }

      if (this.images.length > 0) {
        tips.push('已有' + this.images.length + '张图片')
      }

      const uploadFileNum = this.$refs.upload ? this.$refs.upload.uploadFiles.length : 0
      if (uploadFileNum > 0) {
        tips.push('即将上传' + uploadFileNum + '张图片')
      }

      tips.push('还可以选择' + (this.options.limit - this.images.length - uploadFileNum) + '张图片上传')

      return tips.join('，')
    },

    /**
     * 上传错误处理
     * @param err
     * @param file
     * @param fileList
     */
    onUploadError (err, file, fileList) {
      this.message('服务器打了个盹^_^', true)
      // console.log(err)
      throw err
    },

    /**
     * 上传成功处理
     * @param response
     * @param file
     * @param fileList
     * @returns {boolean}
     */
    onUploadSuccess (response, file, fileList) {
      this.disabled = true
      this.$refs.upload.uploadFiles = []
      this.loadListImage(1)
    },

    /**
     * 选择上传文件超过限制文件个数提示
     */
    onUploadExceedTip () {
      this.message('当前最多只能选择' + this.uploadNumberLimit() + '张图片上传')
    },
    message (msg, isInfo) {
      var type = 'error'
      if (isInfo) {
        type = 'info'
      }
      this.$message({
        message: msg,
        type: type,
        duration: 1500
      })
    }
  },

  mounted () {
    this.loadListImage()
  },

  computed: {

  }
}
</script>

<style lang="scss">
.elx-images {
  .el-upload-list__item,
  .el-upload--picture-card {
    width: 78px;
    height: 78px;
    line-height: 82px;
    border-radius: 5px;
  }
}

.elx-imgbox-dialog {
  $bg: #f6f6f6;
  top: 100px;

  .el-badge {
    vertical-align: bottom;
  }

  .el-dialog {
    width: 720px;

    .el-dialog__header {
      border-bottom: 1px solid #e8e8e8;
    }

    .el-dialog__body {
      padding: 0;
      background: $bg;
    }
  }

  .el-tabs {
    .el-tabs__header {
      margin-right: 0;
      margin-top: 5px;
      .el-tabs__nav-wrap::after {
        background: $bg;
      }
    }
    .el-tabs__item.is-active {
      background: #fff;
    }
    .el-tabs--left .el-tabs__nav-wrap {
      padding-top: 15px;
    }

    .el-tabs__content {
      height: 740px;
      // 弹窗高度
      background: #fff;
    }
  }

  .elx-foot {
    padding: 15px 0 0 10px;
    .el-button {
      margin: 0 0 0 10px;
    }
  }

  .pick-block {
    position: relative;

    .elx-img-list-loading {
      position: absolute;
      top: 60px;
      z-index: 9;
      left: 0;
      right: 0;
      width: 100%;
      height: 520px;
      // 加载层高度
      background: #fff;
      text-align: center;

      .el-icon-loading {
        font-size: 50px;
        color: #409eff;
        line-height: 460px;
      }
    }

    .elx-img-list {
      padding: 10px;
      height: 530px;
      // 图片列表高度

      .img-item {
        $imgSize: 100px;
        $size: 104px;
        float: left;
        margin: 10px;
        width: $imgSize;
        cursor: pointer;
        position: relative;
        font-size: 12px;

        img {
          width: $imgSize;
          height: $imgSize;
          display: block;
        }

        .title {
          line-height: 24px;
          height: 24px;
          display: block;
          overflow: hidden;
          background: $bg;
          padding: 0 5px;
        }

        .title {
          line-height: 24px;
          height: 24px;
          display: block;
          overflow: hidden;
          background: $bg;
          padding: 0 5px;
        }
        .operate {
          line-height: 24px;
          height: 24px;
          display: block;
          overflow: hidden;
          // background: $bg;
          margin-top: 2px;
          padding: 0 5px;
          .edit {
            float: left;
            padding-left: 5px;
          }
          .del {
            float: right;
            padding-right: 5px;
          }
        }

        .label {
          position: absolute;
          z-index: 9;
          left: 0;
          bottom: 24px;
          width: 100%;
          height: 21px;
          line-height: 21px;
          text-align: center;
          color: #fff;

          &:after {
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 21px;
            background: #000;
            opacity: 0.3;
            z-index: -1;
          }
        }

        .selected {
          position: absolute;
          right: -3px;
          top: -3px;
          width: $size;
          height: 130px;
          border: 3px solid #409eff;
          border-radius: 3px;
          text-align: right;
          .icon {
            background: #409eff;
            text-align: center;
            height: 24px;
            width: 24px;
            line-height: 24px;
            display: inline-block;
            font-size: 16px;
            color: #fff;
            border-radius: 0 0 0 3px;
            position: absolute;
            right: 0;
            top: 0;
          }
        }
      }

      &::after {
        content: " ";
        display: table;
        height: 0;
        clear: both;
        visibility: hidden;
      }
    }

    .el-pagination {
      background: #f9f9f9;
      position: relative;
      padding: 5px;
      margin: 0 24px 0 20px;
      text-align: right;
      float: none;

      * {
        background: none;
      }
    }
  }

  .upload-block {
    .upload-img-preview {
      padding: 20px;

      /* 上传图片预览改为使用背景图片按比例缩放方式 */
      .el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item,
      .el-upload-list--picture-card .el-upload-list__item .wp {
        width: 90px;
        height: 90px;
        line-height: 98px;
        background-size: cover;
        background-position: 50% 50%;
      }

      .el-upload-list--picture-card .el-upload-list__item-status-label i {
        margin-top: 12px;
        vertical-align: top;
      }
    }

    .upload-tip {
      padding: 0 20px;
      font-size: 13px;
      color: #999;
    }

    .upload-title {
      font-size: 16px;
      color: #666;
      padding: 20px 0 0 20px;
    }
  }
}

.form {
  padding: 15px 0px 0px 20px;
}

.el-upload-list__item-actions {
  a {
    i {
      color: #fff;
    }
  }
}
</style>
