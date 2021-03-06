import React, { Component } from "react";
import { Table, Input, Button, Icon, Popconfirm, Divider } from "antd";
import Highlighter from "react-highlight-words";
import { connect } from "dva";
import moment from "moment";
import "moment/locale/zh-cn";
import Link from "umi/link";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
moment.locale("zh-cn");

@connect(({ feedManager }) => ({ feedManager }))
class FeedManager extends Component {
  state = {
    searchText: ""
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "feedManager/selectAll"
    });
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (dataIndex === "releaseTime") {
        return moment(record[dataIndex])
          .format(dateFormat)
          .toString()
          .includes(value);
      }
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={
          dataIndex === "releaseTime"
            ? moment(text)
                .format(dateFormat)
                .toString()
            : text.toString()
        }
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  deleteFeed = feedId => {
    const { dispatch } = this.props;
    dispatch({
      type: "feedManager/deleteFeed",
      payload: { feedId }
    });
  };

  render() {
    const {
      feedManager: { feedList = [] }
    } = this.props;
    const columns = [
      {
        title: "帖子Id",
        dataIndex: "feedId",
        key: "feedId",
        width: "15%",
        ...this.getColumnSearchProps("feedId")
      },
      {
        title: "作者",
        dataIndex: "nickname",
        key: "nickname",
        width: "15%",
        ...this.getColumnSearchProps("nickname")
      },
      {
        title: "发布时间",
        dataIndex: "releaseTime",
        key: "releaseTime",
        width: "25%",
        sorter: (a, b) => a.releaseTime - b.releaseTime,
        ...this.getColumnSearchProps("releaseTime")
      },
      {
        title: "收藏数",
        dataIndex: "keepNum",
        key: "keepNum",
        width: "10%",
        sorter: (a, b) => a.keepNum - b.keepNum
      },
      {
        title: "点赞数",
        dataIndex: "likeNum",
        key: "likeNum",
        width: "10%",
        sorter: (a, b) => a.likeNum - b.likeNum
      },
      {
        title: "评论数",
        dataIndex: "commentNum",
        key: "commentNum",
        width: "10%",
        sorter: (a, b) => a.commentNum - b.commentNum
      },
      {
        title: "Action",
        key: "action",
        render: record => (
          <div>
            <Link to={`/details/${record.feedId}`}>查看</Link>丨
            <Popconfirm
              onConfirm={() => this.deleteFeed(record.feedId)}
              title={"是否确认删除？"}
              okText={"确定"}
              cancelText={"取消"}
            >
              <a href="javascript:;">删除</a>
            </Popconfirm>
          </div>
        )
      }
    ];
    return (
      <div>
        <Divider orientation="left">当前帖子数量：{feedList.length}</Divider>
        <Table
          rowKey={record => record.feedId}
          style={{ border: "1px solid #3933333d", backgroundColor: "#fff" }}
          columns={columns}
          dataSource={feedList}
        />
      </div>
    );
  }
}

export default FeedManager;
