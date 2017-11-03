import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message, Tooltip, Icon} from 'antd';

import RenaultShareDetail from './RenaultShareDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class RenaultShareIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.renault_share.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            user_name: this.props.renault_share.user_name
        });

        this.handleLoad();

        notification.on('notification_renault_share_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_renault_share_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'renault_share/fetch',
                    data: {
                        app_list: data
                    }
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            var app_id = this.props.form.getFieldValue('app_id');
            if (validate.isUndefined(app_id)) {
                app_id = '';
            }

            let user_name = this.props.form.getFieldValue('user_name');

            this.props.dispatch({
                type: 'renault_share/fetch',
                data: {
                    app_id: app_id,
                    user_name: user_name,
                    page_index: 1
                }
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/renault/share/list',
            data: {
                app_id: this.props.renault_share.app_id,
                user_name: this.props.renault_share.user_name,
                page_index: this.props.renault_share.page_index,
                page_size: this.props.renault_share.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'renault_share/fetch',
                    data: {
                        total: data.total,
                        list: data.list
                    }
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleChangeIndex(page_index) {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'renault_share/fetch',
                data: {
                    page_index: page_index
                }
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleChangeSize(page_index, page_size) {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'renault_share/fetch',
                data: {
                    page_index: page_index,
                    page_size: page_size
                }
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleAdd() {
        notification.emit('notification_renault_share_detail_add', {});
    }

    handleEdit(share_id) {
        notification.emit('notification_renault_share_detail_edit', {
            share_id: share_id
        });
    }

    handleDel(share_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/renault/share/delete',
            data: {
                share_id: share_id,
                system_version: system_version
            },
            success: function (data) {
                message.success(constant.success);

                this.handleLoad();
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleISTOP(share_id, system_version,is_top) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/renault/share/istop',
            data: {
                share_id: share_id,
                system_version: system_version,
                is_top:is_top
            },
            success: function (data) {
                message.success(constant.success);

                this.handleLoad();
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: true
                });
            }.bind(this)
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '会员昵称',
            dataIndex: 'user_name'
        }, {
            title: '会员头像',
            dataIndex: 'user_avatar',
            render: (text, record, index) => (
                text ? <span>
                  <img alt="example" style={{width: 83}} src={text}/>
                </span> : null
            )
        }, {
            width: 400,
            title: '说说',
            dataIndex: 'remark',
            render: (text, record, index) => (
                text ? <span>
                    {text.length > 30 ?
                        <span>
                            {text.substring(0, 30) + '...'}
                            <Tooltip placement="right" title={text}>
                                <Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>
                        : text
                    }

                </span>
                    : null
            )
        }, {
            title: '说说图片',
            dataIndex: 'share_image_list',
            render: (text, record, index) => (
                text && text[0] ? <span>
                  <img alt="example" style={{width: 83}} src={constant.host + text[0].file_path}/>
                </span> : null
            )
        }, {
            title: '分享数量',
            dataIndex: 'share_num'
        }, {
            title: '点赞次数',
            dataIndex: 'like_num'
        }, {
            title: '评论数量',
            dataIndex: 'comment_num'
        }, {
            title: '是否置顶',
            dataIndex: 'is_top',
            render: (text, record, index) => (
                <span>
                    {record.is_top ? "是" : "否"}
                </span>
            )
        }, {
            width: 160,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.share_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.share_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                             <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_top_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleISTOP.bind(this, record.share_id, record.system_version, true)}>
                    <a style={{display: record.is_top ? 'none' : 'inline'}}> {constant.top}</a>
                  </Popconfirm>

                    <Popconfirm title={constant.popconfirm_canceltop_title} okText={constant.popconfirm_ok}
                                cancelText={constant.popconfirm_cancel}
                                onConfirm={this.handleISTOP.bind(this, record.share_id, record.system_version,false)}>
                    <a  style={{display: record.is_top ? 'inline' : 'none'}}>{constant.canceltop}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.renault_share.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.renault_share.page_index,
            pageSize: this.props.renault_share.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">说说信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="plus-circle" size="default"
                                onClick={this.handleAdd.bind(this)}>{constant.add}</Button>
                    </Col>
                </Row>
                <Form key="1" className="content-search margin-top">
                    <Row>
                        {
                            constant.action === 'system' ?
                                <Col span={8}>
                                    <FormItem hasFeedback {...{
                                        labelCol: {span: 6},
                                        wrapperCol: {span: 18}
                                    }} className="content-search-item" label="应用名称">
                                        {
                                            getFieldDecorator('app_id', {
                                                initialValue: ''
                                            })(
                                                <Select allowClear placeholder="请选择应用">
                                                    {
                                                        this.props.renault_share.app_list.map(function (item) {
                                                            return (
                                                                <Option key={item.app_id}
                                                                        value={item.app_id}>{item.app_name}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                :
                                ''
                        }
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="会员昵称">
                                {
                                    getFieldDecorator('user_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入会员昵称"
                                               onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="share_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.renault_share.list} pagination={pagination}
                       bordered/>
                <RenaultShareDetail/>
            </QueueAnim>
        );
    }
}

RenaultShareIndex.propTypes = {};

RenaultShareIndex = Form.create({})(RenaultShareIndex);

export default connect(({renault_share}) => ({
    renault_share
}))(RenaultShareIndex);