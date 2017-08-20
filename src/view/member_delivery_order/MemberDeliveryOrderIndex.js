import React, {Component} from "react";
import {connect} from "dva";
import QueueAnim from "rc-queue-anim";
import {Row, Col, Button, Form, Select, Input, Table, Icon} from "antd";
import MemberDeliveryOrderDetail from "./MemberDeliveryOrderDetail";
import constant from "../../util/constant";
import notification from "../../util/notification";
import validate from "../../util/validate";
import http from "../../util/http";

class MemberDeliveryOrderIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.member_delivery_order.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            user_name: this.props.member_delivery_order.user_name,
            member_delivery_order_receiver_name: this.props.member_delivery_order.member_delivery_order_receiver_name
        });

        this.handleLoad();
        notification.on('notification_member_delivery_order_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_member_delivery_order_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'member_delivery_order/fetch',
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
            let member_delivery_order_receiver_name = this.props.form.getFieldValue('member_delivery_order_receiver_name');

            this.props.dispatch({
                type: 'member_delivery_order/fetch',
                data: {
                    app_id: app_id,
                    user_name: user_name,
                    member_delivery_order_receiver_name: member_delivery_order_receiver_name,
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
            url: '/member/delivery/order/' + constant.action + '/list',
            data: {
                app_id: this.props.member_delivery_order.app_id,
                user_name: this.props.member_delivery_order.user_name,
                member_delivery_order_receiver_name: this.props.member_delivery_order.member_delivery_order_receiver_name,
                page_index: this.props.member_delivery_order.page_index,
                page_size: this.props.member_delivery_order.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'member_delivery_order/fetch',
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
                type: 'member_delivery_order/fetch',
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
                type: 'member_delivery_order/fetch',
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

    handleView(member_delivery_order_id) {
        notification.emit('notification_member_delivery_order_detail_view', {
            member_delivery_order_id: member_delivery_order_id
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '上级会员（下单会员）',
            dataIndex: 'user_name',
            render: (text, record, index) => (
                <span>{record.user_name}({record.order_user_name})</span>
            )
        }, {
            title: '收货人',
            dataIndex: 'member_delivery_order_receiver_name',
            render: (text, record, index) => (
                <span>{record.member_delivery_order_receiver_name}({record.member_delivery_order_receiver_mobile})</span>
            )
        // }, {
        //     title: '收货人地址',
        //     dataIndex: 'member_delivery_order_receiver_address',
        //     render: (text, record, index) => (
        //         <span>
        //             {record.member_delivery_order_receiver_province}-
        //             {record.member_delivery_order_receiver_city}-
        //             {record.member_delivery_order_receiver_area}-
        //             {record.member_delivery_order_receiver_address}
        //         </span>
        //     )
        }, {
            title: '发货数量',
            dataIndex: 'member_delivery_order_total_quantity'
        }, {
            title: '发货金额',
            dataIndex: 'member_delivery_order_amount',
            render: (text, record, index) => (
                <span>￥{record.member_delivery_order_amount}</span>
            )

        }, {
            title: '付款',
            dataIndex: 'member_delivery_order_is_pay',
            render: (text, record, index) => (
                <div className="clearfix">
                    {record.member_delivery_order_is_pay ?
                        <Icon type="check-circle-o" style={{fontSize: 16, color: 'green'}}/>
                        :
                        <Icon type="close-circle-o" style={{fontSize: 16, color: 'red'}}/>
                    }
                </div>
            )
        }, {
            title: '总仓库代发',
            dataIndex: 'member_delivery_order_is_warehouse_deliver',
            render: (text, record, index) => (
                <div className="clearfix">
                    {record.member_delivery_order_is_warehouse_deliver ?
                        <Icon type="check-circle-o" style={{fontSize: 16, color: 'green'}}/>
                        :
                        <Icon type="close-circle-o" style={{fontSize: 16, color: 'red'}}/>
                    }
                </div>
            )
        // }, {
        //     title: '是否完成',
        //     dataIndex: 'member_delivery_order_is_complete',
        //     render: (text, record, index) => (
        //         <div className="clearfix">
        //             {record.member_delivery_order_is_complete ?
        //                 <Icon type="check-circle-o" style={{fontSize: 16, color: 'green'}}/>
        //                 :
        //                 <Icon type="close-circle-o" style={{fontSize: 16, color: 'red'}}/>
        //             }
        //         </div>
        //     )
        }, {
            title: '当前流程',
            dataIndex: 'member_delivery_order_flow',
            render: (text, record, index) => (
                <div className="clearfix">
                    {record.member_delivery_order_flow === "WAIT_SEND" ? "待发货" :
                        record.member_delivery_order_flow === "WAIT_WAREHOUSE_SEND" ? "待仓库发货" :
                            record.member_delivery_order_flow === "WAIT_RECEIVE" ? "待收货" :
                                record.member_delivery_order_flow === "COMPLETE" ? "已完成" : ""}
                </div>
            )
        }, {
            title: '创建时间',
            dataIndex: 'system_create_time'
        }, {
            width: 50,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleView.bind(this, record.member_delivery_order_id)}>查看</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.member_delivery_order.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.member_delivery_order.page_index,
            pageSize: this.props.member_delivery_order.page_size,
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
                                                        this.props.member_delivery_order.app_list.map(function (item) {
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
                                        <Input type="text" placeholder="请输入会员名称"
                                               onPressEnter={this.handleSearch.bind(this)}/>
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
                                    getFieldDecorator('member_delivery_order_receiver_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入收货人"
                                               onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="member_delivery_order_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.member_delivery_order.list} pagination={pagination}
                       bordered/>
                <MemberDeliveryOrderDetail/>
            </QueueAnim>
        );
    }
}

MemberDeliveryOrderIndex.propTypes = {};

MemberDeliveryOrderIndex = Form.create({})(MemberDeliveryOrderIndex);

export default connect(({member_delivery_order}) => ({
    member_delivery_order
}))(MemberDeliveryOrderIndex);