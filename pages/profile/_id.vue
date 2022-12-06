<template>
  <div class="main-login">
    <div class="d-flex justify-center">
      <FileUpload
        :width="145"
        :height="145"
        :circle="true"
        :disable="true"
        :default-image="''"
      />
    </div>
    <div class="text-center mt-[20px]">
      <p class="text-xl font-semibold text-[#273253]">Nguyễn Văn A</p>
      <p class="font-normal text-[#273253]">0973304611</p>
    </div>
    <div class="d-flex justify-center mt-[40px]">
      <div>
        <div class="my-[8px]">
          <Card :text-color="'white'" :title="$t('profile.change_infor')">
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
          <Card :text-color="'white'" :title="$t('profile.faqs')">
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
          <Card :text-color="'white'" :title="$t('profile.change_password')">
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
          <Card :text-color="'white'" :title="$t('profile.request_join_group')">
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
          <Card :text-color="'white'" :title="$t('profile.invitation_join_group')">
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

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Profile',
  components: {
    FileUpload, Card
  },
  asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    // CALL API INIT HERE
    // IMAGE URL PUSH IN :default-image props
  },
  methods: {}
}
</script>
