import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message, DatePicker} from 'antd';
import moment from 'moment';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class GuangqiSingConfigDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            sing_config_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_guangqi_sing_config_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_guangqi_sing_config_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                sing_config_id: data.sing_config_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_guangqi_sing_config_detail_add', this);

        notification.remove('notification_guangqi_sing_config_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/guangqi/sing/config/find',
            data: {
                sing_config_id: this.state.sing_config_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    sing_config_end_time: data.sing_config_end_time?moment(data.sing_config_end_time):null,
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

            values.sing_config_id = this.state.sing_config_id;
            values.system_version = this.state.system_version;

            values.sing_config_end_time = values.sing_config_end_time.format('YYYY-MM-DD HH:mm:ss');

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/guangqi/sing/config/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_guangqi_sing_config_index_load', {});

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
            sing_config_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'歌唱活动配置详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                                            this.props.guangqi_sing_config.app_list.map(function (item) {
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
                                }} className="form-item" label="活动结束时间">
                                    {
                                        getFieldDecorator('sing_config_end_time', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }]
                                        })(
                                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
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

GuangqiSingConfigDetail.propTypes = {};

GuangqiSingConfigDetail = Form.create({})(GuangqiSingConfigDetail);

export default connect(({guangqi_sing_config}) => ({guangqi_sing_config}))(GuangqiSingConfigDetail);