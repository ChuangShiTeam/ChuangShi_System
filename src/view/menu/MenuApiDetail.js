import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class MenuApiDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            category_id: '',
            parent_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_menu_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                parent_id: data.parent_id,
            });

            this.props.form.setFieldsValue({
                app_id: data.app_id
            });
        });

        notification.on('notification_menu_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                category_id: data.category_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_menu_detail_add', this);

        notification.remove('notification_menu_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/category/system/find',
            data: {
                category_id: this.state.category_id
            },
            success: function (data) {
                this.props.form.setFieldsValue({
                    app_id: data.app_id,
                    category_name: data.category_name,
                    category_image: data.category_image,
                    category_key: data.category_key,
                    category_value: data.category_value,
                    category_sort: data.category_sort,
                    category_type: data.category_type,
                    object_id: data.object_id
                });

                this.setState({
                    parent_id: data.parent_id,
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

            values.category_id = this.state.category_id;
            values.parent_id = this.state.parent_id;
            values.system_version = this.state.system_version;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/category/system/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_menu_index_load', {});

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
            category_id: '',
            parent_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'菜单接口详情'} maskClosable={false} width={document.documentElement.clientWidth - 200}
                   className="modal" zIndex={2}
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
                                                    this.props.category.api_list.map(function (item) {
                                                        return (
                                                            <Option key={item.api_id}
                                                                    value={item.api_name}>{item.api_name}</Option>
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
                                }} className="form-item" label="接口排序">
                                    {
                                        getFieldDecorator('menu_api_sort', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999}
                                                         placeholder={constant.placeholder + '接口排序'}/>
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

MenuApiDetail.propTypes = {};

MenuApiDetail = Form.create({})(MenuApiDetail);

export default connect(({category}) => ({category}))(MenuApiDetail);