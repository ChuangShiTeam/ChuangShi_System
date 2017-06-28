import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class ExceptionDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            exception_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_exception_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_exception_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                exception_id: data.exception_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_exception_detail_add', this);

        notification.remove('notification_exception_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/exception/system/find',
            data: {
                exception_id: this.state.exception_id
            },
            success: function (data) {
                this.props.form.setFieldsValue({
                    exception_content: data.exception_content,
                    exception_is_confirm: data.exception_is_confirm,
                    exception_remark: data.exception_remark,
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
            exception_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'异常详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                }} className="form-item" label="异常内容">
                                    {
                                        getFieldDecorator('exception_content', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '异常内容'}/>
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
                                }} className="form-item" label="是否确认">
                                    {
                                        getFieldDecorator('exception_is_confirm', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '是否确认'}/>
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
                                }} className="form-item" label="异常描述">
                                    {
                                        getFieldDecorator('exception_remark', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '异常描述'}/>
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

ExceptionDetail.propTypes = {};

ExceptionDetail = Form.create({})(ExceptionDetail);

export default connect(({exception}) => ({exception}))(ExceptionDetail);