import React, { Component } from "react";
import { Alert, Form, Tabs } from "antd";
import Link from "umi/link";
import { Button, Icon, Input } from "antd";

import styles from "./index.less";
import { connect } from "dva";

@connect(({ user, loading }) => ({
  user,
  loginSubmitting: loading.effects["user/loginWithoutChangePage"]
}))
class LoginForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const user = { uid: values.userName, password: values.password };
        this.handleLoginSubmit(user);
      }
    });
  };
  handleLoginSubmit = user => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/loginWithoutChangePage",
      payload: user
    });
  };

  render() {
    const {
      loginSubmitting,
      form: { getFieldDecorator },
      user: { status }
    } = this.props;

    return (
      <div>
        <p style={{ textAlign: "center", fontSize: "30px" }}>登录</p>
        <Form onSubmit={this.handleSubmit} className="login-form">
          {status === "error" && !loginSubmitting && (
            <Alert
              style={{ marginBottom: 24 }}
              type={"error"}
              onClose={this.handleAlertClose}
              closable
              message={"用户名或密码错误！"}
            />
          )}
          <Form.Item>
            {getFieldDecorator("userName", {
              rules: [{ required: true, message: "请输入用户名或邮箱地址！" }]
            })(
              <Input
                size="large"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="用户名或邮箱地址"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入密码！" }]
            })(
              <Input
                size="large"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            {/*<a>忘记密码</a>*/}
            <Link to="/register" className={styles.login_forgot}>
              注册账号
            </Link>
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className={styles.submit_button}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(LoginForm);
