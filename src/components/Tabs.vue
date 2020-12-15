<template>
  <div class="uk-container uk-padding">
    <ul class="uk-subnav uk-subnav-divider">
      <li
        v-for="tab in tabs"
        :uk-tooltip="`title: ${tab.path}; pos: bottom`"
        :key="tab.name"
        :class="{ 'uk-active': activeTab === tab.name }"
      >
        <a
          class="uk-padding-small"
          :class="{ 'uk-text-bold': activeTab === tab.name }"
          @click="onChangeTab(tab.name)"
          href="#"
          >{{ tab.name }}</a
        >
        <a
          @click="onRemoveTab(tab.name)"
          class="uk-margin-small-left"
          href="#"
          uk-icon="close"
        ></a>
      </li>
      <li>
        <button @click="openModal" class="uk-button uk-button-link">
          <span uk-icon="plus"></span>
        </button>
      </li>
    </ul>
  </div>
  <FilesModal
    :tabs="tabs"
    :onSubmit="onAddNewTab"
    :isOpen="isModalOpen"
    :close="closeModal"
  />
</template>

<script lang="ts">
import { ProtoDirectory } from "@/types/types";
import { defineComponent, PropType } from "vue";
import FilesModal from "./FilesModal.vue";

const Tabs = defineComponent({
  props: {
    onAddNewTab: {
      type: Function as PropType<(name: string, path: string) => void>,
      default: () => {},
    },
    onRemoveTab: {
      type: Function as PropType<(name: string) => void>,
      default: () => {},
    },
    tabs: {
      type: Array as PropType<ProtoDirectory[]>,
      default: [],
    },
    activeTab: String,
    onChangeTab: {
      type: Function as PropType<(name: string) => void>,
      default: () => {},
    },
  },
  data() {
    return {
      isModalOpen: false,
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    onDirSubmit() {},
  },
  components: { FilesModal },
});

export default Tabs;
</script>


