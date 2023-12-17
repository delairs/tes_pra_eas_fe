// store.js
import { createStore } from "vuex";

export default createStore({
  state: {
    currGroupID: "",
    JoinGroupID: "",
    // inisialisasi dengan string kosong
    // ... state lainnya ...
  },
  mutations: {
    // ... mutations lainnya ...
    setCurrGroupID(state, newGroupID) {
      state.currGroupID = newGroupID;
    },
    setJoinGroupID(state, newJoinGroupID) {
      state.JoinGroupID = newJoinGroupID;
    },
  },
  actions: {
    // ... actions lainnya ...
    updateCreatedGroup({ commit }, newGroupID) {
      // Lakukan operasi lain jika diperlukan
      commit("setCurrGroupID", newGroupID);
    },
    updateJoinGroupID({ commit }, newJoinGroupID) {
      // Lakukan operasi lain jika diperlukan
      commit("setJoinGroupID", newJoinGroupID);
    },
  },
  getters: {
    // ... getters lainnya ...
    computedCurrGroupID(state) {
      // Misalnya, tambahkan manipulasi data atau operasi lain jika diperlukan
      return state.currGroupID;
    },
    computedJoinGroupID(state) {
      return state.JoinGroupID;
    },
  },
});
