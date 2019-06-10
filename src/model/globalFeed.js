import api from "../utils/requests";
export default {
  namespace: "globalFeed",
  state: {},
  effects: {
    *newFollow({ payload }, { call, put }) {
      const res = yield call(api.fetch, "post", "/follow/newFollow", payload);
      yield put({
        type: "changeStatus",
        payload: res
      });
      yield put({
        type: "user/getCurrentUser"
      })
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
      yield put({
        type: "user/getCurrentUser"
      })
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
      return { ...state, followed: payload };
    }
  }
};
