import api from "../../utils/requests";
import { sendMessage } from "../../services/user";

export default {
  namespace: "personal",
  state: {},
  effects: {
    *deleteFeed({payload},{call,put}){
      yield call(api.fetch,"delete","/content/deleteFeed",payload)
      yield put({
        type: "feed/selectMyFeed"
      });
    },
    *initPersonalCenter(action, { call, put }) {
      const res = yield call(api.fetch, "get", "/follow/getFollow");
      yield put({
        type: "feed/selectMyFeed"
      });
      if (res.code === 0) {
        yield put({
          type: "updateFollowNum",
          payload: res.res
        });
      }
    },
    *getMyFollowing(action, { call, put }) {
      const res = yield call(api.fetch, "get", "user/getMyFollowing");
      if (res.code === 0) {
        yield put({
          type: "updateFollow",
          payload: res.res
        });
      }
    },
    *getMyFollower(action, { call, put }) {
      const res = yield call(api.fetch, "get", "user/getMyFollower");
      if (res.code === 0) {
        yield put({
          type: "updateFollow",
          payload: res.res
        });
      }
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
