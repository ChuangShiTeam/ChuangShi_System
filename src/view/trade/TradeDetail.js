import React, {Component} from "react";
import {connect} from "dva";
import {
    Modal,
    Form,
    Row,
    Col,
    Spin,
    Button,
    Select,
    message,
    Steps,
    Table,
    Popconfirm,
    Icon,
    Timeline,
    Tooltip
} from "antd";
import constant from "../../util/constant";
import notification from "../../util/notification";
import http from "../../util/http";
import {coverEval} from '../../util/function';
import ExpressDetail from "./ExpressDetail";

class TradeDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            trade_id: '',
            system_version: '',
            trade: {},
            tradeProductSkuList: [],
            tradeCommossionList: [],
            expressList: []
        }
    }

    componentDidMount() {
        notification.on('notification_trade_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_trade_detail_load', this, function (data) {
            this.handleLoad();
        });

        notification.on('notification_trade_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                trade_id: data.trade_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_trade_detail_add', this);

        notification.remove('notification_trade_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/trade/' + constant.action + '/find',
            data: {
                trade_id: this.state.trade_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.trade.app_id
                    });
                }

                this.setState({
                    trade: data.trade,
                    tradeProductSkuList: data.tradeProductSkuList,
                    tradeCommossionList: data.tradeCommossionList,
                    expressList: data.expressList,
                    system_version: data.trade.system_version
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    handleAdd() {
        notification.emit('notification_express_detail_add', {trade: this.state.trade});
    }

    handleDel(express_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/trade/' + constant.action + '/delete',
            data: {
                express_id: express_id,
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

    handleDelivery() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/trade/delivery',
            data: {
                trade_id: this.state.trade_id,
                system_version: this.state.system_version
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

    handleCancel() {
        this.setState({
            is_load: false,
            is_show: false,
            action: '',
            trade_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;
        const Step = Steps.Step;

        const columnsProductSku = [{
            title: '商品名称',
            dataIndex: 'product_name'
        }, {
            title: '商品数量',
            dataIndex: 'product_sku_quantity'
        }, {
            title: '商品金额',
            dataIndex: 'product_sku_amount',
            render: (text, record, index) => (
                <span>
                    ￥{record.product_sku_amount}
                </span>
            )
        }];

        const columnsCommossion = [{
            title: '商品名称',
            dataIndex: 'product_name'
        }, {
            title: '用户名称',
            dataIndex: 'member_name'
        }, {
            title: '用户等级',
            dataIndex: 'member_level_name'
        }, {
            title: '商品分成比例',
            dataIndex: 'product_sku_commission',
            render: (text, record, index) => (
                <span>
                    {record.product_sku_commission}%
                </span>
            )
        }, {
            title: '分成金额',
            dataIndex: 'product_sku_commission_amount',
            render: (text, record, index) => (
                <span>
                    ￥{record.product_sku_commission_amount}
                </span>
            )
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
                    ({record.express_receiver_tel}/
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
        }, {
            title: '寄件费（运费）',
            dataIndex: 'express_cost'
        }, {
            title: '运费是否支付',
            dataIndex: 'express_is_pay',
            render: (text, record, index) => (
                <span>
                    {
                        text ?
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
                    <Icon type="question-circle-o"/>
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
                    this.state.trade.trade_flow === 'WAIT_SEND' ?
                        <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                                    cancelText={constant.popconfirm_cancel}
                                    onConfirm={this.handleDel.bind(this, record.express_id, record.system_version)}>
                            <a>{constant.del}</a>
                        </Popconfirm> : null
                }

                </span>
            )
        }];

        return (
            <Modal title={<h3>订单详情</h3>}
                   maskClosable={false} width={document.documentElement.clientWidth - 200}
                   className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={this.handleCancel.bind(this)}>确定</Button>
                   ]}
            >
                <Spin spinning={this.state.is_load}>
                    <Steps current={1}>
                        <Step status={this.state.trade.trade_flow==='WAIT_PAY'?"process ":"wait"} title="待付款"
                              description=""/>
                        <Step status={this.state.trade.trade_flow==='WAIT_SEND'?"process ":"wait"} title="待发货"
                              description=""/>
                        <Step status={this.state.trade.trade_flow==='WAIT_RECEIVE'?"process ":"wait"} title="待收货"
                              description=""/>
                        <Step status={this.state.trade.trade_flow==='COMPLETE'?"process ":"wait"} title="已完成"
                              description=""/>
                    </Steps>
                    <br/>
                    <h2>订单基本信息</h2>
                    <br/>
                    <form>
                        {
                            constant.action === 'system' ?
                                <Row>
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="content-search-item" label="应用名称">
                                            {
                                                getFieldDecorator('app_id', {
                                                    rules: [{
                                                        required: true,
                                                        message: constant.required
                                                    }],
                                                    initialValue: ''
                                                })(
                                                    <Select allowClear placeholder="请选择应用">
                                                        {
                                                            this.props.trade.app_list.map(function (item) {
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
                                </Row>
                                :
                                ''
                        }
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="用户">
                                    <span>{this.state.trade.user_name}</span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="订单号">
                                    <span>{this.state.trade.trade_number}</span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="订单状态">
                                    <span>
                                        {this.state.trade.trade_status ? "正常" : "异常"}
                                    </span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人">
                                    <span>{this.state.trade.trade_receiver_name}
                                        ( {this.state.trade.trade_receiver_mobile} ) </span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货地址">
                                    <span>
                                        {this.state.trade.trade_receiver_province}-
                                        {this.state.trade.trade_receiver_city}-
                                        {this.state.trade.trade_receiver_area}-
                                        {this.state.trade.trade_receiver_address}
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="订单商品数量">
                                    <span>
                                        {this.state.trade.trade_product_quantity}
                                    </span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="订单金额">
                                    <span>￥{this.state.trade.trade_product_amount}</span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="运费金额">
                                    <span>
                                      ￥{this.state.trade.trade_express_amount}
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="折扣金额">
                                    <span>￥{this.state.trade.trade_discount_amount}</span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="货到付款">
                                    <span>{this.state.trade.trade_deliver_pattern === 'CASH_ON_DELIVERY'?'是':'否'}</span>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="订单备注">
                                    <span>{this.state.trade.trade_message}</span>
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                    <br/>
                    <h2>订单商品列表</h2>
                    <Table rowKey=""
                           className="margin-top"
                           columns={columnsProductSku}
                           dataSource={this.state.tradeProductSkuList} pagination={false}
                           bordered/>
                    <br/>
                    <h2>订单分成列表</h2>
                    <Table rowKey=""
                           className="margin-top"
                           columns={columnsCommossion}
                           dataSource={this.state.tradeCommossionList} pagination={false}
                           bordered/>
                    <br/>
                    <br/>
                    {
                        this.state.trade.trade_flow !== 'WAIT_PAY' ?
                            <span>
                                <Row>
                                    <Col span={8}>
                                        <h2>订单快递地址</h2>
                                    </Col>
                                    {
                                        this.state.trade.trade_flow === 'WAIT_SEND' ?
                                            <Col span={16} className="content-button">
                                                <Button type="primary" icon="plus-circle" size="default"
                                                        className="margin-right"
                                                        onClick={this.handleAdd.bind(this)}>填写快递单</Button>
                                                <Button type="primary" icon="plus-circle" size="default"
                                                        loading={this.state.is_load}
                                                        onClick={this.handleDelivery.bind(this)}>已完成订单发货</Button>
                                            </Col> : null
                                    }

                                </Row>
                                <Table
                                    rowKey={record => record.express_id}
                                    className="margin-top"
                                    columns={columnsExpress}
                                    dataSource={this.state.expressList} pagination={false}
                                    bordered/>
                                <ExpressDetail/>
                            </span> : null
                    }
                </Spin>
            </Modal>
        );
    }
}

TradeDetail.propTypes = {};

TradeDetail = Form.create({})(TradeDetail);

export default connect(({trade}) => ({trade}))(TradeDetail);