import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message, DatePicker} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class CertificateImageDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            certificate_image_id: '',
            system_version: '',
            certificate_type: '',
            user_id: ''
        }
    }

    componentDidMount() {
        notification.on('notification_certificate_image_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                certificate_type: data.certificate_type,
                user_id: data.user_id
            });
        });

        notification.on('notification_certificate_image_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                certificate_image_id: data.certificate_image_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_certificate_image_detail_add', this);

        notification.remove('notification_certificate_image_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/certificate/image/' + constant.action + '/find',
            data: {
                certificate_image_id: this.state.certificate_image_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    certificate_id: data.certificate_id,
                    file_id: data.file_id,
                    certificate_type: data.certificate_type,
                    certificate_channel_name: data.certificate_channel_name,
                    certificate_channel_url: data.certificate_channel_url,
                    certificate_people_name: data.certificate_people_name,
                    certificate_people_id_card: data.certificate_people_id_card,
                    certificate_people_mobile: data.certificate_people_mobile,
                    certificate_shop_name: data.certificate_shop_name,
                    certificate_shop_url: data.certificate_shop_url,
                    certificate_start_date: data.certificate_start_date,
                    certificate_end_date: data.certificate_end_date,
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
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            values.system_version = this.state.system_version;
            values.certificate_type = this.state.certificate_type;
            values.user_id = this.state.user_id;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/certificate/image/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_certificate_image_list', {});

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
            certificate_image_id: '',
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
                                                            this.props.certificate_image.app_list.map(function (item) {
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
                        {
                            this.state.certificate_type === "wx" ?
                                <span>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权平台">
                                                {
                                                    getFieldDecorator('certificate_type', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: '微信'
                                                    })(
                                                        <Input type="text" disabled/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权开始日期">
                                                {
                                                    getFieldDecorator('certificate_start_date', {
                                                        rules: [{
                                                            type: 'object',
                                                            required: true,
                                                            message: constant.required
                                                        }]
                                                    })(
                                                        <DatePicker/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权结束日期">
                                                {
                                                    getFieldDecorator('certificate_end_date', {
                                                        rules: [{
                                                            type: 'object',
                                                            required: true,
                                                            message: constant.required
                                                        }]
                                                    })(
                                                        <DatePicker size='large'
                                                                    placeholder={constant.placeholder + '授权结束日期'}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权人姓名">
                                                {
                                                    getFieldDecorator('certificate_people_name', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder={constant.placeholder + '授权人姓名'}
                                                               onPressEnter={this.handleSubmit.bind(this)}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权人身份证">
                                                {
                                                    getFieldDecorator('certificate_people_id_card', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder={constant.placeholder + '授权人身份证'}
                                                               onPressEnter={this.handleSubmit.bind(this)}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权人手机">
                                                {
                                                    getFieldDecorator('certificate_people_mobile', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder={constant.placeholder + '授权人手机'}
                                                               onPressEnter={this.handleSubmit.bind(this)}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </span>
                                :
                                <span>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权平台">
                                                {
                                                    getFieldDecorator('certificate_type', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Select  style={{ width: 120 }}>
                                                            <Option value="淘宝">淘宝</Option>
                                                            <Option value="天猫">天猫</Option>
                                                            <Option value="京东">京东</Option>
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权开始日期">
                                                {
                                                    getFieldDecorator('certificate_start_date', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <DatePicker size='large'
                                                                    placeholder={constant.placeholder + '授权开始日期'}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权结束日期">
                                                {
                                                    getFieldDecorator('certificate_end_date', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <DatePicker size='large'
                                                                    placeholder={constant.placeholder + '授权结束日期'}/>
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
                                            }} className="form-item" label="渠道商名称">
                                                {
                                                    getFieldDecorator('certificate_channel_name', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder={constant.placeholder + '渠道商名称'}
                                                               onPressEnter={this.handleSubmit.bind(this)}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="渠道商网址">
                                                {
                                                    getFieldDecorator('certificate_channel_url', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder={constant.placeholder + '渠道商网址'}
                                                               onPressEnter={this.handleSubmit.bind(this)}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <br/>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权人姓名">
                                                {
                                                    getFieldDecorator('certificate_people_name', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder={constant.placeholder + '授权人姓名'}
                                                               onPressEnter={this.handleSubmit.bind(this)}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权人身份证">
                                                {
                                                    getFieldDecorator('certificate_people_id_card', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder={constant.placeholder + '授权人身份证'}
                                                               onPressEnter={this.handleSubmit.bind(this)}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权人手机">
                                                {
                                                    getFieldDecorator('certificate_people_mobile', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder={constant.placeholder + '授权人手机'}
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
                                            }} className="form-item" label="店铺名称">
                                                {
                                                    getFieldDecorator('certificate_shop_name', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder={constant.placeholder + '店铺名称'}
                                                               onPressEnter={this.handleSubmit.bind(this)}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="店铺地址">
                                                {
                                                    getFieldDecorator('certificate_shop_url', {
                                                        rules: [{
                                                            required: true,
                                                            message: constant.required
                                                        }],
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder={constant.placeholder + '店铺地址'}
                                                               onPressEnter={this.handleSubmit.bind(this)}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </span>
                        }
                    </form>
                </Spin>
            </Modal>
        );
    }
}

CertificateImageDetail.propTypes = {};

CertificateImageDetail = Form.create({})(CertificateImageDetail);

export default connect(({certificate_image}) => ({certificate_image}))(CertificateImageDetail);