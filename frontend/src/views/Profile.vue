<template>
  <div>
    <TabMenu class="center" :model="items" />
    <transition name="slide" mode="out-in">
      <component :is="selectedComponent" />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheUpdateEmailCard from "@/components/TheUpdateEmailCard.vue";
import TheUpdatePersonalInformationCard from "@/components/TheUpdatePersonalInformationCard.vue";
import TheUpdateProfileImageCard from "@/components/TheUpdateProfileImageCard.vue";
import TheUpdatePasswordCard from "@/components/TheUpdatePasswordCard.vue";
import TheUpdatePersonalSettingsCard from "@/components/TheUpdatePersonalSettingsCard.vue";

export default defineComponent({
  name: "Profile",
  components: {
    TheUpdateEmailCard,
    TheUpdateProfileImageCard,
    TheUpdatePasswordCard,
    TheUpdatePersonalInformationCard,
    TheUpdatePersonalSettingsCard
  },
  data() {
    return {
      selectedComponent: "TheUpdatePersonalInformationCard",
      items: [
        {
          label: "Personal Information",
          icon: "pi pi-id-card",
          command: () =>
              // @ts-ignore
              this.selectComponent("TheUpdatePersonalInformationCard")
        },
        {
          label: "Profile Image",
          icon: "pi pi-image",
          // @ts-ignore
          command: () => this.selectComponent("TheUpdateProfileImageCard")
        },
        {
          label: "Email",
          icon: "pi pi-envelope",
          // @ts-ignore
          command: () => this.selectComponent("TheUpdateEmailCard")
        },
        {
          label: "Password",
          icon: "pi pi-key",
          // @ts-ignore
          command: () => this.selectComponent("TheUpdatePasswordCard")
        },
        {
          label: "Settings",
          icon: "pi pi-cog",
          // @ts-ignore
          command: () => this.selectComponent("TheUpdatePersonalSettingsCard")
        }
      ]
    };
  },
  methods: {
    selectComponent(component: string) {
      this.selectedComponent = component;
    }
  }
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
