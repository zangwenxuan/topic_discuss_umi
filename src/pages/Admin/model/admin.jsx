import request from "../../../utils/requests";
import { message } from "antd";
export default {
  namespace: "admin",
  state: { visible: true },
  effects: {
    *verityAdmin({ payload }, { call, put }) {
      const res = yield call(request.fetch, "post", "admin/verity", payload);
      if (!res) {
        message.error("通行证错误，请重新输入！");
        return;
      }
      yield put({
        type: "updateAdminStatus"
      });
    }
  },
  reducers: {
    updateAdminStatus(state, _) {
      return {
        ...state,
        visible: false
      };
    }
  }
};
