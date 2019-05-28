import React, { Component } from "react";
import { Button, Row, Col, Input, message } from "antd";
import styles from "./index.less";

const TextArea = Input.TextArea;

export default class Editor extends Component {
  state = {
    value: "",
    count: 0
  };
  onChange = e => {
    this.setState({
      value: e.target.value,
      count: this.state.count +1
    });
  };
  handleSubmit = value => {
    const { onSubmit } = this.props;
    if (!value) {
      message.error("回复内容不能为空！");
      return;
    }
    onSubmit(value);
    if (!sessionStorage.getItem("isLogin")) {
      return;
    }
    this.setState({
      value: ""
    });
  };
  render() {
    const { value } = this.state;
    const { submitting, placeholder } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.editor}>
          <Row gutter={6}>
            <Col span={21}>
              <TextArea
                rows={3}
                onChange={this.onChange}
                value={value}
                placeholder={placeholder}
                autoFocus
              />
            </Col>
            <Col span={3} className={styles.submitCol}>
              <Button
                block
                loading={submitting}
                onClick={() => this.handleSubmit(value)}
                className={styles.submit}
                type="primary"
              >
                发送
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
