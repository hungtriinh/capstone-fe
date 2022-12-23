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
            <el-card :body-style="{ padding: '10px' }" class="card-item mb-10">
              <div v-if="listEvent.inspector" class="d-flex justify-center text-center">
                <div class="member-role-avatar d-flex items-center mt-10 gap-10">
                  <div class="remove-btn">
                    <i v-if="eventStatus === 1 && role === 1" class="el-icon el-icon-error" @click="openDeteleDialog(listEvent.inspector.userId)"></i>
                    <ShowAvatarElement :event="{ name: listEvent.inspector.name, color: listEvent.color }"></ShowAvatarElement>
                  </div>
                  <div>
                    <span class="text-bold">{{ listEvent.inspector.name }}</span>
                    <br><span class="text-[#011A51] font-semibold">Người kiểm duyệt</span>
                  </div>
                </div>
              </div>
              <div v-else-if="!listEvent.inspector && role === 1 && eventStatus === 1" class="d-flex justify-center text-center">
                <div class="member-role-avatar d-flex items-center mt-10 gap-10">
                  <div class="up-role">
                    <img @click="showAddMemberModal(2)" class="cursor-pointer" src="~/assets/images/icons/add-member.svg" alt="">
                  </div>
                  <div>
                    <span class="text-bold italic text-[#011A51]">Nhấn để thêm người kiểm duyệt</span>
                    <br><span class="text-[#011A51] font-semibold">Người kiểm duyệt</span>
                  </div>
                </div>
              </div>
              <div class="text-center" v-else-if="!listEvent.inspector && role !== 1">
                <span class=" text-[#011A51] font-semibold">Không có Người kiểm duyệt</span>
              </div>
              <div class="text-center" v-else-if="!listEvent.inspector && eventStatus === 0">
                <span class=" text-[#011A51] font-semibold">Không có Người kiểm duyệt</span>
              </div>
              <div v-if="listEvent.cashier" class="d-flex justify-center text-center">
                <div class="member-cashier-avatar d-flex items-center mt-10 gap-10">
                  <div class="remove-btn">
                    <i v-if="eventStatus === 1 && role === 1" class="el-icon el-icon-error" @click="openDeteleDialog(listEvent.cashier.userId)"></i>
                    <ShowAvatarElement :event="{ name: listEvent.cashier.name, color: listEvent.color }"></ShowAvatarElement>
                  </div>

                  <div>
                    <span class="text-bold">{{ listEvent.cashier.name }}</span>
                    <br><span class="text-[#011A51] font-semibold">Người thu ngân</span>
                  </div>
                </div>
              </div>
              <div v-else-if="!listEvent.cashier && role === 1 && eventStatus === 1" class="d-flex justify-center text-center">
                <div class="member-role-avatar d-flex items-center mt-10 gap-10">
                  <div class="up-role">
                    <img class="cursor-pointer" src="~/assets/images/icons/add-member.svg" alt="" @click="showAddMemberModal(3)">
                  </div>
                  <div>
                    <span class="text-bold italic text-[#011A51]">Nhấn để thêm người thu ngân</span>
                    <br><span class="text-center text-[#011A51] font-semibold">Người thu ngân</span>
                  </div>
                </div>
              </div>
              <div class="text-center" v-else-if="!listEvent.cashier && role !== 1">
                <span class="text-[#011A51] font-semibold">Không có Người thu ngân</span>
              </div>
              <div class="text-center" v-else-if="!listEvent.cashier && eventStatus === 0">
                <span class="text-[#011A51] font-semibold">Không có Người thu ngân</span>
              </div>
            </el-card>
            <el-card :body-style="{ padding: '10px' }" class="card-item">
              <div v-for="(item, key) in listEvent.members" :key="key">
                <div v-if="listEvent.members.length">
                  <div class="flex-between">
                    <div class="member-avatar d-flex items-center mt-10 gap-10">
                      <el-badge is-dot class="event-status item" :type="item.friendStatus === 4 ?  'danger' : 'success'">
                        <ShowAvatarElement :event="{ name: item.name }"></ShowAvatarElement>
                      </el-badge>
                      <div>
                        <span class="text-bold">{{ item.name }}</span>
                        <span class="text-bold-sm" v-if="item.role === 1">(Người tạo sự kiện)</span>
                        <span class="text-bold-sm" v-if="item.role === 2">(Người kiểm duyệt)</span>
                        <span class="text-bold-sm" v-if="item.role === 3">(Người tạo thu ngân)</span>
                        <br><span class="time">{{ item.phone }}</span>
                      </div>
                    </div>
                    <div>
                      <i v-if="item.role !== 1 && role === 1 && eventStatus === 1" class="el-icon el-icon-error" @click="openConfirmDialog(item.userId)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <AddRoleMemberModal
        v-show="addMember"
        :list-friend="listPromote"
        :list-id="listId"
        @close="closeAddMemberModal"
      >
      </AddRoleMemberModal>
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
  PROMOTE_GET_ALL,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  INDEX_SET_ERROR,
  GET_MEMBER_LIST, MEMBER_PROMOTE,
  INDEX_SET_ROLE_MEMBER, MEMBER_ROLE_REMOVE, EVENT_CHECK_STATUS
} from '~/store/store.const'

export default {
  name: 'ListReceiptPage',
  // middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  computed: {
    ...mapState(['roleMember'])

  },
  data() {
    return {
      role: this.$cookies.get('getRole'),
      id: this.$route.params.id,
      search: '',
      listEvent: [],
      addMember: false,
      eventStatus: '',
      listId: [],
      listFriend: [],
      listPromote: [],
      chooseMember: [],
      roleType: ''
    }
  },
  watch: {
    roleMember() {
      console.log(this.roleMember)
      if (this.roleMember.length) {
        this.promoteMember(this.roleMember[0], this.roleType)
      }
    }
  },
  async created() {
    await this.getEventStatus()
    await this.getListEvent()
    await this.getListPromote()
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
    async getListPromote() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(PROMOTE_GET_ALL, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listPromote = data
          this.listPromote.forEach((element) => {
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
    async getEventStatus() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(EVENT_CHECK_STATUS, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.eventStatus = data.EventStatus
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
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
    async promoteMember(id, type) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(MEMBER_PROMOTE, {
          EventId: this.id,
          UserId: id,
          Role: type
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
    openDeteleDialog(id) {
      // if (type === 2)
      this.$confirm('Bạn có muốn hủy vị trí này', 'Xác nhận', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.removeRole(id)
      }).catch(() => {
      })
    },
    async showAddMemberModal(type) {
      await this.$store.commit(INDEX_SET_ROLE_MEMBER, [])
      this.roleType = type
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
    },
    async removeRole(id) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(MEMBER_ROLE_REMOVE, {
          EventId: Number(this.id),
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
    }
  }
}
</script>
