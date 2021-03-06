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

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      changeVisible,
      user: { currentUser }
    } = this.props;
    if (!!currentUser && prevProps.user.currentUser !== currentUser) {
      changeVisible();
    }
  }

  handleLoginSubmit = user => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/loginWithoutChangePage",
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
        <Login />
      </Modal>
    );
  }
}

export default LoginModal;
