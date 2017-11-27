import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Select, message} from 'antd';

import InputImage from '../../component/InputImage';
import InputHtml from '../../component/InputHtml';
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
                setTimeout(function () {
                    this.handleLoad();
                }.bind(this), 300);
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

                let teacher_image = [];
                if (data.file_id !== null) {
                    teacher_image.push({
                        file_id: data.file_id,
                        file_path: data.file_path
                    });
                }
                this.refs.teacher_image.handleSetValue(teacher_image);
                this.refs.teacher_description.handleSetValue(data.teacher_description);

                this.props.form.setFieldsValue({
                    clazz_id: data.clazz_id,
                    organization_id: data.organization_id,
                    teacher_name: data.teacher_name,
                    teacher_number: data.teacher_number,
                    teacher_category_id: data.teacher_category_id,
                    teacher_title: data.teacher_title,
                    teacher_sort: data.teacher_sort
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

            let file_list = this.refs.teacher_image.handleGetValue();
            if (file_list.length === 0) {
                values.teacher_image = '';
            } else {
                values.teacher_image = file_list[0].file_id;
            }

            values.teacher_description = this.refs.teacher_description.handleGetValue();
            values.clazz_id = JSON.stringify(values.clazz_id);
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

        this.refs.teacher_image.handleReset();
        this.refs.teacher_description.handleReset();
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
                                }} className="form-item" label="所属班级">                                    {
                                    getFieldDecorator('clazz_id', {
                                        rules: [{
                                            required: true,
                                            message: constant.required,
                                            type: 'array'
                                        }],
                                        initialValue: []
                                    })(
                                        <Select mode="multiple" allowClear placeholder="请选择班级">
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
                                }} className="form-item" label="姓名">
                                    {
                                        getFieldDecorator('teacher_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '姓名'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="所属分类">                                    {
                                    getFieldDecorator('teacher_category_id', {
                                        rules: [{
                                            required: true,
                                            message: constant.required
                                        }],
                                        initialValue: ''
                                    })(
                                        <Select allowClear placeholder="请选择分类">
                                            {
                                                this.props.xietong_teacher.teacher_category_list.map(function (item) {
                                                    return (
                                                        <Option key={item.teacher_category_id} value={item.teacher_category_id}>{item.teacher_category_name}</Option>
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
                                    <InputImage name="teacher_image" limit={1} aspect={100 / 100} ref="teacher_image"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="职称">
                                    {
                                        getFieldDecorator('teacher_title', {
                                            initialValue: ''
                                        })(
                                            <Input type="textarea" rows={5} placeholder={constant.placeholder + '职称'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                    <InputHtml name="teacher_description" ref="teacher_description"/>
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
                                            <Input type="password" placeholder={constant.placeholder + '登录密码'}/>
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
                                }} className="form-item" label="老师排序">
                                    {
                                        getFieldDecorator('teacher_sort', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999} placeholder={constant.placeholder + '老师排序'} onPressEnter={this.handleSubmit.bind(this)}/>
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