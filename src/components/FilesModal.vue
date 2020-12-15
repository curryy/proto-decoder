<template>
  <div class="uk-modal" :class="{ 'uk-open': isOpen }" :style="modalStyles">
    <div class="uk-modal-dialog">
      <button
        uk-close
        class="uk-modal-close-default"
        type="button"
        @click="handleClose"
      ></button>
      <div class="uk-modal-header">
        <h2 class="uk-modal-title">New tab</h2>
        <div class="uk-text-meta">Add new tab with chosen proto directory.</div>
      </div>

      <div class="uk-modal-body">
        <div class="uk-margin-bottom">
          <label class="uk-form-label">Tab name</label>
          <div class="uk-form-controls">
            <input
              :value="tabName"
              @change="onTabNameChange"
              :class="{ 'uk-form-danger': tabNameError }"
              class="uk-input"
            />
            <div v-if="tabNameError" class="uk-text-danger uk-text-small">
              {{ tabNameError }}
            </div>
          </div>
        </div>
        <div>Add absolute path to directory with proto files to process</div>
        <div uk-form-custom>
          <input
            ref="inputFile"
            webkitdirectory
            directory
            type="file"
            @change="onFileChange"
          />
          <button
            class="uk-button uk-button-default"
            :class="{ 'uk-button-danger': directoryError }"
            type="button"
            tabindex="-1"
          >
            Add
          </button>
        </div>
        <div v-if="directoryError" class="uk-text-danger uk-text-small">
          {{ directoryError }}
        </div>
        <input
          :class="{ 'uk-form-danger': directoryError }"
          class="uk-input uk-margin-bottom"
          :value="directory"
        />
      </div>

      <div class="uk-modal-footer uk-text-right">
        <button
          @click="handleSubmit"
          class="uk-button uk-button-primary"
          type="button"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapActions } from "vuex";
import { ProtoDirectory } from "../types/types";

const FilesModal = defineComponent({
  props: {
    isOpen: Boolean,
    close: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
    onSubmit: {
      type: Function as PropType<(name: string, path: string) => void>,
      default: () => {},
    },
    tabs: {
      type: Array as PropType<ProtoDirectory[]>,
      default: [],
    },
  },

  data() {
    return {
      tabName: "",
      directory: "",
      tabNameError: "",
      directoryError: "",
    };
  },
  computed: {
    modalStyles(): { display: "block" } | {} {
      return this.isOpen ? { display: "block" } : {};
    },
  },

  methods: {
    ...mapActions({
      clearProtosData: "clearProtosData",
      pushProtoData: "pushProtoData",
    }),
    onTabNameChange(event: Event) {
      this.tabNameError = "";
      this.tabName = (event.target as HTMLInputElement).value;
    },
    handleClose() {
      this.close();
      (this.$refs.inputFile as HTMLInputElement).value = "";
      this.tabName = "";
      this.directory = "";
    },

    getCommonPath(files: FileList | null) {
      if (!files) {
        return "";
      }
      const elAt = (i: number) => (a: string[]) => a[i];
      const rotate = (a: string[][]) => a[0].map((e, i) => a.map(elAt(i)));
      const commonPath = (input: string[], sep = "/") =>
        rotate(input.map((i) => i.split(sep).slice(0, -1)))
          .filter((arr) => arr.every((e) => e === arr[0]))
          .map(elAt(0))
          .join(sep);

      const filesPaths = [];
      for (const file of files) {
        filesPaths.push(file.path);
      }
      return commonPath(filesPaths);
    },

    onFileChange(event: Event) {
      this.directoryError = "";
      this.directory = this.getCommonPath(
        (event.target as HTMLInputElement).files
      );
    },

    onChangeDirectory(event: Event) {
      this.directoryError = "";
      this.directory = (event.target as HTMLInputElement).value;
    },

    handleSubmit() {
      if (!this.directory) {
        this.directoryError = "Required!";
      }
      if (!this.tabName) {
        this.tabNameError = "Required!";
      } else if (this.tabs.some(({ name }) => name === this.tabName)) {
        this.tabNameError = "Tabe with this name exists.";
      }
      if (!this.tabNameError && !this.directoryError) {
        this.onSubmit(this.tabName, this.directory);
        this.handleClose();
      }
    },
  },
});
export default FilesModal;
</script>