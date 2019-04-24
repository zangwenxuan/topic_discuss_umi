import api from "../../utils/requests";
import { sendMessage } from "../../services/user";

export default {
  namespace: "personal",
  state: {},
  effects: {
    *deleteFeed({ payload }, { call, put }) {
      yield call(api.fetch, "delete", "/content/deleteFeed", payload);
      yield put({
        type: "feed/selectMyFeed"
      });
    },
    *initPersonalCenter({ payload }, { call, put }) {
      yield put({
        type: "getPersonalFollow",
        payload
      });
      yield put({
        type: "feed/selectPersonalFeed",
        payload
      });
    },
    *getPersonalFollow({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `/follow/getPersonalFollow?uid=${payload}`
      );
      yield put({
        type: "updateFollowNum",
        payload: res.res
      });
    },
    *getPersonalFollowing({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `user/getPersonalFollowing?uid=${payload}`
      );
      yield put({
        type: "updateFollow",
        payload: res.res
      });
    },
    *getPersonalFollower({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `user/getPersonalFollower?uid=${payload}`
      );
      yield put({
        type: "updateFollow",
        payload: res.res
      });
    },
    *sendMessage({ payload }, { call }) {
      yield call(sendMessage, payload);
    }
  },
  reducers: {
    updateFollowNum(state, { payload }) {
      return {
        ...state,
        followerNum: payload.followerNum,
        masterNum: payload.masterNum
      };
    },
    updateFollow(state, { payload }) {
      return { ...state, userList: payload };
    }
  }
};
