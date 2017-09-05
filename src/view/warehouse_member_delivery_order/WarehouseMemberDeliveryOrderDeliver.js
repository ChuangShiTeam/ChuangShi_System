import React, {Component} from 'react';
import {Modal, Form, Row, Col, Spin, Button, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class WarehouseMemberDeliveryOrderDeliver extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            member_delivery_order: {},
            warehouse_list: []
        }
    }

    componentDidMount() {
        notification.on('notification_warehouse_member_delivery_order_deliver', this, function (data) {
            this.setState({
                is_show: true,
                action: 'warehouse/deliver',
                member_delivery_order: data.member_delivery_order
            });
        });
        this.handleLoadWarehouse();
    }

    componentWillUnmount() {
        notification.remove('notification_warehouse_member_delivery_order_deliver', this);

    }

    handleLoadWarehouse() {
        http.request({
            url: '/warehouse/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.setState({
                    warehouse_list: data
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            this.setState({
                is_load: true
            });
            values.member_delivery_order_id = this.state.member_delivery_order.member_delivery_order_id;
            http.request({
                url: '/member/delivery/order/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_warehouse_member_delivery_order_detail_view_load', {});

                    this.handleCancel();
                }.bind(this),
                complete: function () {
                    this.setState({
                        is_load: false
                    });
                }.bind(this)
            });
        });
    }

    handleCancel() {
        this.setState({
            is_load: false,
            is_show: false,
            action: '',
            member_delivery_order: {}
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;
        console.log(this.state.warehouse_list);
        return (
            <Modal title={<h3>仓库发货</h3>} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={this.handleSubmit.bind(this)}>确定</Button>
                   ]}
            >
                <Spin spinning={this.state.is_load}>
                    <form>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="content-search-item" label="仓库名称">
                                    {
                                        getFieldDecorator('warehouse_id', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select allowClear placeholder="请选择仓库">
                                                {
                                                    this.state.warehouse_list.map(function (item) {
                                                        return (
                                                            <Option key={item.warehouse_id}
                                                                    value={item.warehouse_id}>{item.warehouse_name}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

WarehouseMemberDeliveryOrderDeliver.propTypes = {};

WarehouseMemberDeliveryOrderDeliver = Form.create({})(WarehouseMemberDeliveryOrderDeliver);

export default WarehouseMemberDeliveryOrderDeliver;