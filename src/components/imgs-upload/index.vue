<template>
  <div class="mul-pic-upload">
    <vue-draggable
      v-model="imageList"
      @start="onDragStart"
      @end="onDragEnd"
      class="el-upload-list el-upload-list--picture-card"
    >
      <!--拷贝上传图片组件生成的预览图元素代码，用绑定的model循环生成可拖拽元素-->
      <li
        v-for="(item,index) in imageList"
        :key="index"
        tabindex="0"
        class="el-upload-list__item is-success"
      >
        <img :src="item.url" alt class="el-upload-list__item-thumbnail" />
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-check"></i>
        </label>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview">
            <i class="el-icon-zoom-in" @click="handlePictureCardPreview(item.url)"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(index)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </li>
      <li class="el-upload-list__item" @click="elxImgboxHandle">
        <div tabindex="0" class="el-upload el-upload--picture-card">
          <i class="el-icon-plus"></i>
        </div>
        <!-- 弹窗, 新增图片 -->
        <elx-imgbox v-if="elxImgboxVisible" ref="elxImgbox" @refreshPic="refreshPic"></elx-imgbox>
      </li>
    </vue-draggable>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import VueDraggable from 'vuedraggable'
import ElxImgbox from '@/components/elx-imgbox'
export default {
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      elxImgboxVisible: false,
      resourcesUrl: window.SITE_CONFIG.resourcesUrl,
      imageList: []
    }
  },
  components: {
    VueDraggable,
    ElxImgbox
  },
  props: {
    value: {
      default: '',
      type: String
    },
    // 最大上传数量
    limit: {
      default: 6,
      type: Number
    },
    // false: 能对图片进行操作  true: 不能对图片进行操作
    disabled: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    value: function (newVal, oldVal) {
      let res = []
      if (this.value) {
        let imageArray = this.value.split(',')
        for (let i = 0; i < imageArray.length; i++) {
          res.push({ url: this.resourcesUrl + imageArray[i], response: imageArray[i] })
        }
      }
      this.imageList = res
    },
    imageList: function (newVal, oldVal) {
      let pics = this.imageList.map(file => {
        return file.response
      }).join(',')
      this.$emit('input', pics)
    }
  },
  methods: {
    /**
     * 删除图片
     */
    handleRemove (index) {
      this.imageList.splice(index, 1)
      let pics = this.imageList.map(file => {
        return file.response
      }).join(',')
      this.$emit('input', pics)
    },
    /**
     * 放大图片
     */
    handlePictureCardPreview (imgUrl) {
      this.dialogImageUrl = imgUrl
      this.dialogVisible = true
    },
    onDragStart (e) {
      e.target.classList.add('hideShadow')
    },
    onDragEnd (e) {
      e.target.classList.remove('hideShadow')
    },
    /**
     * 打开图片选择窗
     */
    elxImgboxHandle () {
      let num = this.limit - this.imageList.length
      if (num < 1) {
        this.$message.error('可选择照片数量已达上限')
        return
      }
      this.elxImgboxVisible = true
      this.$nextTick(() => {
        this.$refs.elxImgbox.init(0, num)
      })
    },
    /**
     * 接收回调的图片数据
     */
    refreshPic (imagePath) {
      let imageArray = imagePath.split(',')
      let pics = imageArray.map(img => {
        return img
      }).join(',')
      if (this.value) {
        let picArray = imagePath.split(',')
        console.log(picArray.length, this.value, !this.value)
        pics = this.value + ',' + pics
      }
      this.$emit('input', pics)
    }
  }
}
</script>

<style lang="scss" scope>
.mul-pic-upload {
  .upload-component {
    display: inline;
  }

  .el-upload--picture-card {
    border: 0;
  }
  .hideShadow {
    .el-upload-list__item-actions {
      display: none;
    }
  }
}
</style>
