import React, { Component } from "react";
import { Modal } from "antd";
import { connect } from "dva";
import styles from "./index.less";

import Login from "../LoginForm";

@connect(({ user, loading }) => ({
  user,
  loginSubmitting: loading.effects["user/loginWithoutChangePage"]
}))
class LoginModal extends Component {
  static defaultProps = {
    changeVisible: () => {}
  };
  handleLoginSubmit = user => {
    const { dispatch, changeVisible } = this.props;
    dispatch({
      type: "user/loginWithoutChangePage",
      payload: user
    });
    changeVisible();
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

export default LoginModal;
