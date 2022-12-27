<template>
  <div class="main-login receipt-page">
    <div>
      <div class="login login-width login-mobile">
        <el-page-header class="header-receipt" content="" @back="goBack">
        </el-page-header>
        <el-empty v-if="!receipt" description="Không có dữ liệu"></el-empty>
        <div v-else>
          <div class="main-content">
            <div class="title-receipt">
              <div class="text-center text-bold">{{ receipt.receiptName }}</div>
              <div class="time">{{ receipt.date }}</div>
            </div>
            <div class="event-item">
              <el-timeline>
                <div class="event-title d-flex justify-between items-center cursor-pointer"  @click="handleRouter('event/detail/' + item.eventId)">
                  <div class="d-flex items-center event-name">
                    <el-badge :value="12" class="item" type="primary">
                      <ShowAvatarElement :event="{ name: receipt.cashier.name, color: receipt.color }"></ShowAvatarElement>
                    </el-badge>
                    <div class="event-content">
<!--                      <h4 class="title text-bold">{{ receipt.cashier.name }}</h4>-->
                    </div>
                  </div>
                  <div class="d-flex items-center ">
                    <span class="text-bold" :class="receipt.totalAmount >= 0 ? 'text-green' : 'text-red'">{{receipt.totalAmount}}</span>
                    <i class="el-icon event-navi el-icon-arrow-right"></i>
                  </div>
                </div>
<!--                <el-timeline-item v-for="(user, key) in listEvent.userDepts" :key="key" placement="top">-->
<!--                  <el-card>-->
<!--                    <span class="text-normal-sm">{{ user.name }}</span>-->
<!--                    <span class="text-normal-sm">{{ $t('event.owe_you')}} </span><span :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmount}}</span>-->
<!--                    <span class="text-normal-sm">{{ $t('currency.currency')}} </span>-->
<!--                  </el-card>-->
<!--                </el-timeline-item>-->
                <el-divider class="divider"></el-divider>
              </el-timeline>
              <div>
                <!--              <img class="status-img" src="~/assets/images/icons/circle-red.svg" alt="status">-->
                <!--              <img src="~/assets/images/icons/dots.svg" alt="status">-->
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { RECEIPT_DETAIL, INDEX_SET_LOADING } from '~/store/store.const'

export default {
  name: 'ReceiptPage',
  middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  data() {
    return {
      id: this.$route.params.id,
      eventId: this.$route.query.eventId,
      search: '',
      listEvent: {},
      receipt: {},
      ListId: []
    }
  },
  watch: {
    listEvent(newValue, oldValue) {
      this.receipt = this.listEvent
    }
  },
  created() {
    this.getListEvent()
  },
  mounted() {
  },
  methods: {
    errorHandler() {
      return true
    },
    async getListEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(RECEIPT_DETAIL, this.id)
        if (response.statusCode === 202) {
          this.listEvent = response.data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    handleRouter(route) {
      this.$router.push(route)
    },
    goBack() {
      this.handleRouter('/event/list-receipt/' + this.eventId)
    }
  }
}
</script>
