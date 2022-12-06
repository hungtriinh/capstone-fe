<template>
  <div class="navigation-bar pb-[10px]">
    <div class="navigation">
      <!-- <img  src="@/assets/images/icons/event.svg" alt=""> -->
      <div class="menu-icon">
        <svg
          width="34"
          height="33"
          viewBox="0 0 34 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.7499 30.25H21.2499C28.3333 30.25 31.1666 27.5 31.1666 20.625V12.375C31.1666 5.5 28.3333 2.75 21.2499 2.75H12.7499C5.66659 2.75 2.83325 5.5 2.83325 12.375V20.625C2.83325 27.5 5.66659 30.25 12.7499 30.25Z"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22.3125 12.375H11.6875"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22.3125 20.625H11.6875"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="text-xs">{{$t('navigation.event')}}</p>
      </div>
      <div class="menu-icon" :class="{'is-selected' : isSelectedRoute('/friends')}" @click="handleRouter('/friends')">
        <svg
          width="34"
          height="33"
          viewBox="0 0 34 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.5 9.84501C25.415 9.83126 25.3159 9.83126 25.2309 9.84501C23.2759 9.77626 21.7175 8.2225 21.7175 6.2975C21.7175 4.33125 23.3467 2.75 25.3725 2.75C27.3984 2.75 29.0275 4.345 29.0275 6.2975C29.0134 8.2225 27.455 9.77626 25.5 9.84501Z"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M24.0408 19.8552C25.9816 20.1715 28.1208 19.8415 29.6225 18.8652C31.62 17.5727 31.62 15.4552 29.6225 14.1627C28.1066 13.1865 25.9391 12.8565 23.9983 13.1865"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.45743 9.84501C8.54243 9.83126 8.6416 9.83126 8.7266 9.84501C10.6816 9.77626 12.2399 8.2225 12.2399 6.2975C12.2399 4.33125 10.6108 2.75 8.58493 2.75C6.5591 2.75 4.92993 4.345 4.92993 6.2975C4.9441 8.2225 6.50243 9.77626 8.45743 9.84501Z"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.9167 19.8552C7.97587 20.1715 5.83671 19.8415 4.33504 18.8652C2.33754 17.5727 2.33754 15.4552 4.33504 14.1627C5.85087 13.1865 8.01837 12.8565 9.9592 13.1865"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 20.1165C16.915 20.1027 16.8159 20.1027 16.7309 20.1165C14.7759 20.0477 13.2175 18.494 13.2175 16.569C13.2175 14.6027 14.8467 13.0215 16.8725 13.0215C18.8984 13.0215 20.5275 14.6165 20.5275 16.569C20.5134 18.494 18.955 20.0615 17 20.1165Z"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.8775 24.4476C10.88 25.7401 10.88 27.8576 12.8775 29.1501C15.1442 30.6214 18.8559 30.6214 21.1225 29.1501C23.12 27.8576 23.12 25.7401 21.1225 24.4476C18.87 22.9901 15.1442 22.9901 12.8775 24.4476Z"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="text-xs">{{$t('navigation.friends')}}</p>
      </div>
      <div class="menu-icon">
        <svg
          width="34"
          height="33"
          viewBox="0 0 34 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.6666 2.75H11.3333C5.66659 2.75 2.83325 5.5 2.83325 11V28.875C2.83325 29.6313 3.47075 30.25 4.24992 30.25H22.6666C28.3333 30.25 31.1666 27.5 31.1666 22V11C31.1666 5.5 28.3333 2.75 22.6666 2.75Z"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.0417 16.5H21.9584"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 21.3125V11.6875"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="text-xs">{{$t('navigation.create_event')}}</p>
      </div>
      <div class="menu-icon" :class="{'is-selected' : isSelectedRoute('/activities')}" @click="handleRouter('/activities')">
        <svg
          width="34"
          height="33"
          viewBox="0 0 34 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M31.1667 16.5C31.1667 24.09 24.82 30.25 17 30.25C9.18004 30.25 2.83337 24.09 2.83337 16.5C2.83337 8.91 9.18004 2.75 17 2.75C24.82 2.75 31.1667 8.91 31.1667 16.5Z"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22.2558 20.8724L17.8642 18.3287C17.0992 17.8887 16.4758 16.8299 16.4758 15.9637V10.3262"
            stroke="#6B6969"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="text-xs">{{$t('navigation.activities')}}</p>
      </div>
      <div class="menu-icon" :class="{'is-selected' : isSelectedRoute('/profile')}" @click="handleRouter('/profile')">
        <el-badge :value="12" class="item">
          <svg
            width="34"
            height="33"
            viewBox="0 0 34 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.1701 17.5727C17.0709 17.5589 16.9434 17.5589 16.8301 17.5727C14.3367 17.4902 12.3534 15.5102 12.3534 13.0764C12.3534 10.5877 14.4217 8.56641 17.0001 8.56641C19.5642 8.56641 21.6467 10.5877 21.6467 13.0764C21.6326 15.5102 19.6634 17.4902 17.1701 17.5727Z"
              stroke="#6B6969"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M26.5483 26.647C24.0267 28.8883 20.6833 30.2495 17 30.2495C13.3167 30.2495 9.97333 28.8883 7.45166 26.647C7.59333 25.3545 8.44333 24.0895 9.95916 23.0995C13.8408 20.597 20.1875 20.597 24.0408 23.0995C25.5567 24.0895 26.4067 25.3545 26.5483 26.647Z"
              stroke="#6B6969"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17 30.25C24.8241 30.25 31.1667 24.0939 31.1667 16.5C31.1667 8.90608 24.8241 2.75 17 2.75C9.17601 2.75 2.83337 8.90608 2.83337 16.5C2.83337 24.0939 9.17601 30.25 17 30.25Z"
              stroke="#6B6969"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </el-badge>
        <p class="text-xs">{{$t('navigation.personal')}}</p>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'NavigationPage',
  methods: {
    handleRouter(router) {
      this.$router.push(router)
    },
    isSelectedRoute(route) {
      const currentPath = this.$route.path
      return currentPath.includes(route)
    }
  }
}
</script>
