import api from "../../utils/requests";
import {sendMessage} from "../../services/user";

export default {
  namespace: "websocket",
  state: {},
  effects: {
    *sendMessage({ payload }, { call }) {
      yield call(sendMessage,payload);
    }
  },
  reducers: {}
};
