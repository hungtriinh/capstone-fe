<template>
  <div class="main-login list-member-page">
    <div>
      <div class="login login-width login-mobile">
        <el-page-header :content="listEvent.eventName" @back="goBack">
          {{id}}
        </el-page-header>
        <el-empty v-if="!listEvent" description="Không có thành viên  nào"></el-empty>
        <div v-else>
          <div class="main-content">
            <div v-if="!listEvent.inspector" class="d-flex justify-center text-center">
<!--              <div class="member-role-avatar d-flex items-center mt-10 gap-10">-->
<!--                <ShowAvatarElement :event="{ name: listEvent.inspector.name, color: listEvent.color }"></ShowAvatarElement>-->
<!--                <div>-->
<!--                  <span class="text-bold">{{ listEvent.inspector.name }}</span>-->
<!--                  <br><span class="text-[#011A51] font-semibold">Người kiểm duyệt</span>-->
<!--                </div>-->
<!--              </div>-->
            </div>
            <div v-else class="d-flex justify-center text-center">
              <div class="member-role-avatar d-flex items-center mt-10 gap-10">
                <div class="up-role">
                  <img class="cursor-pointer" src="~/assets/images/icons/add-member.svg" alt="">
                </div>
                <div>
                  <span class="text-bold italic text-[#011A51]">Nhấn để thêm người kiểm duyệt</span>
                  <br><span class="text-[#011A51] font-semibold">Người kiểm duyệt</span>
                </div>
              </div>
            </div>
            <div v-if="!listEvent.cashier" class="d-flex justify-center text-center">
<!--              <div class="member-role-avatar d-flex items-center mt-10 gap-10">-->
<!--                <ShowAvatarElement :event="{ name: listEvent.cashier.name, color: listEvent.color }"></ShowAvatarElement>-->
<!--                <div>-->
<!--                  <span class="text-bold">{{ listEvent.cashier.name }}</span>-->
<!--                  <br><span class="text-[#011A51] font-semibold">Người thu ngân</span>-->
<!--                </div>-->
<!--              </div>-->
            </div>
            <div v-else class="d-flex justify-center text-center">
              <div class="member-role-avatar d-flex items-center mt-10 gap-10">
                <div class="up-role">
                  <img class="cursor-pointer" src="~/assets/images/icons/add-member.svg" alt="" @click="showAddMemberModal">
                </div>
                <div>
                  <span class="text-bold italic text-[#011A51]">Nhấn để thêm người thu ngân</span>
                  <br><span class="text-[#011A51] font-semibold">Người thu ngân</span>
                </div>
              </div>
            </div>
            <el-card shadow="hover" :body-style="{ padding: '10px' }" class="card-item">
              <div v-for="(item, key) in listEvent.members" :key="key">
                <div v-if="listEvent.members.length">
                  <div class="flex-between">
                    <div class="member-avatar d-flex items-center mt-10 gap-10">
                      <ShowAvatarElement :event="{ name: item.name }"></ShowAvatarElement>
                      <div>
                        <span class="text-bold">{{ item.name }}</span>
                        <br><span class="time">{{ item.phone }}</span>
                      </div>
                    </div>
                    <div>
                      <i class="el-icon el-icon-error" @click="openConfirmDialog(item.userId)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <AddMemberModal
        v-show="addMember"
        :list-friend="listFriend"
        :list-id="listId"
        @close="closeAddMemberModal"
      >
      </AddMemberModal>
    </div>
  </div>
</template>
<script>
// import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
// import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
// import { validPhoneNoPrefix } from '@/utils/validate'
import { mapState } from 'vuex'
import {
  MEMBER_REMOVE,
  MEMBER_GET_ALL,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  INDEX_SET_ERROR,
  GET_MEMBER_LIST
} from '~/store/store.const'

export default {
  name: 'ListReceiptPage',
  // middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  computed: {
    ...mapState(['listFriends'])

  },
  data() {
    return {
      id: this.$route.params.id,
      search: '',
      listEvent: [],
      addMember: false,
      listId: [],
      listFriend: [],
      chooseMember: []
    }
  },
  watch: {
    listFriends() {
      this.listFriend.forEach((element) => {
        if (this.listFriends.includes(element.userId)) {
          this.chooseMember.push(element)
        }
      })
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
        const response = await this.$store.dispatch(MEMBER_GET_ALL, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
          this.listFriend = data.members
          this.listFriend.forEach((element) => {
            this.listId.push(element.userId)
          })
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
    async removeMember(id) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(MEMBER_REMOVE, {
          EventId: this.id,
          UserId: id
        })
        switch (response.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: response.message
            })
            this.getListEvent()
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: response.message })
            break
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    openConfirmDialog(id) {
      this.$confirm('Bạn có muốn xóa thành viên này khỏi event?', 'Xác nhận', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.removeMember(id)
      }).catch(() => {
      })
    },
    showAddMemberModal() {
      this.addMember = true
    },
    closeAddMemberModal() {
      this.addMember = false
    },
    async getListFriend() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_MEMBER_LIST, this.$route.params.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listFriend = data
          this.listFriend.forEach((element) => {
            this.listId.push(element.userId)
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
