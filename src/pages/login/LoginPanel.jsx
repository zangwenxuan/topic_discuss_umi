import React, { Component } from "react";
import { Form, Button, Input, Icon, Checkbox,message,Alert} from "antd";
import { withRouter } from "react-router";
import Link from "umi/link"
import styles from "./Login.less";
import { connect } from "dva";

class LoginPanel extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const {checkUser} = this.props
    this.props.form.validateFields((err, values) => {
      if(!err){
        const user = {uid:values.userName,password:values.password}
        checkUser(user);
      }
    });
  };

  renderMessage = () => (
    <Alert style={{ marginBottom: 24 }} message='用户名或密码错误，请重新输入' type="error" showIcon />
  );
  render() {
    const { getFieldDecorator } = this.props.form;
    const {user, submitting} =this.props
    const form = (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {
          user.status === 'error'&&!submitting&&this.renderMessage()
      }
        <Form.Item>
          {getFieldDecorator("userName", {
            rules: [{ required: true, message: "Please input your username!" }]
          })(
            <Input
              size='large'
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              size='large'
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          {/*{getFieldDecorator("remember", {
            valuePropName: "checked",
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}*/}
          <a>忘记密码</a>
          <Link to="/register" className={styles.login_forgot} >
            注册账号
          </Link>

        </Form.Item>
        <Form.Item>
          <Button
            size='large'
            type="primary"
            htmlType="submit"
            className={styles.submit_button}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
    return <div className={styles.main}><div style={{height:"300px"}}></div>{form}</div>;
  }
}
const LoginForm = Form.create({ name: "normal_login" })(LoginPanel);
function mapStateToProps({user,loading}) {
  return {
    user,
    submitting:loading.effects['user/checkUser']
  };
}
function mapDispatchToProps(dispatch) {
  return {
    checkUser: data => {
      dispatch({
        type: "user/checkUser",
        payload:data
      });
    }
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginForm)
);
