<template>
  <div class="modal-backdrop">
    <div class="confirm-modal text-center">
      <div class="title"> {{ $t('event.add_member') }} </div>
      <el-input
        v-model="search"
        placeholder="Search"
        prefix-icon="el-icon-search">
      </el-input>
      <div class="">
<!--        {{listFriend}}-->
        <el-checkbox-group v-model="checkedFriends" class="checkbox-group" @change="handleCheckedCitiesChange">
          <div v-for="(item, key) in listFriend" :key="key" class="checkbox-item">
            <el-checkbox  :key="item.id" :label="item.id">{{item.id}}</el-checkbox>
            <img class="avatar" src="@/assets/images/event.png" alt="">
            <div>
              <span class="text-bold">{{ item.userName }}</span><br>
              <span class="text-bold">{{ item.bankInfo }}</span>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div class="btn-group d-flex justify-center">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">{{ $t('event.check_all')}}</el-checkbox>
        <el-button class="button" type="danger" @click="handleRouter" >{{$t('event.confirm')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AddMemberModal',
  props: {
    listFriend: {
      type: [],
      default: () => []
    }
  },
  data() {
    return {
      checkedFriends: [],
      search: '',
      checkAll: false,
      isIndeterminate: true

    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleRouter() {
      this.$emit('handleRouter')
    },
    handleCheckedCitiesChange(value) {
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleCheckAllChange(val) {
      // this.checkedCities = val ? cityOptions : [];
      // this.isIndeterminate = false;
    }
  }
}
</script>
