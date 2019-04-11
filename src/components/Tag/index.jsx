import React from "react";
import { Tag, Input, Tooltip, Icon } from "antd";
import styles from "./index.less";

export default class EditableTagGroup extends React.Component {
  state = {
    tags: [],
    colors:[],
    inputVisible: false,
    inputValue: ""
  };


  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    const {changeTag} = this.props
    this.setState({ tags });
    changeTag(tags)
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const {changeTag} = this.props
    const inputValue = state.inputValue;
    let tags = state.tags;
    let colors = state.colors;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
      colors.push(this.randomColor())
    }
    changeTag(tags)
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ""
    });
  };

  clear = () => {
    this.setState({
      colors:[],
      tags:[]
    })
  }

  saveInputRef = input => (this.input = input);

  randomColor = () => {
    const colorItem = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F"
    ];
    let color = "#";
    let random;
    for (let i = 0; i < 6; i++) {
      random = parseInt(Math.random() * 16);
      color += colorItem[random];
    }
    return color;
  };

  render() {
    const { tags, inputVisible, inputValue, colors } = this.state;
    const {showTitle} = this.props
    return (
      <div className={styles.main}>
        {showTitle?<h5 style={{ marginRight: 8, display: "inline" }}>选择你的标签:</h5>:null}
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              color={colors[index]}
              className={styles.tag}
              key={tag}
              closable={index !== 0}
              afterClose={() => this.handleClose(tag)}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: "#fff", borderStyle: "dashed" }}
          >
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}
