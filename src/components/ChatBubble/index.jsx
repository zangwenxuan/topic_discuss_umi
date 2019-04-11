import React from "react";
import styles from "./index.less";
import {Avatar, Divider} from "antd";
import moment from "moment";
import "moment/locale/zh-cn";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
moment.locale("zh-cn");

export default function chatBubble({ message, avatar, isSelf, lastMessage, time }) {
  return (
    <div className={isSelf ? styles.rightContainer : styles.leftContainer}>
      {time - lastMessage > 300000 && <div className={styles.time}><span className={styles.time}>{moment(time).format(dateFormat)}</span></div>}
      <Avatar src={`http://localhost:8080/pic/${avatar}`} className={styles.avatar} />
      <div className={styles.triangle} />
      <span className={styles.msg}>{message}</span>
    </div>
  );
}
