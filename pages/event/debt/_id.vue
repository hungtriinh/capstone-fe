<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <div class="title-box d-flex">
          <img class="cursor-pointer" src="~/assets/images/icons/back.svg" alt="back" @click="handleRouter('/')">
        </div>
        <div class="total text-bold">
          <div class="btn-group d-flex justify-center">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">{{ $t('event.check_all')}}</el-checkbox>
          </div>
          <div class="">
            <el-checkbox-group v-model="checkedDebt" class="checkbox-group" @change="handleCheckedCitiesChange">
                <div v-for="(item, key) in listDebt" :key="key">
                  <div class="checkbox-item-debt">
                    <el-checkbox :label="item.userDeptId" :value="item.userDeptId" @change="changeCheck(item)"></el-checkbox>
                    <div>
                      <span class="text-bold">{{ item.receiptName }}</span><br>
                      <span class="text-bold">{{ item.date }}</span><br>
                      <span class="text-bold">{{ item.ownerName }}</span>
                    </div>
                    <div class="text-bold">{{ item.debtLeft }}</div>
                  </div>
                  <div class="block">
                    <el-slider v-model="item.debtLeft" :step="1000" :disabled="!item.check" :min="0" :max="item.maxSlider"></el-slider>
                  </div>
                </div>
            </el-checkbox-group>
          </div>
        </div>
        <div class="total text-bold">
          <span class="">{{ $t('debt.total') }}: </span><span>{{ totalMoney }} </span><span>{{$t('currency.currency')}}</span>
          <br>
          <span class="">{{ $t('debt.remainder') }}: </span><span>{{ totalDebt - totalMoney }} </span><span>{{$t('currency.currency')}}</span>
        </div>
        <div class="btn-group text-center">
          <el-button @click="handlePay">{{ $t('debt.pay') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
// import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
// import { validPhoneNoPrefix } from '@/utils/validate'

import {
  PAY_DEBT,
  GET_DEBT_LIST,
  INDEX_SET_LIST_FRIEND,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  INDEX_SET_ERROR
} from '~/store/store.const'

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
      checkAll: false,
      totalMoney: 0
    }
  },
  computed: {
    totalDebt() {
      let total = 0
      this.listDebt.forEach((element) => {
        total += element.maxSlider
      })
      return total
    }
  },
  watch: {
    listDebt: {
      handler() {
        let total = 0
        this.listDebt.forEach((element) => {
          if (element.check) {
            total += element.debtLeft
          }
        })
        this.totalMoney = total
      },
      deep: true
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
  methods: {
    async getlistDebt() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_DEBT_LIST, {
          'EventId': this.$route.params.id
        })
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listDebt = data
          this.listDebt.forEach((element) => {
            element.maxSlider = element.debtLeft
            element.check = false
          })
        }
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
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listDebt.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listDebt.length
    },
    handleCheckAllChange(val) {
      this.checkedDebt = val ? this.listId : []
      this.listDebt.forEach((element) => {
        element.check = val
      })
      this.isIndeterminate = false
    },
    async create() {
      await this.$store.commit(INDEX_SET_LIST_FRIEND, this.checkedDebt)
    },
    changeCheck(value) {
      value.check = !value.check
      // this.listDebt.forEach((element) => {
      //   if (element.userDeptId === value.userDeptId) {
      //     element.check = value.check
      //     element.debtleft = value.debtleft
      //   }
      // })
      if (value.check) {
        this.totalMoney += value.debtLeft
      } else {
        this.totalMoney -= value.debtLeft
      }
    },
    async handlePay() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const data = await this.$store.dispatch(PAY_DEBT, {
          'eventId': this.$route.params.id,
          'userId': 11,
          'paidImage': 'paidimage.img',
          'totalMoney': this.totalMoney,
          'listEachPaidDebt': this.listDebt
        })
        switch (data.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.getlistDebt()
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
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
