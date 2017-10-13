import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class XietongTeacherDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            teacher_id: '',
            user_id: '',
            system_version: '',
            clazz: []
        }
    }

    componentDidMount() {
        notification.on('notification_xietong_teacher_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                clazz: data.clazz
            });
        });

        notification.on('notification_xietong_teacher_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                teacher_id: data.teacher_id,
                clazz: data.clazz
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_teacher_detail_add', this);

        notification.remove('notification_xietong_teacher_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/teacher/find',
            data: {
                teacher_id: this.state.teacher_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    clazz_id: data.clazz_id,
                    organization_id: data.organization_id,
                    teacher_name: data.teacher_name,
                });

                this.setState({
                    user_id: data.user_id,
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

            values.teacher_id = this.state.teacher_id;
            values.system_version = this.state.system_version;
            values.user_id = this.state.user_id;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/xietong/teacher/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_xietong_teacher_index_load', {});

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
            teacher_id: '',
            user_id: '',
            system_version: '',
            clazz: []
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'教师详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                                            this.props.xietong_teacher.app_list.map(function (item) {
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
                                }} className="content-search-item" label="组织机构">
                                    {
                                        getFieldDecorator('organization_id', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select allowClear placeholder="请选择组织机构">
                                                {
                                                    this.props.xietong_teacher.organization_list.map(function (item) {
                                                        return (
                                                            <Option key={item.organization_id}
                                                                    value={item.organization_id}>{item.organization_name}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
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
                                }} className="form-item" label="班级编号">                                    {
                                    getFieldDecorator('clazz_id', {
                                        rules: [{
                                            required: true,
                                            message: constant.required
                                        }],
                                        initialValue: ''
                                    })(
                                        <Select placeholder="请选择班级">
                                            {
                                                this.state.clazz.map(function (item) {
                                                    return (
                                                        <Option key={item.clazz_id} value={item.clazz_id}>{item.clazz_name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
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
                                }} className="form-item" label="工号">
                                    {
                                        getFieldDecorator('teacher_number', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '工号'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="老师姓名">
                                    {
                                        getFieldDecorator('teacher_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '老师姓名'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="登录密码">
                                    {
                                        getFieldDecorator('user_password', {
                                            rules: [{
                                                required: this.state.action === 'save',
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '登录密码'}/>
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

XietongTeacherDetail.propTypes = {};

XietongTeacherDetail = Form.create({})(XietongTeacherDetail);

export default connect(({xietong_teacher}) => ({xietong_teacher}))(XietongTeacherDetail);