import React, {Component} from 'react';
import {Modal, Form, Row, Col, Spin, Button, Table, Steps, Icon, Tooltip, Timeline, Popconfirm, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import {coverEval} from '../../util/function';
import WarehouseMemberDeliveryOrderExpress from './WarehouseMemberDeliveryOrderExpress';
import WarehouseMemberDeliveryOrderDeliver from './WarehouseMemberDeliveryOrderDeliver';

class WarehouseMemberDeliveryOrderDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            member_delivery_order_id: '',
            system_version: '',
            is_direct_deliver: false,
            member_delivery_order: {},
            member_delivery_order_product_sku_list: [],
            member_delivery_order_express_list: []
        }
    }

    componentDidMount() {
        notification.on('notification_warehouse_member_delivery_order_detail_view', this, function (data) {
            this.setState({
                is_show: true,
                member_delivery_order_id: data.member_delivery_order_id
            }, function () {
                this.handleLoadDeliveryOrder();
            });
        });
        notification.on('notification_warehouse_member_delivery_order_detail_view_load', this, function (data) {
            this.handleLoadDeliveryOrder();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_warehouse_member_delivery_order_detail_view', this);
        notification.remove('notification_warehouse_member_delivery_order_detail_view_load', this);

    }

    handleLoadDeliveryOrder() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/member/delivery/order/' + constant.action + '/find',
            data: {
                member_delivery_order_id: this.state.member_delivery_order_id
            },
            success: function (data) {
                let member_delivery_order_express_list = [];
                if (!data.is_direct_deliver) {
                    member_delivery_order_express_list = data.member_delivery_order_express_list;
                }
                this.setState({
                    is_direct_deliver: data.is_direct_deliver,
                    member_delivery_order: data.member_delivery_order,
                    member_delivery_order_product_sku_list: data.member_delivery_order_product_sku_list,
                    member_delivery_order_express_list: member_delivery_order_express_list
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    handleDeleteExpress(express_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/member/delivery/order/' + constant.action + '/express/delete',
            data: {
                member_delivery_order_id: this.state.member_delivery_order_id,
                express_id: express_id,
                system_version: system_version
            },
            success: function (data) {
                message.success(constant.success);

                this.handleLoadDeliveryOrder();
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleDeliver() {
        notification.emit('notification_warehouse_member_delivery_order_deliver', {
            member_delivery_order: this.state.member_delivery_order
        });
    }

    handleCancel() {
        this.setState({
            is_load: false,
            is_show: false,
            action: '',
            member_delivery_order_id: '',
            system_version: '',
            is_direct_deliver: false,
            member_delivery_order: {},
            member_delivery_order_product_sku_list: [],
            member_delivery_order_express_list: []
        });

        this.props.form.resetFields();
        notification.emit('notification_warehouse_member_delivery_order_index_load', {});
    }

    handleAddExpress() {
        notification.emit('notification_warehouse_member_delivery_order_express', {member_delivery_order: this.state.member_delivery_order});
    }

    render() {
        const FormItem = Form.Item;
        const Step = Steps.Step;

        const columnsProductSku = [{
            width: 150,
            title: '商品名称',
            dataIndex: 'product_name'
        }, {
            width: 150,
            title: '数量',
            dataIndex: 'product_sku_quantity'
        }];

        const columnsExpress = [{
            title: '快递公司编码',
            dataIndex: 'express_shipper_code'
        }, {
            title: '快递单号',
            dataIndex: 'express_no'
        }, {
            title: '收货人',
            dataIndex: 'express_receiver_name',
            render: (text, record, index) => (
                <span>
                    {record.express_receiver_name}
                    ({record.express_receiver_tel?record.express_receiver_tel + '/':null}
                    {record.express_receiver_mobile})
                </span>
            )
        }, {
            title: '收货详细地址',
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                {record.express_receiver_province}-
                    {record.express_receiver_city}-
                    {record.express_receiver_area}-
                    {record.express_receiver_address}
            </span>
            )
        },{
            title: '寄件费（运费）',
            dataIndex: 'express_cost'
        }, {
            title: '运费是否支付',
            dataIndex: 'express_is_pay',
            render: (text, record, index) => (
                <span>
                    {
                        text?
                            <Icon type="check-circle-o" style={{fontSize: 16, color: 'green'}}/>
                            :
                            <Icon type="close-circle-o" style={{fontSize: 16, color: 'red'}}/>
                    }
                </span>
            )
        }, {
            title: '运费支付方式',
            dataIndex: 'express_pay_way'
        }, {
            title: '物流信息',
            dataIndex: 'express_traces',
            render: (text, record, index) => {
                let express_trace = [{
                    'AcceptStation': '暂无物流信息'
                }];
                if (text) {
                    express_trace = coverEval(text);
                }
                let title = <Timeline style={{marginTop: '10px'}}>
                    {
                        express_trace.map(function (item, index) {
                            return (
                                <Timeline.Item key={index}>
                                    {item.AcceptStation}
                                    <p></p >
                                    {item.AcceptTime}
                                </Timeline.Item>
                            )
                        })
                    }
                </Timeline>
                return (<Tooltip placement="topLeft" title={title}>
                    <Icon type="question-circle-o" />
                </Tooltip>)
            }
        }, {
            title: '状态',
            dataIndex: 'express_flow'
        }, {
            title: '备注',
            dataIndex: 'express_remark'
        }, {
            width: 50,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                {
                    this.state.member_delivery_order.member_delivery_order_flow === 'WAIT_WAREHOUSE_SEND'?
                        <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                                    cancelText={constant.popconfirm_cancel}
                                    onConfirm={this.handleDeleteExpress.bind(this, record.express_id, record.system_version)}>
                            <a>{constant.del}</a>
                        </Popconfirm>: null
                }

                </span>
            )
        }];
        console.log('member_delivery_order', this.state.member_delivery_order);
        console.log('is_direct_deliver', this.state.is_direct_deliver);
        return (
            <Modal title={<h3>会员发货单详情</h3>} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>
                   ]}
            >
                <Spin spinning={this.state.is_load}>
                    <Steps current={1}>
                        <Step status={this.state.member_delivery_order.member_delivery_order_flow === 'WAIT_WAREHOUSE_SEND' ? "process " : "wait"} title="待发货"
                              description=""/>
                        <Step status={this.state.member_delivery_order.member_delivery_order_flow === 'WAIT_RECEIVE' ? "process " : "wait"} title="待收货"
                              description=""/>
                        <Step status={this.state.member_delivery_order.member_delivery_order_flow === 'COMPLETE' ? "process " : "wait"} title="已完成"
                              description=""/>
                    </Steps>
                    <form>
                        <br/>
                        <h2>发货单信息</h2>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="会员名称">
                                    <span>{this.state.member_delivery_order.user_name}</span>
                                </FormItem>
                            </Col>
                            {
                                this.state.is_direct_deliver ?
                                    null
                                    :
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="form-item" label="收货人">
                                <span>{this.state.member_delivery_order.member_delivery_order_receiver_name}
                                    ( {this.state.member_delivery_order.member_delivery_order_receiver_mobile} ) </span>
                                        </FormItem>
                                    </Col>
                            }
                            {
                                this.state.is_direct_deliver?
                                    null
                                    :
                                <Col span={8}>
                                    <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货地址">
                                    <span>
                                        {this.state.member_delivery_order.member_delivery_order_receiver_province}-
                                        {this.state.member_delivery_order.member_delivery_order_receiver_city}-
                                        {this.state.member_delivery_order.member_delivery_order_receiver_area}-
                                        {this.state.member_delivery_order.member_delivery_order_receiver_address}
                                    </span>
                                    </FormItem>
                                </Col>
                            }
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="发货总数量">
                                    <span>
                                        {this.state.member_delivery_order.member_delivery_order_total_quantity}
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="发货金额">
                                    <span>
                                        {this.state.member_delivery_order.member_delivery_order_amount}
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="是否支付">
                                    <span>
                                        {this.state.member_delivery_order.member_delivery_order_is_pay?'是':'否'}
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="是否直接发货">
                                    <span>
                                        {this.state.is_direct_deliver?'是':'否'}
                                    </span>
                                </FormItem>
                            </Col>
                        </Row>
                        <br/>
                        <h2>发货明细列表</h2>
                        <Table
                            rowKey="product_sku_id"
                            className="margin-top"
                            loading={this.state.is_load} columns={columnsProductSku}
                            dataSource={this.state.member_delivery_order_product_sku_list} pagination={false}
                            bordered/>
                        <br/>
                        {
                            this.state.is_direct_deliver?
                                <span>
                                {
                                    this.state.member_delivery_order.member_delivery_order_flow === 'WAIT_WAREHOUSE_SEND'?
                                    <Row>
                                        <Col span={8}></Col>
                                        <Col span={16} className="content-button">
                                            <Button type="primary" icon="plus-circle" size="default"
                                                    loading={this.state.is_load}
                                                    onClick={this.handleDeliver.bind(this)}>仓库发货</Button>
                                        </Col>
                                    </Row>:null
                                }
                                </span>
                                :
                                <span>
                                    <Row>
                                        <Col span={8}>
                                            <h2>快递信息</h2>
                                        </Col>
                                        {
                                            this.state.member_delivery_order.member_delivery_order_flow === 'WAIT_WAREHOUSE_SEND'?
                                                <Col span={16} className="content-button">
                                                    <Button type="primary" icon="plus-circle" size="default" className="margin-right"
                                                            onClick={this.handleAddExpress.bind(this)}>填写快递单</Button>
                                                    <Button type="primary" icon="plus-circle" size="default"
                                                            loading={this.state.is_load}
                                                            onClick={this.handleDeliver.bind(this)}>仓库发货</Button>
                                                </Col>: null
                                        }
                                    </Row>
                                    <Table
                                        rowKey={record => record.express_id}
                                        className="margin-top"
                                        columns={columnsExpress}
                                        dataSource={this.state.member_delivery_order_express_list} pagination={false}
                                        bordered/>
                                    <WarehouseMemberDeliveryOrderExpress/>
                                </span>
                        }
                        <WarehouseMemberDeliveryOrderDeliver/>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

WarehouseMemberDeliveryOrderDetail.propTypes = {};

WarehouseMemberDeliveryOrderDetail = Form.create({})(WarehouseMemberDeliveryOrderDetail);

export default WarehouseMemberDeliveryOrderDetail;