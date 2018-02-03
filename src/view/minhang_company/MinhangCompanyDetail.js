import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, InputNumber, message} from 'antd';

import InputHtml from '../../component/InputHtml';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import validate from '../../util/validate';

class MinhangCompanyDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            company_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_minhang_company_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_minhang_company_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                company_id: data.company_id
            }, function () {
                setTimeout(function () {
                    this.handleLoad();
                }.bind(this), 300);
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_company_detail_add', this);

        notification.remove('notification_minhang_company_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/company/find',
            data: {
                company_id: this.state.company_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.refs.compnay_description.handleSetValue(validate.unescapeHtml(data.compnay_description));

                this.props.form.setFieldsValue({
                    company_name: data.company_name,
                    company_view_width: data.company_view_width,
                    compnay_sort: data.compnay_sort,
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

            values.company_id = this.state.company_id;
            values.system_version = this.state.system_version;

            values.company_logo = '';
            values.compnay_description = this.refs.compnay_description.handleGetValue();

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/minhang/company/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_minhang_company_index_load', {});

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
            company_id: '',
            system_version: ''
        });

        this.props.form.resetFields();

        this.refs.compnay_description.handleReset();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'公司详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                                            this.props.minhang_company.app_list.map(function (item) {
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
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="公司名称">
                                    {
                                        getFieldDecorator('company_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '公司名称'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="公司展示位置">
                                    {
                                        getFieldDecorator('company_view_width', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={9999999} placeholder={constant.placeholder + '公司展示位置'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="公司简介">
                                    <InputHtml name="compnay_description" ref="compnay_description"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="公司排序">
                                    {
                                        getFieldDecorator('compnay_sort', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999} placeholder={constant.placeholder + '公司排序'} onPressEnter={this.handleSubmit.bind(this)}/>
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

MinhangCompanyDetail.propTypes = {};

MinhangCompanyDetail = Form.create({})(MinhangCompanyDetail);

export default connect(({minhang_company}) => ({minhang_company}))(MinhangCompanyDetail);