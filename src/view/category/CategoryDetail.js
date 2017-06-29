import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class CategoryDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            is_children: false,
            action: '',
            category_id: '',
            parent_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_category_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                is_children: data.is_children,
                action: 'save',
                parent_id: data.parent_id,
            });

            if (constant.action === 'system') {
                this.props.form.setFieldsValue({
                    app_id: data.app_id,
                });
            }

            this.props.form.setFieldsValue({
                category_type: data.category_type
            });
        });

        notification.on('notification_category_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                is_children: data.is_children,
                action: 'update',
                category_id: data.category_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_category_detail_add', this);

        notification.remove('notification_category_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/category/' + constant.action + '/find',
            data: {
                category_id: this.state.category_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
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
                url: '/category/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    if (this.state.is_children) {
                        notification.emit('notification_category_children_load', {});
                    } else {
                        notification.emit('notification_category_index_load', {});
                    }

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
            is_children: false,
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
            <Modal title={'分类详情'} maskClosable={false} width={document.documentElement.clientWidth - 200}
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
                                                            this.props.category.app_list.map(function (item) {
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
                                }} className="form-item" label="分类名称">
                                    {
                                        getFieldDecorator('category_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '分类名称'}/>
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
                                }} className="form-item" label="分类图片">
                                    {
                                        getFieldDecorator('category_image', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '分类图片'}/>
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
                                }} className="form-item" label="分类键值">
                                    {
                                        getFieldDecorator('category_key', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '分类键值'}/>
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
                                }} className="form-item" label="分类数值">
                                    {
                                        getFieldDecorator('category_value', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '分类数值'}/>
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
                                }} className="form-item" label="分类排序">
                                    {
                                        getFieldDecorator('category_sort', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999}
                                                         placeholder={constant.placeholder + '分类排序'}/>
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
                                }} className="form-item" label="分类类型">
                                    {
                                        getFieldDecorator('category_type', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select allowClear placeholder="请选分类类型">
                                                <Option key="MENU" value="MENU">菜单</Option>
                                                <Option key="PRODUCT" value="PRODUCT">商品</Option>
                                                <Option key="ARTICLE" value="ARTICLE">文章</Option>
                                                <Option key="EMPLOYEE_ORGANIZATION" value="EMPLOYEE_ORGANIZATION">员工组织架构</Option>
                                                <Option key="MEMBER_ORGANIZATION" value="MEMBER_ORGANIZATION">会员组织架构</Option>
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
                                }} className="form-item" label="外键编号">
                                    {
                                        getFieldDecorator('object_id', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '外键编号'}/>
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

CategoryDetail.propTypes = {};

CategoryDetail = Form.create({})(CategoryDetail);

export default connect(({category}) => ({category}))(CategoryDetail);