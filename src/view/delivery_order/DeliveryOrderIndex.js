import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table} from 'antd';

import DeliveryOrderDetail from './DeliveryOrderDetail';
import MemberSend from './MemberSend';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class DeliveryOrderIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.delivery_order.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            user_name: this.props.delivery_order.user_name,
            delivery_order_receiver_name: this.props.delivery_order.delivery_order_receiver_name
        });

        this.handleLoad();
        notification.on('notification_delivery_order_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_delivery_order_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'delivery_order/fetch',
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

            let user_name = this.props.form.getFieldValue('user_name');
            let delivery_order_receiver_name = this.props.form.getFieldValue('delivery_order_receiver_name');

            this.props.dispatch({
                type: 'delivery_order/fetch',
                data: {
                    app_id: app_id,
                    user_name: user_name,
                    delivery_order_receiver_name: delivery_order_receiver_name,
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
            url: '/delivery/order/' + constant.action + '/list',
            data: {
                app_id: this.props.delivery_order.app_id,
                user_name: this.props.delivery_order.user_name,
                delivery_order_receiver_name: this.props.delivery_order.delivery_order_receiver_name,
                page_index: this.props.delivery_order.page_index,
                page_size: this.props.delivery_order.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'delivery_order/fetch',
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
                type: 'delivery_order/fetch',
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
                type: 'delivery_order/fetch',
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

    handleSend() {
        notification.emit('notification_member_send', {});
    }

    handleView(delivery_order_id) {
        notification.emit('notification_delivery_order_detail_view', {
            delivery_order_id: delivery_order_id
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '会员名称',
            dataIndex: 'user_name'
        }, {
            title: '收货人',
            dataIndex: 'delivery_order_receiver_name'
        }, {
            title: '发货数量',
            dataIndex: 'delivery_order_total_quantity'
        }, {
            title: '发货金额',
            dataIndex: 'delivery_order_amount'
        }, {
            title: '状态',
            dataIndex: 'delivery_order_flow',
            render: (text, record, index) => (
                <span>
                    {
                        text === 'WAIT_SEND'?'待发货':text === 'WAIT_RECEIVE'?'待收货':text === 'COMPLETE'?'已完成':text === 'CANCEL'?'已取消':null
                    }
                </span>
            )
        }, {
            width: 150,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleView.bind(this, record.delivery_order_id)}>查看</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.delivery_order.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.delivery_order.page_index,
            pageSize: this.props.delivery_order.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">会员发货单信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="plus-circle" size="default"
                                onClick={this.handleSend.bind(this)}>会员发货</Button>
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
                                                        this.props.delivery_order.app_list.map(function (item) {
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
                            }} className="content-search-item" label="会员名称">
                                {
                                    getFieldDecorator('user_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入会员名称" onPressEnter={this.handleSearch.bind(this)}/>
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
                                    getFieldDecorator('delivery_order_receiver_name', {
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
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.delivery_order.list} pagination={pagination}
                       bordered/>
                <DeliveryOrderDetail/>
                <MemberSend/>
            </QueueAnim>
        );
    }
}

DeliveryOrderIndex.propTypes = {};

DeliveryOrderIndex = Form.create({})(DeliveryOrderIndex);

export default connect(({delivery_order}) => ({
    delivery_order
}))(DeliveryOrderIndex);