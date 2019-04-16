import React, { PureComponent, Fragment } from "react";
import ReactDOM from "react-dom";
import { Icon, Tabs, Badge, Spin } from "antd";
import classNames from "classnames";
import HeaderDropdown from "../HeaderDropdown";
import List from "./NoticeList";
import styles from "./index.less";

const { TabPane } = Tabs;

export default class NoticeIcon extends PureComponent {
  static Tab = TabPane;

  static defaultProps = {
    onItemClick: () => {},
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    onClear: () => {},
    onViewMore: () => {},
    loading: false,
    clearClose: false,
    locale: {
      emptyText: "No notifications",
      clear: "Clear",
      viewMore: "More"
    },
    emptyImage:
      "https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
  };

  state = {
    visible: false
  };

  hiddenMenu = item => {
    this.onItemClick(item);
    this.popover.click();
  };

  onItemClick = (item, tabProps) => {
    console.log(item);
    const { handleChatClick } = this.props;
    const { clickClose } = item;
    if (item.type === 10) {
      handleChatClick(item.uid);
    }
    /*onItemClick(item, tabProps);
    if (clickClose) {
      this.popover.click();
    }*/
    this.popover.click();
  };

  onClear = name => {
    const { onClear, clearClose } = this.props;
    onClear(name);
    if (clearClose) {
      this.popover.click();
    }
  };

  onTabChange = tabType => {
    const { onTabChange } = this.props;
    onTabChange(tabType);
  };

  onViewMore = (item) => {
    const { onViewMore } = this.props;
    onViewMore(item);
  };

  getNotificationBox() {
    const { children, loading, locale } = this.props;
    if (!children) {
      return null;
    }
    const panes = React.Children.map(children, child => {
      const {
        list,
        title,
        count,
        emptyText,
        emptyImage,
        showClear,
        showViewMore,
        onCloseClick,
        clearLoading
      } = child.props;
      const len = list && list.length ? list.length : 0;
      const msgCount = count || count === 0 ? count : len;
      const localeTitle = locale[title] || title;
      const tabTitle =
        msgCount > 0
          ? `${localeTitle} (${msgCount > 99 ? "99+" : msgCount})`
          : localeTitle;
      return (
        <TabPane tab={tabTitle} key={title}>
          <List
            clearLoading={clearLoading}
            data={list}
            emptyImage={emptyImage}
            emptyText={emptyText}
            locale={locale}
            onCloseClick={onCloseClick}
            onClear={() => this.onClear(title)}
            onClick={item => this.onItemClick(item, child.props)}
            onItemClick={this.hiddenMenu}
            onViewMore={item => this.onViewMore(item)}
            showClear={showClear}
            showViewMore={showViewMore}
            title={title}
          />
        </TabPane>
      );
    });
    return (
      <Fragment>
        <Spin spinning={loading} delay={0}>
          <Tabs className={styles.tabs} onChange={this.onTabChange}>
            {panes}
          </Tabs>
        </Spin>
      </Fragment>
    );
  }

  handleVisibleChange = visible => {
    const { onPopupVisibleChange } = this.props;
    this.setState({ visible });
    onPopupVisibleChange(visible);
  };

  render() {
    const { className, count, popupVisible, bell } = this.props;
    const { visible } = this.state;
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = this.getNotificationBox();
    const NoticeBellIcon = bell || <Icon type="bell" className={styles.icon} />;
    const trigger = (
      <span className={classNames(noticeButtonClass, { opened: visible })}>
        <Badge
          count={count}
          style={{ boxShadow: "none" }}
          className={styles.badge}
        >
          {NoticeBellIcon}
        </Badge>
      </span>
    );
    if (!notificationBox) {
      return trigger;
    }
    const popoverProps = {};
    if ("popupVisible" in this.props) {
      popoverProps.visible = popupVisible;
    }
    return (
      <HeaderDropdown
        placement="bottomRight"
        trigger={["click"]}
        overlay={notificationBox}
        overlayClassName={styles.popover}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        {...popoverProps}
        ref={node => (this.popover = ReactDOM.findDOMNode(node))} // eslint-disable-line
      >
        {trigger}
      </HeaderDropdown>
    );
  }
}
