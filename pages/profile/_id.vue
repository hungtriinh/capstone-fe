<template>
  <div class="main-login profile">
    <div class="d-flex justify-center">
      <div v-if="!profile.Avatar">
      <FileUpload
        :width="145"
        :height="145"
        :circle="true"
        :disable="true"
        :default-image="''"
      />
      </div>
      <div class="profile-img" v-else>
<!--        <ShowAvatarElement :event="{ name: profile.UserName }"></ShowAvatarElement>-->
        <el-avatar :src="profile.Avatar" :size="100" :preview-src-list='profile.Avatar' class="image"/>

      </div>
    </div>
    <div class="text-center mt-[20px]">
      <p class="text-xl font-semibold text-[#273253]">{{ profile.UserName }}</p>
      <p class="font-normal text-[#273253]">{{profile.PhoneNumber}} </p>
    </div>
    <div class="d-flex justify-center mt-[40px]">
      <div>
        <div class="my-[8px]">
          <Card :text-color="'white'" :title="$t('profile.change_infor')" @click="handleRouter('/profile/setting')">
            <template #prefix>
              <div class="p-[6px] bg-neutral-200 rounded-full">
                <img src="~/assets/images/common/lock.svg" alt="" />
              </div>
            </template>
            <template #postfix>
              <div>
                <img src="~/assets/images/common/chevron-right.svg" alt="" />
              </div>
            </template>
          </Card>
        </div>
        <div class="my-[8px]">
          <Card :text-color="'white'" :title="$t('profile.faqs')" @click="handleRouter('faq')">
            <template #prefix>
              <div class="p-[6px] bg-neutral-200 rounded-full">
                <img src="~/assets/images/common/bell.svg" alt="" />
              </div>
            </template>
            <template #postfix>
              <div>
                <img src="~/assets/images/common/chevron-right.svg" alt="" />
              </div>
            </template>
          </Card>
        </div>
        <div class="my-[8px]">
          <Card :text-color="'white'" :title="$t('profile.change_password')" @click="handleRouter('/change-pass')">
            <template #prefix>
              <div class="p-[6px] bg-neutral-200 rounded-full">
                <img src="~/assets/images/common/lock.svg" alt="" />
              </div>
            </template>
            <template #postfix>
              <div>
                <img src="~/assets/images/common/chevron-right.svg" alt="" />
              </div>
            </template>
          </Card>
        </div>
        <div class="my-[8px]">
          <Card :text-color="'white'" :title="$t('profile.request_join_group')" @click="handleRouter('/group/requested')">
            <template #prefix>
              <div class="p-[6px] bg-neutral-200 rounded-full">
                <img src="~/assets/images/common/credit-card.svg" alt="" />
              </div>
            </template>
            <template #postfix>
              <div>
                <img src="~/assets/images/common/chevron-right.svg" alt="" />
              </div>
            </template>
          </Card>
        </div>
        <div class="my-[8px]">
          <Card :text-color="'white'" :title="$t('profile.invitation_join_group')" @click="handleRouter('/group/invited')">
            <template #prefix>
              <div class="p-[6px] bg-neutral-200 rounded-full">
                <img src="~/assets/images/common/credit-card.svg" alt="" />
              </div>
            </template>
            <template #postfix>
              <div>
                <img src="~/assets/images/common/chevron-right.svg" alt="" />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/common/Card.vue'
import FileUpload from '@/components/common/FileUpload.vue'
import { PROFILE_GET, INDEX_SET_LOADING } from '~/store/store.const'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Profile',
  components: {
    FileUpload,
    Card
  },
  asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    // CALL API INIT HERE
    // IMAGE URL PUSH IN :default-image props
  },
  data() {
    return {
      profile: {}
    }
  },
  methods: {
    async getEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(PROFILE_GET, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.profile = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    handleRouter(router) {
      this.$router.push(router)
    }
  },
  created() {
    this.getEvent()
  }
}
</script>
