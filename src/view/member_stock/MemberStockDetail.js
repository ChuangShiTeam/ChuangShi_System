import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, message, Table} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class MemberStockDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            stock_id: '',
            stock_product_sku_list: []
        }
    }

    componentDidMount() {
        notification.on('notification_member_stock_detail_view', this, function (data) {
            this.setState({
                is_show: true,
                stock_id: data.stock_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_member_stock_detail_view', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/member/stock/' + constant.action + '/find',
            data: {
                stock_id: this.state.stock_id
            },
            success: function (data) {
                this.props.form.setFieldsValue({
                    user_name: data.stock.user_name,
                    stock_action: data.stock.stock_action === 'IN'?'入库':data.stock.stock_action === 'OUT'?'出库':data.stock.stock_action === 'REPLENISH'?'平台补充':null,
                    stock_quantity: data.stock.stock_quantity
                });
                this.setState({
                    stock_product_sku_list: data.stock_product_sku_list
                })
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
            stock_id: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            width: 150,
            title: '商品名称',
            dataIndex: 'product_name'
        }, {
            width: 150,
            title: '数量',
            dataIndex: 'product_sku_quantity'
        }];

        return (
            <Modal title={'会员出库入库详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>
                   ]}
            >
                <Spin spinning={this.state.is_load}>
                    <form>
                        <h3>详情</h3>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="会员名称">
                                    {
                                        getFieldDecorator('user_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="数量">
                                    {
                                        getFieldDecorator('stock_quantity', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="出库/入库/平台补充">
                                    {
                                        getFieldDecorator('stock_action', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <h3>明细</h3>
                        <Table
                               rowKey="product_sku_id"
                               className="margin-top"
                               loading={this.state.is_load} columns={columns}
                               dataSource={this.state.stock_product_sku_list} pagination={false}
                               bordered/>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

MemberStockDetail.propTypes = {};

MemberStockDetail = Form.create({})(MemberStockDetail);

export default connect(({member_stock}) => ({member_stock}))(MemberStockDetail);