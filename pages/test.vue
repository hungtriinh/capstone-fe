<template>
  <div class="main-login list-receipt-page">
    <div>
      <div class="login login-width login-mobile">
          <el-page-header content="Danh sách chứng từ" @back="goBack">
          </el-page-header>

        <el-empty v-if="!listEvent.length" description="Không có dữ liệu"></el-empty>
        <div v-else>
          <div class="main-content">
            <el-card v-for="(item, key) in listEvent" :key="key" shadow="hover" :body-style="{ padding: '10px' }" class="card-item">
              <div class="d-flex justify-between">
                <div class="list-image d-flex gap-10">
                  <img v-for="(img, key) in item.image" :key="key" :src="img" class="image">
                </div>
                <span class="text-bold money">{{ item.money }}</span>
              </div>
              <div style="padding-bottom: 12px;">
                <div class="d-flex items-center mt-10 gap-10">
                  <ShowAvatarElement :event="{ name: item.name, color: item.color }"></ShowAvatarElement>
                  <span>
                {{ item.name }}
              </span>
                </div>
                <div class="bottom">
                  <div>
                    <time class="time">{{ item.date }}</time>
                    <br>
                    <span class="text-bold">{{ item.event }}</span>
                  </div>
                  <el-tag :type="item.status === 'dong y' ? 'success' : 'danger' ">{{ item.status }}</el-tag>
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
// import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
// import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
// import { validPhoneNoPrefix } from '@/utils/validate'
import { REQUEST_APPROVE, GET_REQUEST_WAITING, INDEX_SET_LOADING, INDEX_SET_SUCCESS } from '~/store/store.const'

export default {
  name: 'RequestPage',
  // middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  data() {
    return {
      id: this.$route.params.id,
      search: '',
      listEvent: [
        { money: '100000 VND', date: '6/10/2022', name: 'tha van tha', total: 450, event: 'Chi tiết coffee', image: ['https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
        ], status: 'từ choi' },
        { date: '6/10/2022', name: 'tha van t', total: 450, event: 'uong dieu', image: ['https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png', 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'], status: 'dong y' },
        { date: '6/10/2022', name: 'tha vang tha', total: 450, event: 'ok', image: '', status: 'dong y' }
      ],
      ListId: []
    }
  },
  watch: {
    listEvent(newValue, oldValue) {
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
        const response = await this.$store.dispatch(GET_REQUEST_WAITING, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    handleRouter(route) {
      this.$router.push(route)
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listFriend.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listFriend.length
    },
    handleCheckAllChange(val) {
      this.checkedFriends = val ? this.listId : []
      this.isIndeterminate = false
    },
    goBack() {
      this.handleRouter('/event/setting/' + this.id)
    },
    async eventAppove(id, status) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        this.ListId.push(id)
        const response = await this.$store.dispatch(REQUEST_APPROVE, {
          ListId: this.ListId,
          status
        })
        const { data, statusCode } = response
        if (statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: data.message
          })
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
