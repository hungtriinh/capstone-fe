<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <h3 class="title text-center text-[#011A51] font-semibold">Sự kiện</h3>

        <div class="search-box d-flex items-center gap-10" >
          <el-form
            ref="accountForm"
            style="width: 100%"
            :model="accountForm"
            autocomplete="off"
            label-position="left"
            @submit.native.prevent
          >
            <el-input
              v-model="accountForm.search"
              placeholder="Tìm kiếm sự kiện"
              @input="searchFr">
              prefix-icon="el-icon-search">
            </el-input>
          </el-form>
          <img src="~/assets/images/icons/qr-scan.svg" alt="" @click="handleRouter('/qr-scan')">
        </div>

        <div class="main-content-event">
          <el-empty v-if="!listEvent.length" description="Bạn chưa tham gia sự kiện nào."></el-empty>
          <div v-else>
            <el-card v-for="(item,key) in listEvent" :key="key"  :body-style="{ padding: '0px' }" class="card-item mb-10 event" >
              <div class="event-item">
                <el-timeline>
                  <div class="event-title d-flex justify-between items-center cursor-pointer"  @click="handleRouter('event/detail/' + item.eventId)">
                    <div class="d-flex items-center event-name">
                      <el-badge is-dot class="event-status item" :type="item.eventStatus === 0 ?  'danger' : 'success'">
                        <ShowAvatarElement :event="{ name: item.eventName, color: item.color }"></ShowAvatarElement>
                      </el-badge>
                      <div class="event-content ">
                        <h4 class="text-elipsis title text-bold">{{ item.eventName }}</h4>
                      </div>
                      <i style="margin-left: -5px" class="el-icon event-navi el-icon-arrow-right"></i>

                    </div>
                    <div class="d-flex items-center ">
                      <span class="text-bold" >{{item.receiptCount}} </span>
                      <i style="margin-left: 3px" class=" el-icon-document"></i>
                    </div>
                  </div>
                  <el-timeline-item class="event-timeline" v-if="item.debt.totalPeople !== 0" placement="top">
                    <el-card>
                      <span class="text-normal-sm">Bạn nợ {{ item.debt.totalPeople }} người khác</span>
                      <span class="text-red"> {{ item.debt.money.amountFormat }}</span>
                    </el-card>
                  </el-timeline-item>
                  <el-timeline-item class="event-timeline" v-if="item.receive.totalPeople !== 0" placement="top">
                    <el-card>
                      <span class="text-normal-sm">{{ item.receive.totalPeople }} người khác nợ bạn </span>
                      <span class="text-green"> {{ item.receive.money.amountFormat }}</span>
                    </el-card>
                  </el-timeline-item>
                  <el-timeline-item v-if="item.receive.totalPeople !== 0 || item.debt.totalPeople !== 0" class="event-timeline"><br></el-timeline-item>
                </el-timeline>
                <div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { GET_EVENT_LIST, INDEX_SET_LOADING, EVENT_SEARCH, INDEX_SET_ERROR } from '~/store/store.const'

export default {
  name: 'MainPage',
  middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  data() {
    return {
      accountForm: {
        search: ''
      },
      listEvent: []
    }
  },
  created() {
    this.getListEvent()
  },
  mounted() {
  },
  methods: {
    async getListEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_EVENT_LIST)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async searchEvent() {
      if (this.accountForm.search === '' || this.accountForm.search.trim() === '') {
        this.getListEvent()
      } else {
        this.$store.commit(INDEX_SET_LOADING, true)
        try {
          const response = await this.$store.dispatch(EVENT_SEARCH, this.accountForm.search)
          const { data, statusCode } = response
          if (statusCode === 202) {
            this.listEvent = data
          } else {
            await this.$store.commit(INDEX_SET_ERROR, {
              show: true,
              text: response.message
            })
          }
        } catch (e) {
          this.$store.commit(INDEX_SET_LOADING, false)
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: 'Có lỗi xảy ra'
          })
        }
        this.$store.commit(INDEX_SET_LOADING, false)
      }
    },
    searchFr: _.debounce(function(e) {
      this.searchEvent()
    }, 1000),
    handleRouter(router) {
      this.$router.push(router)
    }
  }
}
</script>
