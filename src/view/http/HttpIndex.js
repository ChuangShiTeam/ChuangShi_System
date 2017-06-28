import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Table, message} from 'antd';

import HttpDetail from './HttpDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class HttpIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            app_id: this.props.http.app_id
        });

        this.handleLoad();

        this.handleLoadApp();

        notification.on('notification_http_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_http_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'http/fetch',
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

            this.props.dispatch({
                type: 'http/fetch',
                data: {
                    app_id: app_id,
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
            url: '/http/' + constant.action + '/list',
            data: {
                app_id: this.props.http.app_id,
                page_index: this.props.http.page_index,
                page_size: this.props.http.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'http/fetch',
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
                type: 'http/fetch',
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
                type: 'http/fetch',
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
        notification.emit('notification_http_detail_add', {});
    }

    handleEdit(http_id) {
        notification.emit('notification_http_detail_edit', {
            http_id: http_id
        });
    }

    handleDel(http_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/http/' + constant.action + '/delete',
            data: {
                http_id: http_id,
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

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '地址',
            dataIndex: 'http_url'
        }, {
            width: 90,
            title: '状态',
            dataIndex: 'http_code'
        }, {
            width: 90,
            title: '平台',
            dataIndex: 'http_platform'
        }, {
            width: 90,
            title: '版本',
            dataIndex: 'http_version'
        }, {
            width: 90,
            title: '耗时(毫秒)',
            dataIndex: 'http_run_time'
        }, {
            width: 140,
            title: '创建时间',
            dataIndex: 'system_create_time'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.http_id)}>{constant.find}</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.http.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.http.page_index,
            pageSize: this.props.http.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">请求信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="primary" icon="search" size="default"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        {/*<Button type="primary" icon="plus-circle" size="default"*/}
                                {/*onClick={this.handleAdd.bind(this)}>{constant.add}</Button>*/}
                    </Col>
                </Row>
                <Form key="1" className="content-search margin-top">
                    <Row>
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
                                                this.props.http.app_list.map(function (item) {
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
                        <Col span={8}>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="http_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.http.list} pagination={pagination}
                       bordered/>
                <HttpDetail/>
            </QueueAnim>
        );
    }
}

HttpIndex.propTypes = {};

HttpIndex = Form.create({})(HttpIndex);

export default connect(({http}) => ({http}))(HttpIndex);