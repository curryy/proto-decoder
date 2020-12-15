import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import protobufjs from "protobufjs";

export interface State {
  protosData: protobufjs.Root[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state() {
    return {
      protosData: [],
    };
  },
  mutations: {
    clearProtosData(state) {
      state.protosData.length = 0;
    },
    pushProtoData(state, data) {
      state.protosData.push(data);
    },
  },
  actions: {
    clearProtosData({ commit }) {
      commit("clearProtosData");
    },
    pushProtoData({ commit }, data) {
      commit("pushProtoData", data);
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
