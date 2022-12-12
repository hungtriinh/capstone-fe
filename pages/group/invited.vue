<template>
  <div class="main-login">
    <el-page-header content="Yêu cầu gia nhập nhóm đã gửi" @back="$router.push('/profile')">
    </el-page-header>
    <div class="main-content"></div>
    <div>
      <el-empty v-if="!listRequest.length" description="Không có yêu cầu nào"></el-empty>
      <div v-else>
        <InviteCard
v-for="(item, key) in listRequest" :key="key"
                    :group="{ id: item.inviteId, name: item.eventName }"
                    :request="{ time: item.date }"
                    @accept="handleAccept"
                    @reject="handleReject"
        ></InviteCard>
      </div>
    </div>
  </div>
</template>

<script>
import InviteCard from '../../components/group/InviteCard.vue'
import {
  GROUP_APPROVE,
  GROUP_INVITED,
  INDEX_SET_ERROR,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS
} from '~/store/store.const'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Requested',
  components: {
    InviteCard
  },
  data() {
    return {
      listRequest: []
    }
  },
  created() {
    this.getInvitedList()
  },
  methods: {
    handleAccept(id) {
      this.$confirm('Bạn có chắc chắn thực hiện thao tác này?', 'Xác nhận', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        this.$store.commit(INDEX_SET_LOADING, true)
        try {
          const response = await this.$store.dispatch(GROUP_APPROVE, {
            InviteId: id,
            Status: 1
          })
          if (response.statusCode === 202) {
            await this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: response.message
            })
            this.getInvitedList()
          } else {
            await this.$store.commit(INDEX_SET_ERROR, {
              show: true,
              text: response.message
            })
          }
        } catch (e) {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: 'Có lỗi xảy ra'
          })
          this.$store.commit(INDEX_SET_LOADING, false)
        }
        this.$store.commit(INDEX_SET_LOADING, false)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled'
        // })
      })
    },
    handleReject(id) {
      this.$confirm('Bạn có chắc chắn thực hiện thao tác này?', 'Xác nhận', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        this.$store.commit(INDEX_SET_LOADING, true)
        try {
          const response = await this.$store.dispatch(GROUP_APPROVE, {
            InviteId: id,
            Status: 2
          })
          if (response.statusCode === 202) {
            await this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: response.message
            })
            this.getInvitedList()
          } else {
            await this.$store.commit(INDEX_SET_ERROR, {
              show: true,
              text: response.message
            })
          }
        } catch (e) {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: 'Có lỗi xảy ra'
          })
          this.$store.commit(INDEX_SET_LOADING, false)
        }
        this.$store.commit(INDEX_SET_LOADING, false)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled'
        // })
      })
    },
    async getInvitedList() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GROUP_INVITED)
        if (response.statusCode === 202) {
          this.listRequest = response.data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
