<template>
  <div class="main-login list-receipt-page">
    <div>
      <div class="login login-width login-mobile">
        <el-page-header content="Danh sách chứng từ" @back="goBack">
        </el-page-header>
        <el-empty v-if="!listEvent.length" description="Không có chứng từ nào"></el-empty>
        <div v-else>
          <div class="main-content">
            <el-card v-for="(item, key) in listEvent" :key="key" shadow="hover" :body-style="{ padding: '10px' }" class="card-item">
              <div class="d-flex justify-between">
                <div class="list-image d-flex gap-10">
                  <img v-show="!item.imageLink" class="image" src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                  <img v-for="(img, key) in item.imageLinks" :key="key" :src="img" class="image">
                </div>
                <!--                <span class="text-bold money">{{ item.receiptAmount }}<i class="el-icon el-icon-arrow-right"></i></span>-->
                <span class="text-bold d-flex money">Chi tiết<i class="el-icon el-icon-arrow-right"></i></span>
              </div>
              <div class="">
                <div class="flex-between">
                  <div class="avatar-name d-flex items-center mt-10 gap-5">
                    <ShowAvatarElement :event="{ name: item.user.name, color: item.color }"></ShowAvatarElement>
                    <span>{{ item.user.name }}</span>
                  </div>
                </div>
                <div class="bottom">
                  <div>
                    <time class="time">{{ item.date }}</time>
                    <br>
                    <div><span class="text-bold">{{ item.code }}</span><span v-if="item.code">:</span> <span class="text-bold money">{{ item.totalMoney }}</span></div>

                  </div>
                  <div>
                    <el-tag effect="dark" v-show="item.type" type="info">{{ item.type }}</el-tag>
                    <el-tag v-if="item.receiptStatus === 2" type="success">Đồng ý</el-tag>
                    <el-tag v-else-if="item.receiptStatus === 3" type="danger">Từ chối</el-tag>
                    <el-tag v-else-if="item.receiptStatus === 1" type="warning">Đang chờ</el-tag>
                    <el-tag v-else effect="dark" type="">Trả hết</el-tag>
                  </div>
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
import {
  REQUEST_APPROVE,
  DEBT_SENT_LIST,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS
} from '~/store/store.const'

export default {
  name: 'ListReceiptPage',
  // middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  data() {
    return {
      id: this.$route.params.id,
      search: '',
      listEvent: [],
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
        const response = await this.$store.dispatch(DEBT_SENT_LIST, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
        }
        console.log(this.listEvent)
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
