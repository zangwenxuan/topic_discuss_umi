import React, { Component } from "react";
import { Form, Button, Input, Icon, Alert } from "antd";
import Link from "umi/link";
import router from "umi/router";
import styles from "./Login.less";
import { connect } from "dva";

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects["user/checkUser"]
}))
class Login extends Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!!this.props.user.currentUser && this.props.user.currentUser !== prevProps.user.currentUser) {
      router.push("/content");
    }
  }

  componentDidMount() {
    if (!!this.props.user.currentUser) {
      router.push("/content");
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const user = { uid: values.userName, password: values.password };
        dispatch({
          type: "user/checkUser",
          payload: user
        });
      }
    });
  };

  renderMessage = () => (
    <Alert
      style={{ marginBottom: 24 }}
      message="用户名或密码错误，请重新输入"
      type="error"
      showIcon
    />
  );
  render() {
    const { getFieldDecorator } = this.props.form;
    const { user, submitting } = this.props;
    const form = (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {user.status === "error" && !submitting && this.renderMessage()}
        <Form.Item>
          {getFieldDecorator("userName", {
            rules: [{ required: true, message: "请输入用户名或邮箱地址！" }]
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
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
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          <a>忘记密码</a>
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
    );
    return <div className={styles.main}>{form}</div>;
  }
}
const LoginForm = Form.create({ name: "normal_login" })(Login);
export default LoginForm;
