import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  Icon,
  Checkbox,
  message,
  Alert,
  Row,
  Col
} from "antd";
import Link from "umi/link";
import styles from "./Register.less";
import { connect } from "dva";

class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: "",
    prefix: "86"
  };
  handleSubmit = e => {
    e.preventDefault();
    const { checkUser } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const user = { uid: values.userName, password: values.password };
        checkUser(user);
      }
    });
  };
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("两次输入的密码不匹配!!");
    } else {
      callback();
    }
  };
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    const regex = /^.*(?=.{6,15})(?=.*\d)(?=.*[a-z]{1,}).*$/;
    if (value && !regex.test(value)) {
      callback("密码长度为8-15，且必须包含大小写字母,数字以及特殊字符");
    }
    callback();
  };
  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
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
    const { count } = this.state;
    const { getFieldDecorator } = this.props.form;
    const form = (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {}
        <Form.Item>
          {getFieldDecorator("nickname", {
            rules: [{ required: true, message: "请输入昵称!" }]
          })(<Input size="large" placeholder="昵称" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("email", {
            rules: [{ required: true, message: "请输入邮箱!" }]
          })(<Input size="large" placeholder="邮箱" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "请输入密码!"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              size="large"
              type="password"
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "请确认密码!"
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              size="large"
              type="password"
              placeholder="确认密码"
              onBlur={this.handleConfirmBlur}
            />
          )}
        </Form.Item>
        <Row gutter={8}>
          <Col span={16}>
            <Form.Item>
              {getFieldDecorator("Captcha", {
                rules: [
                  {
                    required: true,
                    message: "请确认验证码!"
                  }
                ]
              })(<Input size="large" placeholder="输入验证码" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button
              disabled={count}
              onClick={this.onGetCaptcha}
              size="large"
              style={{ width: "100%" }}
            >
              {count ? `${count}s` : "获取验证码"}
            </Button>
          </Col>
        </Row>
        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.submit}
          >
            注册
          </Button>
          <Link to="/login" className={styles.login}>
            使用已有账号登录
          </Link>
        </Form.Item>
      </Form>
    );
    return (
      <div className={styles.main}>
        <div style={{ height: "300px" }} />
        {form}
      </div>
    );
  }
}
const RegisterForm = Form.create({ name: "normal_login" })(Register);
export default RegisterForm;
