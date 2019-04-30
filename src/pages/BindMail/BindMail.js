import React, { Component } from "react";
import { Input, Steps, Row, Col, Form, Button, Alert, Icon } from "antd";
import { connect } from "dva";
import styles from "./index.less";
import Link from "../SetPassword/SetPassword";

const { Step } = Steps;

@connect(({ bindMail, user }) => ({ bindMail, user }))
class BindMail extends Component {
  constructor(props){
    super(props)
    const emailChanged = false
  }
  state = {
    current: 0,
    baseMailCount: 0,
    newMailCount: 0,
    captchaStatus: undefined,
    emailCaptchaStatus: undefined,
    captchaButton:true
  };

  componentWillUnmount() {
    const {dispatch} = this.props
    dispatch({
      type: "bindMail/clearStatus"
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      bindMail: { captchaStatus, emailAvailable, emailCaptchaStatus },
      form
    } = this.props;
    if (captchaStatus !== prevProps.bindMail.captchaStatus) {
      if (captchaStatus === "ok") {
        this.setState({
          current: 1
        });
      }
      if (captchaStatus === "error") {
        this.setState({
          captchaStatus: "error"
        });
      }
    }
    if (emailCaptchaStatus !== prevProps.bindMail.emailCaptchaStatus ){
      if(emailCaptchaStatus === "ok"){
        this.setState({
          current: 2
        })
      }
      if( emailCaptchaStatus === "error"){
        this.setState({
          emailCaptchaStatus: "error"
        });
      }
    }
    if(emailAvailable !== prevProps.bindMail.emailAvailable){
      form.validateFields(["email"], { force: true });
      if (emailAvailable === "ok") {
        this.handleGetCaptcha();
      }
    }
  }

  validateEmail = (rule, value, callback) => {
    const {
      bindMail: { emailAvailable }
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

  handleEmailChanged = () => {
    this.emailChanged = true
  }

  onGetCaptcha = () => {
    const { dispatch } = this.props;
    const email = this.props.form.getFieldValue("email");
    dispatch({ type: "setPassword/getCaptcha", payload: email });
    let baseMailCount = 59;
    this.setState({ baseMailCount });
    this.interval = setInterval(() => {
      baseMailCount -= 1;
      this.setState({ baseMailCount });
      if (baseMailCount === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  handleGetCaptcha = () => {
    const { dispatch } = this.props;
    const email = this.props.form.getFieldValue("email");
    dispatch({ type: "bind/getCaptcha", payload: email });
    let newMailCount = 59;
    this.setState({ newMailCount });
    this.interval = setInterval(() => {
      newMailCount -= 1;
      this.setState({ newMailCount });
      if (newMailCount === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  onGetEmailCaptcha = () => {
    const {dispatch} = this.props
    const mail = this.props.form.getFieldValue("email");
    this.emailChanged = false;
    dispatch({ type: "bindMail/checkEmail", payload: mail });
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
          type: "bindMail/checkCaptcha",
          payload: values
        });
    });
  };

  Verity = mail => {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const { baseMailCount, captchaStatus } = this.state;
    const mails = mail.split("@");
    const mailShort = `${mails[0].substring(0, 3)}***@${mails[1]}`;
    return (
      <div>
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
                  disabled={baseMailCount}
                  onClick={this.onGetCaptcha}
                  size="large"
                  style={{ textAlign: "center" }}
                >
                  {baseMailCount ? (
                    `${baseMailCount}s`
                  ) : (
                    <span style={{ fontSize: "13px" }}>获取验证码</span>
                  )}
                </Button>
              </Form.Item>
            </Col>
          </Row>
          {captchaStatus === "error" ? (
            <Form.Item><Alert  message={"验证码错误，请重新输入！"} type={"error"} /></Form.Item>
          ) : null}
          <Button htmlType={"submit"} type={"primary"} block size={"large"}>
            下一步
          </Button>
        </Form>
      </div>
    );
  };

  handleSubmitMail = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.setState({
      emailCaptchaStatus: undefined
    });
    this.props.form.validateFields((err, values) => {
      if (!err)
        dispatch({
          type: "bindMail/bindMail",
          payload: {email:values.email,captcha:values.newCaptcha}
        });
    });
  }

  bindMail = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const { newMailCount, emailCaptchaStatus } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSubmitMail}>
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [
                {
                  required: true,
                  message: "请输入邮箱"
                },
                {
                  validator: this.validateEmail
                }
              ]
            })(<Input onChange={this.handleEmailChanged} size={"large"} placeholder={"新的邮箱地址"} />)}
          </Form.Item>
          <Row gutter={8}>
            <Col span={15}>
              <Form.Item>
                {getFieldDecorator("newCaptcha", {
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
                  disabled={newMailCount}
                  onClick={this.onGetEmailCaptcha}
                  size="large"
                  style={{ textAlign: "center" }}
                >
                  {newMailCount ? (
                    `${newMailCount}s`
                  ) : (
                    <span style={{ fontSize: "13px" }}>获取验证码</span>
                  )}
                </Button>
              </Form.Item>
            </Col>
          </Row>
          {emailCaptchaStatus === "error" ? (
            <Form.Item><Alert message={"验证码错误，请重新输入！"} type={"error"} /></Form.Item>
          ) : null}
          <Button htmlType={"submit"} type={"primary"} block size={"large"}>
            下一步
          </Button>
        </Form>
      </div>
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
    const {user:{currentUser}} = this.props
    if (current === 1) {
      return this.bindMail();
    }
    if (current === 2) {
      return this.success();
    }
    return this.Verity(currentUser.email);
  };

  render() {
    const { current } = this.state;
    return (
      <div style={{ background: "#fff", height: "800px" }}>
        <h1 className={styles.h1}>更换邮箱</h1>
        <Row style={{ height: "600px" }}>
          <Col offset={2} span={6}>
            <Steps
              className={styles.step}
              current={current}
              direction={"vertical"}
            >
              <Step key={1} title="验证身份" />
              <Step key={2} title="绑定邮箱" />
              <Step key={3} title="绑定成功" />
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

export default Form.create({ name: "bindMail" })(BindMail);
