<template>
  <div class="uk-container">
    <div class="uk-text-meta" v-if="filesError">
      This directory doesn't exist or contains invalid .proto files
    </div>
    <h4 :class="{ 'uk-text-danger': filesError }" class="uk-margin-remove-top">
      {{ directory }}
    </h4>
    <form class="uk-form-stacked">
      <div class="uk-margin-bottom">
        <label class="uk-form-label">proto package</label>
        <div class="uk-form-controls">
          <select
            @change="onPackageChange"
            :value="chosenPackage?.name"
            class="uk-select"
          >
            <option />
            <option
              v-for="packageName in packages"
              :key="packageName"
              :value="packageName"
            >
              {{ packageName }}
            </option>
          </select>
        </div>
      </div>

      <div class="uk-margin-bottom">
        <label class="uk-form-label">proto message type</label>
        <div class="uk-form-controls">
          <select
            @change="onMessageChange"
            :value="chosenMessage?.name"
            class="uk-select"
          >
            <option />
            <option
              v-for="message in messagesData"
              :key="message"
              :value="message"
            >
              {{ message }}
            </option>
          </select>
        </div>
      </div>

      <div class="uk-margin-bottom">
        <label class="uk-form-label">base64 message to decode</label>
        <div class="uk-form-controls">
          <input
            :value="protoMessage"
            @change="onProtoMessageChange"
            class="uk-input"
          />
        </div>
      </div>

      <button
        :disabled="loading"
        @click="handleSubmit"
        class="uk-button uk-button-primary"
        type="button"
      >
        Decode
      </button>
    </form>
  </div>
  <div v-if="decodedValue" class="uk-section">
    <div class="uk-container">
      <pre>{{ decodedValue }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import {
  IType,
  Namespace,
  ReflectionObject,
  Type,
  util,
  Root,
  INamespace,
} from "protobufjs";
import { defineComponent } from "vue";
import UIkit from "uikit";
import fs from "fs";

const Decoder = defineComponent({
  props: {
    directory: {
      type: String,
      default: "",
    },
  },

  created() {
    const root = new Root();
    try {
      const result = root.loadSync(this.getFiles(this.directory), {});
      this.jsonData = result.toJSON();
      this.protoData = result;
    } catch (error) {
      UIkit.notification(
        `<span uk-icon='icon: warning'></span> error on processing proto files`,
        {
          status: "danger",
          pos: "top-right",
        }
      );
    }
  },
  data() {
    return {
      chosenPackage: undefined as undefined | Namespace,
      chosenMessage: undefined as undefined | Type,
      protoMessage: "",
      decodedValue: "",
      loading: false,
      jsonData: {} as INamespace,
      protoData: undefined as Root | undefined,
      filesError: false,
    };
  },
  computed: {
    packages(): string[] {
      if (!this.jsonData.nested) {
        return [];
      }
      return Object.keys(this.jsonData.nested).reduce((result, elemKey) => {
        if (
          !this.jsonData.nested ||
          !this.jsonData.nested[elemKey] ||
          !(this.jsonData.nested[elemKey] as INamespace).nested
        ) {
          return result;
        }
        return [...result, elemKey];
      }, [] as string[]);
    },
    messagesData(): string[] {
      if (!this.chosenPackage?.name || !this.jsonData.nested) {
        return [];
      }
      const jsonDataChosenPackage = this.jsonData.nested[
        this.chosenPackage?.name
      ] as INamespace;
      return Object.keys(jsonDataChosenPackage.nested || {}).reduce(
        (result, elemKey) => {
          if (
            !jsonDataChosenPackage.nested ||
            !(jsonDataChosenPackage.nested[elemKey] as IType).fields
          ) {
            return result;
          }
          return [...result, elemKey];
        },
        [] as string[]
      );
    },
  },

  methods: {
    getFiles(dir: string, files_: string[] = []) {
      try {
        const files = fs.readdirSync(dir);
        for (var i in files) {
          var name = dir + "/" + files[i];
          if (fs.statSync(name).isDirectory()) {
            this.getFiles(name, files_);
          } else {
            const dividedName = name.split(".");
            if (dividedName[dividedName.length - 1] === "proto") {
              files_.push(name);
            }
          }
        }
        return files_;
      } catch (error) {
        this.filesError = true;
        UIkit.notification(
          `<span uk-icon='icon: warning'></span> error on fetching files for ${dir}`,
          {
            status: "danger",
            pos: "top-right",
          }
        );
      }
      return [];
    },

    onPackageChange(event: Event) {
      const packageName = (event.target as HTMLSelectElement).value;
      this.chosenPackage = this.protoData?.lookup(packageName) as Namespace;
    },
    onMessageChange(event: Event) {
      const messageName = (event.target as HTMLSelectElement).value;
      this.chosenMessage = this.protoData?.lookup([
        this.chosenPackage?.name || "",
        messageName,
      ]) as Type;
    },
    onProtoMessageChange(event: Event) {
      this.protoMessage = (event.target as HTMLInputElement).value;
    },
    handleSubmit() {
      this.loading = true;
      try {
        const buff = util.newBuffer(util.base64.length(this.protoMessage));
        util.base64.decode(this.protoMessage, buff, 0);
        const messageType = this.protoData?.lookup([
          this.chosenPackage?.name || "",
          this.chosenMessage?.name || "",
        ]) as Type;
        this.decodedValue = JSON.stringify(
          messageType.decode(buff).toJSON(),
          null,
          2
        );
      } catch (error) {
        UIkit.notification(
          "<span uk-icon='icon: warning'></span> error while decoding message",
          {
            status: "danger",
            pos: "top-right",
          }
        );
      }
      this.loading = false;
    },
  },
});

export default Decoder;
</script>