import fetch from "dva/fetch";
import router from "umi/router";
/*import downloadjs from "downloadjs";*/
const BASE_URL = "/api";

function checkStatus(response) {
  const { status, statusText } = response;
  if (status >= 200 && status < 300) {
    return response;
  }
  const err = new Error(`${status} ${statusText}`);
  err.code = status;
  throw err;
}

function parseJSON(response) {
  return response.json();
}

function checkCode(response) {
  const { code, error, trace, res } = response;
  if (code === 0) {
    return res;
  }
  const err = new Error(error);
  err.code = code;
  err.trace = trace;
  throw err;
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
    const token = localStorage.getItem("token");
    if (!!token) {
      options.headers.append("token", token);
    }
    return fetch(`${BASE_URL}${url}`, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(checkCode)
      .catch(e => {
        if (e.code === 401) {
          // @HACK
          /* eslint-disable no-underscore-dangle */
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
          return;
        }
        if (e.code === 404) {
          router.push("/exception/404");
          return;
        }
        if (e.code === 500) {
          router.push("/exception/500");
          return;
        }
        if (e.code === 403) {
          router.push("/exception/403");
        }
      });
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
    console.log(uploadFile);
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
  }
};

export default request;
