import React, {Component} from "react";
import {connect} from "dva";
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message} from "antd";
import constant from "../../util/constant";
import notification from "../../util/notification";
import http from "../../util/http";

class CustomerDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            customer_id: '',
            system_version: '',
            customer_attribute_list: []
        }
    }

    componentDidMount() {
        notification.on('notification_customer_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_customer_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                customer_id: data.customer_id
            }, function () {
                this.handleLoad();
            });
        });

        this.handleAppCustomerAttributeLoad();
    }

    componentWillUnmount() {
        notification.remove('notification_customer_detail_add', this);

        notification.remove('notification_customer_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/customer/' + constant.action + '/find',
            data: {
                customer_id: this.state.customer_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    customer_name: data.customer_name,
                    customer_sex: data.customer_sex,
                    customer_birthday: data.customer_birthday,
                    customer_tel: data.customer_tel,
                    customer_mobile: data.customer_mobile,
                    customer_postcode: data.customer_postcode,
                    customer_id_card: data.customer_id_card,
                    customer_province: data.customer_province,
                    customer_city: data.customer_city,
                    customer_area: data.customer_area,
                    customer_address: data.customer_address,
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

    handleAppCustomerAttributeLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/customer/attribute/admin/app/list',
            data: {
                customer_id: this.state.customer_id
            },
            success: function (data) {
                this.setState({
                    customer_attribute_list: data
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
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            values.customer_id = this.state.customer_id;
            values.system_version = this.state.system_version;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/customer/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_customer_index_load', {});

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
            customer_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'详情'} maskClosable={false} width={document.documentElement.clientWidth - 200}
                   className="modal"
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
                                                            this.props.customer.app_list.map(function (item) {
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
                        <br/>
                        <h2>基本信息</h2>
                        <br/>
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
                                            <Input type="text" placeholder={constant.placeholder + '客户名称'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
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
                                            <Input type="text" placeholder={constant.placeholder + '性别'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
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
                                            <Input type="text" placeholder={constant.placeholder + '出生日期'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="客户电话号码">
                                    {
                                        getFieldDecorator('customer_tel', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '客户电话号码'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="客户手机号码">
                                    {
                                        getFieldDecorator('customer_mobile', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '客户手机号码'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="客户邮编">
                                    {
                                        getFieldDecorator('customer_postcode', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '客户邮编'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
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
                                            <Input type="text" placeholder={constant.placeholder + '身份证号'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="省份">
                                    {
                                        getFieldDecorator('customer_province', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '省份'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="城市">
                                    {
                                        getFieldDecorator('customer_city', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '城市'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="区域">
                                    {
                                        getFieldDecorator('customer_area', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '区域'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="详细地址">
                                    {
                                        getFieldDecorator('customer_address', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '详细地址'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <br/>
                        <h2>附属信息</h2>
                        <br/>
                        <Row>
                            {
                                this.state.customer_attribute_list.map(function (item) {
                                    const customer_attribute_name = item.customer_attribute_name;
                                    const customer_attribute_key = item.customer_attribute_key;
                                    const customer_attribute_default_value = item.customer_attribute_default_value;
                                    return (
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label={customer_attribute_name}>
                                                {
                                                    getFieldDecorator(customer_attribute_key, {
                                                        rules: [{
                                                            required: false,
                                                            message: constant.required
                                                        }],
                                                        initialValue: customer_attribute_default_value
                                                    })(
                                                        <Input type="text"
                                                               placeholder={constant.placeholder+customer_attribute_name}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

CustomerDetail.propTypes = {};

CustomerDetail = Form.create({})(CustomerDetail);

export default connect(({customer}) => ({customer}))(CustomerDetail);