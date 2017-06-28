import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class FeijiuFastCustomerDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            customer_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_feijiu_fast_customer_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_feijiu_fast_customer_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                customer_id: data.customer_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_feijiu_fast_customer_detail_add', this);

        notification.remove('notification_feijiu_fast_customer_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/feijiu/fast/customer/admin/find',
            data: {
                customer_id: this.state.customer_id
            },
            success: function (data) {
                this.props.form.setFieldsValue({
                    customer_name: data.customer_name,
                    customer_phone: data.customer_phone,
                    customer_birthday: data.customer_birthday,
                    customer_city: data.customer_city,
                    customer_sex: data.customer_sex,
                    customer_id_card: data.customer_id_card,
                    customer_money: data.customer_money,
                    customer_fang: data.customer_fang,
                    customer_che: data.customer_che,
                    customer_xin: data.customer_xin,
                    customer_shou: data.customer_shou,
                    customer_dai: data.customer_dai,
                    customer_gong: data.customer_gong,
                });

                this.setState({
                    system_version: data.system_version
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    handleSubmit() {
        this.handleCancel();
    }

    handleCancel() {
        this.setState({
            is_load: false,
            is_show: false,
            action: '',
            customer_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                }} className="form-item" label="客户名称">
                                    {
                                        getFieldDecorator('customer_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '客户名称'}/>
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
                                }} className="form-item" label="手机号码">
                                    {
                                        getFieldDecorator('customer_phone', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '手机号码'}/>
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
                                }} className="form-item" label="出生日期">
                                    {
                                        getFieldDecorator('customer_birthday', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '出生日期'}/>
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
                                }} className="form-item" label="所在城市">
                                    {
                                        getFieldDecorator('customer_city', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '所在城市'}/>
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
                                }} className="form-item" label="性别">
                                    {
                                        getFieldDecorator('customer_sex', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '性别'}/>
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
                                }} className="form-item" label="身份证号">
                                    {
                                        getFieldDecorator('customer_id_card', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '身份证号'}/>
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
                                }} className="form-item" label="借款金额">
                                    {
                                        getFieldDecorator('customer_money', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '借款金额'}/>
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
                                }} className="form-item" label="名下有房">
                                    {
                                        getFieldDecorator('customer_fang', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '名下有房'}/>
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
                                }} className="form-item" label="名下有车">
                                    {
                                        getFieldDecorator('customer_che', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '名下有车'}/>
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
                                }} className="form-item" label="有信用卡">
                                    {
                                        getFieldDecorator('customer_xin', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '有信用卡'}/>
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
                                }} className="form-item" label="有寿险保单">
                                    {
                                        getFieldDecorator('customer_shou', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '有寿险保单'}/>
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
                                }} className="form-item" label="有微粒贷">
                                    {
                                        getFieldDecorator('customer_dai', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '有微粒贷'}/>
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
                                }} className="form-item" label="有公积金">
                                    {
                                        getFieldDecorator('customer_gong', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '有公积金'}/>
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

FeijiuFastCustomerDetail.propTypes = {};

FeijiuFastCustomerDetail = Form.create({})(FeijiuFastCustomerDetail);

export default connect(({feijiu_fast_customer}) => ({feijiu_fast_customer}))(FeijiuFastCustomerDetail);