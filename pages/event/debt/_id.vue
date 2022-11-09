<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <div class="title-box d-flex">
          <img class="cursor-pointer" src="~/assets/images/icons/back.svg" alt="back" @click="handleRouter('/event')">
        </div>
        <div class="total text-bold">
          <div class="">
            <el-checkbox-group v-model="checkedDebt" class="checkbox-group" @change="handleCheckedCitiesChange">
                <div v-for="(item, key) in listDebt" :key="key">
                  <div class="checkbox-item-debt">
                    <el-checkbox @change="changeCheck" :label="item.userDeptId" :value="item.userDeptId"></el-checkbox>
                    <div>
                      <span class="text-bold">{{ item.receiptName }}</span><br>
                      <span class="text-bold">{{ item.date }}</span><br>
                      <span class="text-bold">{{ item.ownerName }}</span>
                    </div>
                    <div class="text-bold">{{ item.debtLeft }}</div>
                  </div>
                  <div class="block">
                    <el-slider v-model="item.debtLeft" :disabled="!item.check" :min="0" :max="item.maxSlider"></el-slider>
                  </div>
                </div>
            </el-checkbox-group>
          </div>
          {{listId}}
          {{checkedDebt}}

          <div class="btn-group d-flex justify-center">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">{{ $t('event.check_all')}}</el-checkbox>
          </div>
        </div>
        <div class="btn-group text-center">
          <el-button @click="handleRouter('/event/debt/' + $route.params.id )">{{ $t('debt.pay') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
// import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
// import { validPhoneNoPrefix } from '@/utils/validate'

import { GET_DEBT_LIST, INDEX_SET_LIST_FRIEND, INDEX_SET_LOADING } from '~/store/store.const'

export default {
  name: 'MainPage',
  components: {
  },
  data() {
    return {
      checkedDebt: [],
      search: '',
      friends: '',
      isIndeterminate: true,
      listDebt: [],
      listId: [],
      checkAll: false
    }
  },
  watch: {
    listDebt(newValue, oldValue) {
      this.listDebt.forEach((element) => {
        element.maxSlider = element.debtLeft
      })
    },
    checkedDebt() {
      this.checkedDebt.forEach((element) => {
        if (this.listId.includes(element)) {
          this.listDebt.forEach((debt) => {
            if (debt.userDeptId === element) {
              debt.check = true
            }
          })
        }
      })
    }
  },
  created() {
    this.getlistDebt()
  },
  mounted() {
  },
  // computed: {
  //   disabledSlider() {
  //     if (this.checkedDebt) {
  //       this.checkedDebt.forEach((element) => {
  //         console.log(element)
  //         if (this.listId.includes(element)) {
  //           return false
  //         }
  //       })
  //     }
  //   }
  // },
  methods: {
    async getlistDebt() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_DEBT_LIST, {
          'EventId': this.$route.params.id,
          'UserId': 11
        })
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listDebt = data
        }
        console.log(data)
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)

      this.listDebt.forEach(element => {
        element.icon_fake = require('@/assets/images/event.png')
      })
      this.listDebt.forEach((element) => {
        this.listId.push(element.userDeptId)
      })
    },
    handleRouter(router) {
      this.$router.push(router)
    },
    close() {
      this.$emit('close')
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listDebt.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listDebt.length
    },
    handleCheckAllChange(val) {
      this.checkedDebt = val ? this.listId : []
      this.isIndeterminate = false
    },
    async create() {
      await this.$store.commit(INDEX_SET_LIST_FRIEND, this.checkedDebt)
      this.close()
    },
    changeCheck(value) {
      if (value) {
        this.checkedDebt.forEach((element) => {
          if (this.listId.includes(element)) {
            this.listDebt.forEach((debt) => {
              if (debt.userDeptId === element) {
                debt.check = value
              }
            })
          }
        })
      }
    }
  }
}
</script>
