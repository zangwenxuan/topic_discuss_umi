import api from "../../utils/requests";
export default {
  namespace: "chatMsg",
  state: {},
  effects: {
    *getAllMessage({ payload }, { call, put }) {
      const url = `/chat/getMsg?toUserId=${payload}`;
      const res = yield call(api.fetch, "get", url);
      yield put({
        type: "user/getChatNotice"
      });
      yield put({
        type: "showMessage",
        payload: res
      });
    },
    *sendMessage({ payload }, { call, put }) {
      const res = yield call(api.fetch, "post", "/chat/sendMsg", payload);
      yield put({
        type: "showMessage",
        payload: res
      });
    }
  },
  reducers: {
    showMessage(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
