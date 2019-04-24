import api from "../utils/requests";
export default {
  namespace: "global",
  state: {},
  effects: {
    *newFollow({ payload }, { call, put }) {
      const res = yield call(api.fetch, "post", "/follow/newFollow", payload);
      yield put({
        type: "changeStatus",
        payload: res
      });
    },
    *cancelFollow({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "delete",
        "/follow/cancelFollow",
        payload
      );
      yield put({
        type: "changeStatus",
        payload: res
      });
    },
    *queryUser({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `/follow/queryUserCard?uid=${payload}`
      );
      yield put({
        type: "showUserCard",
        payload: res
      });
    }
  },
  reducers: {
    showUserCard(state, { payload }) {
      return { ...state, ...payload };
    },
    changeStatus(state, { payload }) {
      return { ...state, isFollowed: payload };
    }
  }
};
