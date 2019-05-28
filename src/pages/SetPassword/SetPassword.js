import React, { Component } from "react";
import { Input, Steps, Row, Col, Form, Button, Alert, Icon } from "antd";
import { connect } from "dva";
import Link from "umi/link";
import styles from "./index.less";

const { Step } = Steps;

@connect(({ setPassword, user }) => ({ setPassword, user }))
class SetPassword extends Component {
  state = {
    count: 0,
    current: 0,
    captchaStatus: undefined,
    passwordStatus: undefined
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      setPassword: { captchaStatus, passwordStatus }
    } = this.props;
    if (prevProps.setPassword.captchaStatus !== captchaStatus) {
      if (captchaStatus === "ok") {
        this.setState({
          current: 1
        });
      }
      if(captchaStatus === "error"){
        this.setState({ captchaStatus: "error" });
      }
      if(passwordStatus !== prevProps.setPassword.passwordStatus){
        if(passwordStatus === "ok") {
          this.setState({
            current: 2
          })
        }
      }
    }
  }

  onGetCaptcha = () => {
    const { dispatch } = this.props;
    const email = this.props.form.getFieldValue("email");
    dispatch({ type: "setPassword/getCaptcha", payload: email });
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

  nextStep = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.setState({
      captchaStatus: undefined
    })
    this.props.form.validateFields((err, values) => {
      if (!err)
        dispatch({
          type: "setPassword/checkCaptcha",
          payload: values
        });
    });
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields }
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: "setPassword/submitPassword",
          payload: { password: values.password }
        });
      }
    });
    this.setState({
      current: 2
    });
  };

  Verity = mail => {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const { count, captchaStatus } = this.state;
    const mails = mail.split("@");
    const mailShort = `${mails[0].substring(0, 3)}***@${mails[1]}`;
    return (
      <div >
        <Form onSubmit={this.nextStep}>
          <Form.Item>
            <Input
              size={"large"}
              addonBefore={"邮箱地址"}
              disabled={true}
              value={mailShort}
            />
          </Form.Item>
          <Row gutter={8}>
            <Col span={15}>
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
            <Col span={9}>
              <Form.Item>
                <Button
                  block
                  disabled={count}
                  onClick={this.onGetCaptcha}
                  size="large"
                  style={{ textAlign: "center" }}
                >
                  {count ? (
                    `${count}s`
                  ) : (
                    <span style={{ fontSize: "13px" }}>获取验证码</span>
                  )}
                </Button>
              </Form.Item>
            </Col>
          </Row>
          {captchaStatus === "error" ? (
            <Form.Item><Alert message={"验证码错误，请重新输入！"} type={"error"} /></Form.Item>
          ) : null}
          <Button htmlType={"submit"} type={"primary"} block size={"large"}>
            下一步
          </Button>
        </Form>
      </div>
    );
  };

  SetPassword = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
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
              placeholder="新密码"
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
        <Form.Item>
          <Button block type={"primary"} htmlType={"submit"}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    );
  };

  success = () => {
    return (
      <div>
        <Alert
          description={
            <span>
              点<Link to={"/login"}>这里</Link>重新登录
            </span>
          }
          type="success"
          showIcon
          message={"您已成功修改密码!"}
        />
      </div>
    );
  };

  Content = ({ current }) => {
    const {user:{currentUser = {}}} = this.props
    if (current === 1) {
      return this.SetPassword();
    }
    if (current === 2) {
      return this.success();
    }
    return this.Verity(currentUser.email||"");
  };

  render() {
    const { current } = this.state;
    return (
      <div style={{ background: "#fff", height: "800px" ,width:"1200px"}}>
        <h1 className={styles.h1}>修改密码</h1>
        <Row style={{ height: "600px" }}>
          <Col offset={2} span={6}>
            <Steps
              className={styles.step}
              current={current}
              direction={"vertical"}
            >
              <Step key={1} title="验证身份" />
              <Step key={2} title="设置密码" />
              <Step key={3} title="修改成功" />
            </Steps>
          </Col>
          <Col span={16}>
            <div
              style={{
                width: "300px",
                margin: "0 auto",
                height: "400px",
                marginTop: "35%"
              }}
            >
              <this.Content current={current} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
const SetPassWordForm = Form.create({ name: "setPassword" })(SetPassword);
export default SetPassWordForm;
