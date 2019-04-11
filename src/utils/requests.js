import fetch from "dva/fetch";
/*import downloadjs from "downloadjs";*/
const BASE_URL = "/api";

function checkStatus(response) {
  const { status, statusText } = response;
  if (status >= 200 && status < 300) {
    return response;
  }
  const err = new Error(`${status} ${statusText}`);
  err.code = status;
  console.log("请求错误")
  throw err;
  console.log("请求错误")
}

function parseJSON(response) {
  return response.json();
}

function checkCode(response) {
  const { code, error, trace } = response;
  if (code === 0) {
    return response;
  }
  const err = new Error(error);
  err.code = code;
  err.trace = trace;
  return err;
 // throw err;
}

const request = {
  fetch(method, url, body) {
    let options = {
      method: method,
      headers: new Headers({
        "Content-Type": "application/json"
      })
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    return fetch(`${BASE_URL}${url}`, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(checkCode)
      .catch(e => console.log(`捕捉到返回值错误：${e}`));
  },

  head(method, url) {
    let options = {
      method: method,
      headers: new Headers({
        "Content-Type": "application/json"
      })
    };
    return fetch(`${BASE_URL}${url}`, options).then(checkStatus);
  },

  get(url) {
    return this.fetch("get", url);
  },
  post(url, payload) {
    return this.fetch("post", url, payload);
  },

  put(url, payload) {
    return this.fetch("put", url, payload);
  },

  delete(url) {
    return this.fetch("delete", url);
  },

/*
  download(url, filename, mimetype) {
    let options = {
      method: "get",
      headers: new Headers({
        "Content-Type": "application/json"
      })
    };
    return fetch(`${BASE_URL}${url}`, options)
      .then(checkStatus)
      .then(resp => resp.blob())
      .then(blob => {
        downloadjs(blob, filename, mimetype);
      });
  },
*/

  upload(url, uploadFile) {
    const formData = new FormData();
    console.log(uploadFile)
    uploadFile.forEach(file => {
      formData.append("importFile", file);
    });
    let options = {
      method: "POST",
      body: formData
    };
    return fetch(`${BASE_URL}${url}`, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(checkCode);
  },
};

export default request;
