import React, { Component } from "react";
import { Form, Button, Input, Icon, Row, Col, Alert } from "antd";
import Link from "umi/link";
import styles from "./Register.less";
import { connect } from "dva";
import router from "umi/router";

@connect(({ user }) => ({
  user
}))
class Register extends Component {
  constructor(props) {
    super(props);
    const emailChanged = false;
  }
  state = {
    count: 0,
    confirmDirty: false,
    captchaButton: true
  };

  componentDidMount() {
    if (!!this.props.user.currentUser) {
      router.push("/");
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      user: { emailAvailable }
    } = this.props;
    if (
      !!this.props.user.currentUser &&
      this.props.user.currentUser !== prevProps.user.currentUser
    ) {
      router.push("/");
    }
    const form = this.props.form;
    if (prevProps.user.nameAvailable !== this.props.user.nameAvailable) {
      form.validateFields(["nickname"], { force: true });
    }
    if (prevProps.user.emailAvailable !== emailAvailable) {
      form.validateFields(["email"], { force: true });
      if (emailAvailable === "ok") {
        this.handleGetCaptcha();
      }
    }
  }

  handleAlertClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/changeCaptcha"
    });
  };

  validateName = (rule, value, callBack) => {
    const {
      dispatch,
      user: { nameAvailable }
    } = this.props;
    const regex = /^.{1,15}$/;
    if (value && !regex.test(value)) {
      callBack("昵称长度为1-15");
    } else if (value && regex.test(value)) {
      dispatch({
        type: "user/checkName",
        payload: value
      });
      if (nameAvailable === "error") {
        callBack("用户名已被注册!");
      }
    }
    callBack();
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      console.log(err);
      if (!err) {
        const { confirm, captcha, ...user } = values;
        this.handleAlertClose();
        dispatch({
          type: "user/register",
          payload: { captcha, user }
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateEmail = (rule, value, callback) => {
    const {
      user: { emailAvailable }
    } = this.props;
    const regex = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    if (value && !regex.test(value)) {
      callback("邮箱地址格式错误！");
      this.setState({
        captchaButton: true
      });
    } else {
      if (!this.emailChanged && emailAvailable === "error") {
        callback("该邮箱地址已被注册！");
        this.setState({
          captchaButton: true
        });
      } else {
        this.setState({
          captchaButton: false
        });
      }
    }
    callback();
  };

  handleEmailChange = () => {
    this.emailChanged = true;
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
    const regex = /^(?![0-9!@#$%^&*.]+$)(?![a-zA-Z!@#$%^&*.]+$)[a-zA-Z\d!@#$%^&*.]{8,16}$/;
    if (value && !regex.test(value)) {
      callback(
        "密码长度为8-16，且必须包含字母和数字（其余可包含的特殊字符有 !@#$%^&*.）"
      );
    }
    callback();
  };

  onGetCaptcha = () => {
    const { dispatch } = this.props;
    const email = this.props.form.getFieldValue("email");
    this.emailChanged = false;
    dispatch({ type: "user/checkEmail", payload: email });
  };

  handleGetCaptcha = () => {
    const { dispatch } = this.props;
    const email = this.props.form.getFieldValue("email");
    dispatch({ type: "user/getCaptcha", payload: email });
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

  render() {
    const { count, captchaButton } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      user: { captchaAvailable }
    } = this.props;
    const form = (
      <Form
        hideRequiredMark
        onSubmit={this.handleSubmit}
        className={styles.form}
      >
        <Form.Item>
          {getFieldDecorator("nickname", {
            rules: [
              { required: true, message: "请输入昵称!" },
              { validator: this.validateName }
            ]
          })(<Input size="large" placeholder="昵称" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("email", {
            rules: [
              {
                required: true,
                message: "请输入邮箱!"
              },
              {
                validator: this.validateEmail
              }
            ]
          })(
            <Input
              onChange={this.handleEmailChange}
              size="large"
              placeholder="邮箱"
            />
          )}
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
          <Col span={18}>
            <Form.Item>
              {getFieldDecorator("captcha", {
                rules: [
                  {
                    required: true,
                    message: "请输入验证码!"
                  }
                ]
              })(<Input size="large" placeholder="输入验证码" />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button
              disabled={captchaButton || count}
              onClick={this.onGetCaptcha}
              size="large"
              style={{ width: "100%" }}
            >
              {count ? `${count}s` : "获取验证码"}
            </Button>
          </Col>
        </Row>
        {captchaAvailable === "error" && (
          <Alert
            type={"error"}
            onClose={this.handleAlertClose}
            closable
            message={"验证码错误！"}
          />
        )}
        <Form.Item label={" "}>
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
        <div style={{ height: "200px" }} />
        <p style={{ fontSize: "50px", textAlign: "center" }}>注册</p>
        {form}
      </div>
    );
  }
}
const RegisterForm = Form.create({ name: "normal_login" })(Register);
export default RegisterForm;
