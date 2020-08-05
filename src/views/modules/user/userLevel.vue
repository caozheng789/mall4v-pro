<template>
  <div class="mod-marketing-distribution">
    <el-tabs>
      <el-tab-pane label="普通会员设置">
        <ordinary />
      </el-tab-pane>
      <el-tab-pane label="付费会员设置">
        <vip />
      </el-tab-pane>
    </el-tabs>

  </div>
</template> 
<script>
import ordinary from './userLevel-ordinary.vue'
import vip from './userLevel-vip.vue'

export default {
  data () {
    return {
    }
  },
  methods: {

  },
  components: {
    ordinary,
    vip
  }
}
</script>