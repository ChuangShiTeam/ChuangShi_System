import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, InputNumber, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class ProductCategorySkuAttributeDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            product_category_sku_attribute_id: '',
            product_category_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_product_category_sku_attribute_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                product_category_id: data.product_category_id
            });
        });

        notification.on('notification_product_category_sku_attribute_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                product_category_sku_attribute_id: data.product_category_sku_attribute_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_product_category_sku_attribute_detail_add', this);

        notification.remove('notification_product_category_sku_attribute_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/product/category/sku/attribute/find',
            data: {
                product_category_sku_attribute_id: this.state.product_category_sku_attribute_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    product_category_sku_attribute_name: data.product_category_sku_attribute_name,
                    product_category_sku_attribute_sort: data.product_category_sku_attribute_sort,
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

            values.product_category_sku_attribute_id = this.state.product_category_sku_attribute_id;
            values.product_category_id = this.state.product_category_id;
            values.system_version = this.state.system_version;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/product/category/sku/attribute/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_product_category_sku_attribute_index_load', {});

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
            product_category_sku_attribute_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'SKU属性详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                }} className="form-item" label="属性名称">
                                    {
                                        getFieldDecorator('product_category_sku_attribute_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '属性名称'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="属性排序">
                                    {
                                        getFieldDecorator('product_category_sku_attribute_sort', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999} placeholder={constant.placeholder + '属性排序'} onPressEnter={this.handleSubmit.bind(this)}/>
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

ProductCategorySkuAttributeDetail.propTypes = {};

ProductCategorySkuAttributeDetail = Form.create({})(ProductCategorySkuAttributeDetail);

export default connect(({product_category_sku_attribute}) => ({product_category_sku_attribute}))(ProductCategorySkuAttributeDetail);