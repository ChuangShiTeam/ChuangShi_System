import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, Switch, message, DatePicker} from 'antd';
import moment from 'moment';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class XietongAdmissionsDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            admissions_id: '',
            user_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_xietong_admissions_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_xietong_admissions_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                admissions_id: data.admissions_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_xietong_admissions_detail_add', this);

        notification.remove('notification_xietong_admissions_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/admissions/find',
            data: {
                admissions_id: this.state.admissions_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    admissions_no: data.admissions_no,
                    admissions_name: data.admissions_name,
                    admissions_certificate_type: data.admissions_certificate_type,
                    admissions_certificate_number: data.admissions_certificate_number,
                    admissions_sex: data.admissions_sex,
                    admissions_birthday: data.admissions_birthday?moment(data.admissions_birthday):null,
                    admissions_is_apply_live_school: data.admissions_is_apply_live_school,
                    admissions_old_school: data.admissions_old_school,
                    admissions_registration_address: data.admissions_registration_address,
                    admissions_home_address: data.admissions_home_address,
                    admissions_home_first_name: data.admissions_home_first_name,
                    admissions_home_first_unit: data.admissions_home_first_unit,
                    admissions_home_first_tel: data.admissions_home_first_tel,
                    admissions_home_second_name: data.admissions_home_second_name,
                    admissions_home_second_unit: data.admissions_home_second_unit,
                    admissions_home_second_tel: data.admissions_home_second_tel,
                    admissions_notes: data.admissions_notes,
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

            values.admissions_id = this.state.admissions_id;
            values.system_version = this.state.system_version;
            values.user_id = this.state.user_id;
            values.admissions_birthday = values.admissions_birthday.format('YYYY-MM-DD');

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/xietong/admissions/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_xietong_admissions_index_load', {});

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
            admissions_id: '',
            user_id: '',
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
                                                            this.props.xietong_admissions.app_list.map(function (item) {
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
                            this.state.action === 'update' ?
                                <Row>
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="form-item" label="序号">
                                            {
                                                getFieldDecorator('admissions_no', {
                                                    rules: [{
                                                        required: true,
                                                        message: constant.required
                                                    }],
                                                    initialValue: ''
                                                })(
                                                    <Input type="text" placeholder={constant.placeholder + '序号'}
                                                           onPressEnter={this.handleSubmit.bind(this)} disabled/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>:null
                        }
                            <Row>
                                <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="姓名">
                                    {
                                        getFieldDecorator('admissions_name', {
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
                                }} className="form-item" label="证件类型">
                                    {
                                        getFieldDecorator('admissions_certificate_type', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '证件类型'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="证件号码(身份证号码）">
                                    {
                                        getFieldDecorator('admissions_certificate_number', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '证件号码(身份证号码）'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                        getFieldDecorator('admissions_sex', {
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
                                        getFieldDecorator('admissions_birthday', {
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
                                }} className="form-item" label="是否申请住校">
                                    {
                                        getFieldDecorator('admissions_is_apply_live_school', {
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
                                }} className="form-item" label="原就读学校">
                                    {
                                        getFieldDecorator('admissions_old_school', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '原就读学校'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="户籍地址">
                                    {
                                        getFieldDecorator('admissions_registration_address', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <TextArea rows={4} placeholder={constant.placeholder + '户籍地址'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="家庭住址">
                                    {
                                        getFieldDecorator('admissions_home_address', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <TextArea rows={4} placeholder={constant.placeholder + '家庭住址'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="家庭成员一姓名">
                                    {
                                        getFieldDecorator('admissions_home_first_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '家庭成员一姓名'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="家庭成员一单位">
                                    {
                                        getFieldDecorator('admissions_home_first_unit', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '家庭成员一单位'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="家庭成员一联系电话">
                                    {
                                        getFieldDecorator('admissions_home_first_tel', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '家庭成员一联系电话'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="家庭成员二姓名">
                                    {
                                        getFieldDecorator('admissions_home_second_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '家庭成员二姓名'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="家庭成员二单位">
                                    {
                                        getFieldDecorator('admissions_home_second_unit', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '家庭成员二单位'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="家庭成员二联系电话">
                                    {
                                        getFieldDecorator('admissions_home_second_tel', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '家庭成员二联系电话'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="需要说明事项">
                                    {
                                        getFieldDecorator('admissions_notes', {
                                            initialValue: ''
                                        })(
                                            <TextArea rows={4} placeholder={constant.placeholder + '需要说明事项'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            this.state.action === 'update' ?
                                <Row>
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="form-item" label="登录密码">
                                            {
                                                getFieldDecorator('user_password', {
                                                    rules: [{
                                                        required: false,
                                                        message: constant.required
                                                    }],
                                                    initialValue: ''
                                                })(
                                                    <Input type="text" placeholder={constant.placeholder + '登录密码'}/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>:null
                        }
                    </form>
                </Spin>
            </Modal>
        );
    }
}

XietongAdmissionsDetail.propTypes = {};

XietongAdmissionsDetail = Form.create({})(XietongAdmissionsDetail);

export default connect(({xietong_admissions}) => ({xietong_admissions}))(XietongAdmissionsDetail);