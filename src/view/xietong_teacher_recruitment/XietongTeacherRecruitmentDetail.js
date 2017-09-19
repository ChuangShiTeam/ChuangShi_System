import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, Switch, message, DatePicker, Upload} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import FileUpload from '../../component/FileUpload';

class XietongTeacherRecruitmentDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            teacher_recruitment_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_xietong_teacher_recruitment_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_xietong_teacher_recruitment_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                teacher_recruitment_id: data.teacher_recruitment_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_teacher_recruitment_detail_add', this);

        notification.remove('notification_xietong_teacher_recruitment_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/teacher/recruitment/find',
            data: {
                teacher_recruitment_id: this.state.teacher_recruitment_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    teacher_recruitment_name: data.teacher_recruitment_name,
                    teacher_recruitment_sex: data.teacher_recruitment_sex,
                    teacher_recruitment_birthday: data.teacher_recruitment_birthday,
                    teacher_recruitment_mobile: data.teacher_recruitment_mobile,
                    teacher_recruitment_email: data.teacher_recruitment_email,
                    teacher_recruitment_faculty: data.teacher_recruitment_faculty,
                    teacher_recruitment_subject: data.teacher_recruitment_subject,
                    teacher_recruitment_is_fresh_graduate: data.teacher_recruitment_is_fresh_graduate,
                    teacher_recruitment_work_year: data.teacher_recruitment_work_year,
                    teacher_recruitment_old_unit: data.teacher_recruitment_old_unit,
                    teacher_recruitment_politics_status: data.teacher_recruitment_politics_status,
                    teacher_recruitment_job_title: data.teacher_recruitment_job_title,
                    teacher_recruitment_education: data.teacher_recruitment_education,
                    teacher_recruitment_major: data.teacher_recruitment_major,
                    teacher_recruitment_grad_school: data.teacher_recruitment_grad_school,
                    teacher_recruitment_education_experience: data.teacher_recruitment_education_experience,
                    teacher_recruitment_work_experience: data.teacher_recruitment_work_experience,
                    teacher_recruitment_representative_honor: data.teacher_recruitment_representative_honor,
                    teacher_recruitment_now_address: data.teacher_recruitment_now_address,
                    teacher_recruitment_file: data.teacher_recruitment_file,
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

            values.teacher_recruitment_id = this.state.teacher_recruitment_id;
            values.system_version = this.state.system_version;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/xietong/teacher/recruitment/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_xietong_teacher_recruitment_index_load', {});

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
            teacher_recruitment_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;
        const { TextArea } = Input;

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
                                                            this.props.xietong_teacher_recruitment.app_list.map(function (item) {
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
                                }} className="form-item" label="姓名">
                                    {
                                        getFieldDecorator('teacher_recruitment_name', {
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
                                }} className="form-item" label="性别">
                                    {
                                        getFieldDecorator('teacher_recruitment_sex', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }]
                                        })(
                                            <Select placeholder="请选择性别">
                                                <Option key="男" value="男">男</Option>
                                                <Option key="女" value="女">女</Option>
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
                                }} className="form-item" label="出生日期">
                                    {
                                        getFieldDecorator('teacher_recruitment_birthday', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }]
                                        })(
                                            <DatePicker />
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
                                        getFieldDecorator('teacher_recruitment_mobile', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '手机号码'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="邮箱地址">
                                    {
                                        getFieldDecorator('teacher_recruitment_email', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '邮箱地址'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="应聘学部">
                                    {
                                        getFieldDecorator('teacher_recruitment_faculty', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }]
                                        })(
                                            <Select placeholder="请选择应聘学部">
                                                <Option key="中学部" value="中学部">中学部</Option>
                                                <Option key="小学部" value="小学部">小学部</Option>
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
                                }} className="form-item" label="应聘学科">
                                    {
                                        getFieldDecorator('teacher_recruitment_subject', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '应聘学科'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="是否应届毕业生">
                                    {
                                        getFieldDecorator('teacher_recruitment_is_fresh_graduate', {
                                            valuePropName: 'checked',
                                            initialValue: false
                                        })(
                                            <Switch />
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
                                }} className="form-item" label="工作年限">
                                    {
                                        getFieldDecorator('teacher_recruitment_work_year', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '工作年限'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="原工作单位">
                                    {
                                        getFieldDecorator('teacher_recruitment_old_unit', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '原工作单位'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="政治面貌">
                                    {
                                        getFieldDecorator('teacher_recruitment_politics_status', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '政治面貌'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="职称">
                                    {
                                        getFieldDecorator('teacher_recruitment_job_title', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '职称'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="学历">
                                    {
                                        getFieldDecorator('teacher_recruitment_education', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '学历'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="专业">
                                    {
                                        getFieldDecorator('teacher_recruitment_major', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '专业'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="毕业院校">
                                    {
                                        getFieldDecorator('teacher_recruitment_grad_school', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '毕业院校'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="教育经历">
                                    {
                                        getFieldDecorator('teacher_recruitment_education_experience', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <TextArea rows={4} placeholder={constant.placeholder + '教育经历'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="工作经历">
                                    {
                                        getFieldDecorator('teacher_recruitment_work_experience', {
                                            initialValue: ''
                                        })(
                                            <TextArea rows={4} placeholder={constant.placeholder + '工作经历'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="所获代表性荣誉">
                                    {
                                        getFieldDecorator('teacher_recruitment_representative_honor', {
                                            initialValue: ''
                                        })(
                                            <TextArea rows={4} placeholder={constant.placeholder + '所获代表性荣誉'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="现在住址">
                                    {
                                        getFieldDecorator('teacher_recruitment_now_address', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <TextArea rows={4} placeholder={constant.placeholder + '现在住址'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="请上传您的电子版简历">
                                    <FileUpload name="teacher_recruitment_file" limit={1} ref="teacher_recruitment_file"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

XietongTeacherRecruitmentDetail.propTypes = {};

XietongTeacherRecruitmentDetail = Form.create({})(XietongTeacherRecruitmentDetail);

export default connect(({xietong_teacher_recruitment}) => ({xietong_teacher_recruitment}))(XietongTeacherRecruitmentDetail);