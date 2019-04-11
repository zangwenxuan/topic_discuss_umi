import request from "../utils/requests";
export async function sendMessage(params) {
  return request.post("/websocket/send", params);
}
