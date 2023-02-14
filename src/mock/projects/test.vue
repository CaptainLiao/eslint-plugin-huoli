<template>
  <div class="test-container">
    <div class="page" @click="go(1)">回到订单列表</div>
    <div class="page" @click="go(2)">回到订单详情</div>
    <div class="page" @click="go(3)">哪儿来回哪儿去</div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue'
import env from '@/utils/env'
import nativeApi from '@/utils/nativeApi'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const route = useRoute()
    const orderId = ref()
    const go = (index) => {
      switch (index) {
        case 1:
          if (env.isNative) {
            window.location.href = `weixinhbgj://start?type=ticketorderslist`
          } else {
            let analyseSourceEntry = env.analyseSourceEntry || 'h5'
            window.location.replace(
              `${process.env.VUE_APP_BASE_URL_HANGBANH5}/vue/jipiao/order/list?analyseSourceEntry=${analyseSourceEntry}`,
            )
          }
          break
        case 2:
          if (env.isNative) {
            window.location.href = `weixinhbgj://start?type=ticketorderdetail&orderid=${orderId.value}&servicetype=domestic`
          } else {
            window.location.replace(
              `${process.env.VUE_APP_BASE_URL_HANGBANH5}/vue/jipiao/order/domestic/new/detail?hlsource=hbgj&orderid=${orderId.value}`,
            )
          }
          break
        case 3:
          if (env.isNative) {
            nativeApi.invoke('back')
          } else {
            history.go(-2)
          }
          break
      }
    }
    onMounted(() => {
      const { orderid } = route.query
      orderId.value = orderid
    })
    return {
      orderId,
      go,
    }
  },
})
</script>
<style lang="scss" scoped>
.test-container {
  padding: 15px;
  box-sizing: border-box;

  .page {
    margin-bottom: 25px;
    height: 35px;
    background-color: #eee;
  }
}
</style>
