import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message} from 'antd';

import InputImage from '../../component/InputImage';
import InputHtml from '../../component/InputHtml';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class XietongStudentDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            student_id: '',
            user_id: '',
            system_version: '',
            clazz: [],
            category: []
        }
    }

    componentDidMount() {
        notification.on('notification_xietong_student_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                clazz: data.clazz,
                category: data.category
            });
        });

        notification.on('notification_xietong_student_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                clazz: data.clazz,
                category: data.category,
                student_id: data.student_id
            }, function () {
                setTimeout(function () {
                    this.handleLoad();
                }.bind(this), 300);
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_student_detail_add', this);

        notification.remove('notification_xietong_student_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/student/find',
            data: {
                student_id: this.state.student_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                let student_image = [];
                if (data.file_id !== null) {
                    student_image.push({
                        file_id: data.file_id,
                        file_path: data.file_path
                    });
                }
                this.refs.student_image.handleSetValue(student_image);
                this.refs.student_description.handleSetValue(data.student_description);

                this.props.form.setFieldsValue({
                    student_category_id: data.student_category_id,
                    clazz_id: data.clazz_id,
                    student_name: data.student_name,
                    student_number: data.student_number,
                    student_sex: data.student_sex
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

            values.student_id = this.state.student_id;
            values.system_version = this.state.system_version;
            values.user_id = this.state.user_id;
            values.student_description = this.refs.student_description.handleGetValue();

            let file_list = this.refs.student_image.handleGetValue();
            if (file_list.length === 0) {
                values.student_image = '';
            } else {
                values.student_image = file_list[0].file_id;
            }

            if (!values.clazz_id) {
                values.clazz_id = '';
            }

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/xietong/student/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_xietong_student_index_load', {});

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
            student_id: '',
            user_id: '',
            system_version: ''
        });

        this.props.form.resetFields();

        this.refs.student_image.handleReset();
        this.refs.student_description.handleReset();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'学生详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                                            this.props.xietong_student.app_list.map(function (item) {
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
                                }} className="form-item" label="班级编号">                                    {
                                        getFieldDecorator('clazz_id', {
                                            initialValue: ''
                                        })(
                                            <Select allowClear placeholder="请选择班级">
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
                                }} className="form-item" label="所属分类">
                                    {
                                        getFieldDecorator('student_category_id', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select placeholder="请选择分类">
                                                {
                                                    this.state.category.map(function (item) {
                                                        return (
                                                            <Option key={item.student_category_id} value={item.student_category_id}>{item.student_category_name}</Option>
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
                                }} className="form-item" label="照片">
                                    <InputImage name="student_image" limit={1} aspect={100 / 100} ref="student_image"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="学生姓名">
                                    {
                                        getFieldDecorator('student_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '学生姓名'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="学生学号">
                                    {
                                        getFieldDecorator('student_number', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '学生学号'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="学生性别">
                                    {
                                        getFieldDecorator('student_sex', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select placeholder="请选择性别">
                                                <Option key="man" value="男">男</Option>
                                                <Option key="woman" value="女">女</Option>
                                            </Select>
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
                                }} className="form-item" label="简介">
                                    <InputHtml name="student_description" ref="student_description"/>
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

XietongStudentDetail.propTypes = {};

XietongStudentDetail = Form.create({})(XietongStudentDetail);

export default connect(({xietong_student}) => ({xietong_student}))(XietongStudentDetail);