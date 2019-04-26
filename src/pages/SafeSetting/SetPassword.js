import React, { Component } from "react";
import { Input, Steps, Row, Col, Form, Button, Alert } from "antd";
import styles from "./index.less";

const { Step } = Steps;

class SetPassword extends Component {
  state = {
    count: 0
  };
  onGetCaptcha = () => {
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
    const { getFieldDecorator } = this.props.form;
    const { count, captchaAvailable } = this.state;
    return (
      <div style={{ background: "#fff", height: "800px" }}>
        <Row style={{ height: "600px" }}>
          <Col offset={2} span={6}>
            <Steps className={styles.step} current={0} direction={"vertical"}>
              <Step key={1} title="验证身份" />
              <Step key={2} title="设置密码" />
              <Step key={3} title="修改成功" />
            </Steps>
          </Col>
          <Col span={16}>
            <div style={{ height: "400px", marginTop: "35%" }}>
              <div style={{ width: "300px", margin: "0 auto" }}>
                <Form>
                  <Form.Item> <Input
                    size={"large"}
                    addonBefore={"邮箱地址"}
                    disabled={true}
                    value={"1119468712@qq.com"}
                  /></Form.Item>
                  <Row gutter={8}>
                    <Col span={16}>
                      <Form.Item>
                        {getFieldDecorator("captcha", {
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
                        block
                        disabled={count}
                        onClick={this.onGetCaptcha}
                        size="large"
                        style={{ width: "100%",textAlign:"center",padding:0}}
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
                  <Form.Item><Button type={"primary"} block size={"large"}>下一步</Button></Form.Item>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
const SetPassWordForm = Form.create({ name: "normal_login" })(SetPassword);
export default SetPassWordForm;
