import React, { Component } from "react";
import { Button, Row, Col, Input } from "antd";
import styles from "./index.less";

const TextArea = Input.TextArea;

export default class Editor extends Component {
  state = {
    value: ""
  };
  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };
  handleSubmit= (value)=>{
    const {onSubmit} = this.props
    onSubmit(value)
    this.setState({
      value:''
    })
  }
  render() {
    const { value } = this.state;
    const { submitting, placeholder } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.editor}>
        <Row gutter={6} >
          <Col span={22}>
            <TextArea rows={3} onChange={this.onChange} value={value} placeholder={placeholder} autoFocus/>
          </Col>
          <Col span={2} className={styles.submitCol}>
            <Button
              loading={submitting}
              onClick={this.handleSubmit.bind(this, value)}
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
