import React,{Component} from "react";
import styles from "./index.less"
import {Input,Button} from "antd"

const Search = Input.Search;

export default class SearchPage extends Component {
  render() {
    return (
      <div className={styles.main}>
        <div className={styles.searchInput}>
          <Search
          placeholder="搜索圈子或者用户"
          onSearch={value => console.log(value)}
        /></div>
      </div>
    );
  }
}
