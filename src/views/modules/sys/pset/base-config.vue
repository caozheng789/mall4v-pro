<template>
  <div class="mod-pay">
    <domain ref="domain" />
    <quickbird ref="quickbird" />
    <sms ref="sms" />
  </div>
</template> 
<script>
import quickbird from './quickbird-config.vue'
import sms from './sms-config.vue'
import domain from './domain-config.vue'
export default {
  data () {
    return {
    }
  },
  methods: {

  },
  components: {
    quickbird,
    sms,
    domain
  }
}
</script>
<style lang="scss">
</style>

