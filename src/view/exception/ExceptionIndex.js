import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, message} from 'antd';

import ExceptionDetail from './ExceptionDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class ExceptionIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.exception.app_id
            });

            this.handleLoadApp();
        }

        this.handleLoad();

        notification.on('notification_exception_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_exception_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'exception/fetch',
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

            var http_id = this.props.form.getFieldValue('http_id');

            this.props.dispatch({
                type: 'exception/fetch',
                data: {
                    app_id: app_id,
                    http_id: http_id,
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
            url: '/exception/' + constant.action + '/list',
            data: {
                app_id: this.props.exception.app_id,
                page_index: this.props.exception.page_index,
                page_size: this.props.exception.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'exception/fetch',
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
                type: 'exception/fetch',
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
                type: 'exception/fetch',
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
        notification.emit('notification_exception_detail_add', {});
    }

    handleEdit(exception_id) {
        notification.emit('notification_exception_detail_edit', {
            exception_id: exception_id
        });
    }

    handleDel(exception_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/exception/' + constant.action + '/delete',
            data: {
                exception_id: exception_id,
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
            title: '异常',
            dataIndex: 'exception_content'
        }, {
            width: 100,
            title: '是否处理',
            dataIndex: 'exception_is_confirm'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.exception_id)}>{constant.find}</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.exception.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.exception.page_index,
            pageSize: this.props.exception.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">异常信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="primary" icon="search" size="default"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
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
                                                        this.props.exception.app_list.map(function (item) {
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
                            }} className="content-search-item" label="请求编号">
                                {
                                    getFieldDecorator('http_id', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请求编号"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="exception_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.exception.list} pagination={pagination}
                       bordered/>
                <ExceptionDetail/>
            </QueueAnim>
        );
    }
}

ExceptionIndex.propTypes = {};

ExceptionIndex = Form.create({})(ExceptionIndex);

export default connect(({exception}) => ({exception}))(ExceptionIndex);