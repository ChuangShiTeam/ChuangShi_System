import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import ExpressDetail from './ExpressDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class ExpressIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.express.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            express_no: this.props.express.express_no,
            express_receiver_name: this.props.express.express_receiver_name,
            express_sender_name: this.props.express.express_sender_name
        });

        this.handleLoad();

        notification.on('notification_express_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_express_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'express/fetch',
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
            let app_id = this.props.form.getFieldValue('app_id');
            if (validate.isUndefined(app_id)) {
                app_id = '';
            }

            let express_no = this.props.form.getFieldValue('express_no');
            let express_receiver_name = this.props.form.getFieldValue('express_receiver_name');
            let express_sender_name = this.props.form.getFieldValue('express_sender_name');

            this.props.dispatch({
                type: 'express/fetch',
                data: {
                    app_id: app_id,
                    express_no: express_no,
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
            url: '/express/' + constant.action + '/list',
            data: {
                app_id: this.props.express.app_id,
                express_no: this.props.express.express_no,
                express_receiver_name: this.props.express.express_receiver_name,
                express_sender_name: this.props.express.express_sender_name,
                page_index: this.props.express.page_index,
                page_size: this.props.express.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'express/fetch',
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
                type: 'express/fetch',
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
                type: 'express/fetch',
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

    handleView(express_id) {
        notification.emit('notification_express_detail_view', {
            express_id: express_id
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '快递单号',
            dataIndex: 'express_no'
        }, {
            title: '发货人',
            dataIndex: 'express_sender_name'
        }, {
            title: '收货人',
            dataIndex: 'express_receiver_name'
        }, {
            title: '状态',
            dataIndex: 'express_status'
        }, {
            width: 200,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleView.bind(this, record.express_id)}>查看</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.express.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.express.page_index,
            pageSize: this.props.express.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">快递单信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
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
                                                        this.props.express.app_list.map(function (item) {
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
                            }} className="content-search-item" label="快递单号">
                                {
                                    getFieldDecorator('express_no', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入快递单号" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="发货人">
                                {
                                    getFieldDecorator('express_sender_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入发货人" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="收货人">
                                {
                                    getFieldDecorator('express_receiver_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入收货人" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="express_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.express.list} pagination={pagination}
                       bordered/>
                <ExpressDetail/>
            </QueueAnim>
        );
    }
}

ExpressIndex.propTypes = {};

ExpressIndex = Form.create({})(ExpressIndex);

export default connect(({express}) => ({
    express
}))(ExpressIndex);