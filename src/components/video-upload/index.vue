<template>
  <div>
    <!-- <el-upload
      class="pic-uploader-component"
      :disabled="disabled"
      :action="$http.adornUrl('/admin/file/upload/element')"
      :headers="{Authorization: $cookie.get('Authorization_vp')}"
      :show-file-list="false"
      :on-success="handleUploadSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="value" :src="resourcesUrl + value" class="pic" />
      <i v-else class="el-icon-plus pic-uploader-icon"></i>
    </el-upload>-->
    <el-upload
      :action="$http.adornUrl('/admin/file/upload/element')"
      class="pic-uploader-component"
      :disabled="disabled"
      :headers="{Authorization: $cookie.get('Authorization')}"
      :on-progress="uploadVideoProcess"
      :on-success="handleVideoSuccess"
      :before-upload="beforeUploadVideo"
      :show-file-list="false"
    >
      <video
        class="el-upload-video"
        v-if="value  && !videoFlag"
        :src="resourcesUrl + value"
        controls="controls"
      >您的浏览器不支持视频播放</video>
      <i v-else-if=" !value && !videoFlag" class="el-icon-plus pic-uploader-icon"></i>
      <el-progress
        v-if="videoFlag == true"
        type="circle"
        v-bind:percentage="videoUploadPercent"
        style="margin-top:7px;"
      ></el-progress>
    </el-upload>
    <el-button
      v-if="value !='' && value !=null && !videoFlag"
      type="danger"
      size="mini"
      icon="el-icon-search"
      @click="deleteVideo()"
    >删除视频</el-button>
    <span v-else>视频大小不能超过20MB</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      // 是否显示进度条
      videoFlag: false,
      // 进度条的进度，
      videoUploadPercent: '',
      // 显示上传按钮
      isShowUploadVideo: true
    }
  },
  props: {
    value: {
      default: '',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    // 上传前回调
    beforeUploadVideo (file) {
      var fileSize = file.size / 1024 / 1024 < 20
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) === -1) {
        // layer.msg('请上传正确的视频格式')
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!fileSize) {
        // layer.msg('视频大小不能超过50MB')
        this.$message.error('视频大小不能超过20MB!')
        return false
      }
      this.isShowUploadVideo = false
    },
    // 进度条
    uploadVideoProcess (event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = file.percentage.toFixed(0) * 1
    },
    // 进度条
    deleteVideo () {
      this.$emit('input', '')
    },
    // 上传成功回调
    handleVideoSuccess (res, file) {
      this.$emit('input', file.response)
      // this.value = file.response
      this.isShowUploadVideo = true
      this.videoFlag = false
      this.videoUploadPercent = 0

      // 前台上传地址
      // if (file.status == 'success' ) {
      //    this.videoForm.showVideoPath = file.url;
      // } else {
      //      layer.msg("上传失败，请重新上传");
      // }

      // 后台上传地址
      // if (res.Code === 0) {
      //   this.videoForm.showVideoPath = res.Data
      // } else {
      //   layer.msg(res.Message)
      // }
    }
  }
}
</script>

<style lang="scss">
.pic-uploader-component .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .pic-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .pic {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.pic-uploader-component .el-upload:hover {
  border-color: #409eff;
}
.el-upload-video {
  width: 400px;
}
</style>
