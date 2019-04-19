import React, { Component } from "react";
import { Modal } from "antd";
import { connect } from "dva";
import styles from "./index.less";

import Login from "../LoginForm";

@connect(({ user, loading }) => ({
  user,
  loginSubmitting: loading.effects["user/checkUser"]
}))
class LoginModal extends Component {
  handleLoginSubmit = user => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/checkUser",
      payload: user
    });
  };
  render() {
    const {
      user: { status },
      loginSubmitting,
      onCancel,
      visible
    } = this.props;
    return (
      <Modal
        className={styles.modal}
        centered
        destroyOnClose
        keyboard
        mask
        maskClosable={true}
        onCancel={onCancel}
        title={false}
        visible={visible}
        footer={false}
      >
        <Login
          status={status}
          submitting={loginSubmitting}
          onSubmit={this.handleLoginSubmit}
        />
      </Modal>
    );
  }
}

export default LoginModal
