import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import AppDetail from './AppDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class AppIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            app_id: this.props.app.app_id
        });

        this.handleLoad();

        notification.on('notification_app_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_app_index_load', this);
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'app/fetch',
                data: {
                    app_id: this.props.form.getFieldValue('app_id'),
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
            url: '/app/system/list',
            data: {
                app_id: this.props.app.app_id,
                page_index: this.props.app.page_index,
                page_size: this.props.app.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'app/fetch',
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
                type: 'app/fetch',
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
                type: 'app/fetch',
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
        notification.emit('notification_app_detail_add', {});
    }

    handleEdit(app_id) {
        notification.emit('notification_app_detail_edit', {
            app_id: app_id
        });
    }

    handleDel(app_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/app/system/delete',
            data: {
                app_id: app_id,
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
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: 'app_name',
            dataIndex: 'app_name'
        }, {
            width: 250,
            title: 'app_id',
            dataIndex: 'app_id'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.app_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.app_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.app.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.app.page_index,
            pageSize: this.props.app.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">应用信息</div>
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
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="应用">
                                {
                                    getFieldDecorator('app_id', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入应用"/>
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
                       rowKey="app_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.app.list} pagination={pagination}
                       bordered/>
                <AppDetail/>
            </QueueAnim>
        );
    }
}

AppIndex.propTypes = {};

AppIndex = Form.create({})(AppIndex);

export default connect(({app}) => ({app}))(AppIndex);