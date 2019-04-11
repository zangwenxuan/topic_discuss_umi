import api from "../utils/requests";
export default {
  namespace: "global",
  state: {},
  effects: {
    *newFollow({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "post",
        "/follow/newFollow",
        payload
      );
      if (res.code === 0) {
        yield put({
          type: "changeStatus",
          payload: res.res
        });
      }
    },
    *cancelFollow({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "delete",
        "follow/cancelFollow",
        payload
      );
      if (res.code === 0) {
        yield put({
          type: "changeStatus",
          payload: res.res
        });
      }
    },
    *queryUser({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `/follow/queryUserCard?uid=${payload}`
      );
      if (res.code === 0) {
        yield put({
          type: "showUserCard",
          payload: res.res
        });
      }
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
