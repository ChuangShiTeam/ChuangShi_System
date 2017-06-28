import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class FeijiuRecommendCustomerDetail extends Component {
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
        notification.on('notification_feijiu_recommend_customer_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_feijiu_recommend_customer_detail_edit', this, function (data) {
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
        notification.remove('notification_feijiu_recommend_customer_detail_add', this);

        notification.remove('notification_feijiu_recommend_customer_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/feijiu/recommend/customer/admin/find',
            data: {
                customer_id: this.state.customer_id
            },
            success: function (data) {
                this.props.form.setFieldsValue({
                    customer_name: data.customer_name,
                    customer_phone: data.customer_phone,
                    customer_city: data.customer_city,
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
                    </form>
                </Spin>
            </Modal>
        );
    }
}

FeijiuRecommendCustomerDetail.propTypes = {};

FeijiuRecommendCustomerDetail = Form.create({})(FeijiuRecommendCustomerDetail);

export default connect(({feijiu_recommend_customer}) => ({feijiu_recommend_customer}))(FeijiuRecommendCustomerDetail);