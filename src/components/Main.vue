<template>
  <Header />
  <Tabs
    :onAddNewTab="onAddNewTab"
    :onRemoveTab="onRemoveTab"
    :tabs="protoDirectories"
    :activeTab="activeTab"
    :onChangeTab="setActiveTab"
  />
  <EmptyView v-if="!protoDirectories.length" />
  <template v-else>
    <template v-for="tab in protoDirectories" :key="tab.name">
      <div v-show="tab.name === activeTab">
        <Decoder :directory="tab.path" />
      </div>
    </template>
  </template>
</template>

<script lang="ts">
import Header from "./Header.vue";
import Decoder from "./Decoder.vue";
import Tabs from "./Tabs.vue";
import EmptyView from "./EmptyView.vue";
import { ProtoDirectory } from "@/types/types";
import { defineComponent } from "vue";
import fs from "fs";
import { CONFIG_FILE_NAME } from "@/constants";

const Main = defineComponent({
  components: {
    Header,
    Decoder,
    Tabs,
    EmptyView,
  },
  created() {
    fs.readFile(CONFIG_FILE_NAME, (err, data) => {
      if (err) throw err;
      const configData = JSON.parse(data.toString());
      this.activeTab = configData.activeTab || "";
      this.protoDirectories = configData.tabs || [];
    });
  },
  data() {
    return {
      protoDirectories: [] as ProtoDirectory[],
      activeTab: "",
    };
  },
  methods: {
    saveDataToFile() {
      const jsonData = JSON.stringify(
        {
          activeTab: this.activeTab,
          tabs: this.protoDirectories,
        },
        null,
        2
      );
      fs.writeFile(CONFIG_FILE_NAME, jsonData, (err) => {
        if (err) throw err;
      });
    },

    onAddNewTab(name: string, path: string) {
      this.protoDirectories.push({ name, path });
      this.setActiveTab(name);
      this.saveDataToFile();
    },
    onRemoveTab(name: string) {
      if (this.activeTab === name && this.protoDirectories.length) {
        const removedTabIndex = this.protoDirectories.findIndex(
          (elem) => elem.name === name
        );
        this.activeTab = this.protoDirectories[
          removedTabIndex - 1 >= 0 ? removedTabIndex - 1 : 1
        ]?.name;
      }
      this.protoDirectories = this.protoDirectories.filter(
        (elem) => elem.name !== name
      );

      this.saveDataToFile();
    },
    setActiveTab(name: string) {
      this.activeTab = name;
      this.saveDataToFile();
    },
  },
});

export default Main;
</script>