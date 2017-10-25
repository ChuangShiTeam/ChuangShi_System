import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Select, Checkbox, message} from 'antd';

import InputImage from '../../component/InputImage';
import InputHtml from '../../component/InputHtml';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class ProductDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            is_commission: false,
            action: '',
            product_id: '',
            product_category_sku_attribute_list: [],
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_product_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_product_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                product_id: data.product_id
            }, function () {
                setTimeout(function () {
                    this.handleLoad();
                }.bind(this), 300);
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_product_detail_add', this);

        notification.remove('notification_product_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/product/find',
            data: {
                product_id: this.state.product_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                let product_image = [];
                if (data.file_id === '') {

                } else {
                    product_image.push({
                        file_id: data.file_id,
                        file_path: data.file_path
                    });
                }
                this.refs.product_image.handleSetValue(product_image);

                this.refs.product_content.handleSetValue(data.product_content);

                this.props.form.setFieldsValue({
                    product_category_id: data.product_category_id,
                    product_brand_id: data.product_brand_id,
                    product_name: data.product_name,
                    product_is_new: data.product_is_new,
                    product_is_recommend: data.product_is_recommend,
                    product_is_bargain: data.product_is_bargain,
                    product_is_hot: data.product_is_hot,
                    product_is_sold_out: data.product_is_sold_out,
                    product_is_virtual: data.product_is_virtual,
                    product_status: data.product_status
                });

                let product_sku_list = data.product_sku_list;
                for (let i = 0; i < product_sku_list.length; i++) {
                    let product_sku = product_sku_list[i];

                    if (product_sku.product_sku_is_default) {
                        let product_sku_price_list = product_sku.product_sku_price_list;
                        for (let j = 0; j < product_sku_price_list.length; j++) {
                            let product_sku_price = product_sku_price_list[j];

                            let object = {};
                            if (product_sku_price.member_level_id === '') {
                                object['product_sku_price'] = product_sku_price.product_sku_price;
                            } else {
                                object['product_sku_price_' + product_sku_price.member_level_id] = product_sku_price.product_sku_price;
                            }

                            this.props.form.setFieldsValue(object);
                        }

                        let product_sku_commission_list = product_sku.product_sku_commission_list;
                        for (let j = 0; j < product_sku_commission_list.length; j++) {
                            let product_sku_commission = product_sku_commission_list[j];

                            let object = {};
                            object['product_sku_commission_' + product_sku_commission.member_level_id] = product_sku_commission.product_sku_commission;

                            this.props.form.setFieldsValue(object);
                        }
                    }
                }

                this.setState({
                    product_category_sku_attribute_list: data.product_category_sku_attribute_list,
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

            values.product_id = this.state.product_id;
            values.system_version = this.state.system_version;

            let file_list = this.refs.product_image.handleGetValue();
            if (file_list.length === 0) {
                values.product_image = '';
            } else {
                values.product_image = file_list[0].file_id;
            }

            values.product_content = this.refs.product_content.handleGetValue();

            //设置价格
            let product_sku_price_list = [{
                member_level_id: '',
                member_level_name: '',
                product_sku_price: values.product_sku_price
            }];
            delete values.product_sku_price;
            for (let i = 0; i < this.props.product.member_level_list.length; i++) {
                product_sku_price_list.push({
                    member_level_id: this.props.product.member_level_list[i].member_level_id,
                    member_level_name: this.props.product.member_level_list[i].member_level_name,
                    product_sku_price: this.props.form.getFieldValue('product_sku_price_' + this.props.product.member_level_list[i].member_level_id)
                });
                delete values['product_sku_price_' + this.props.product.member_level_list[i].member_level_id];
            }

            //设置佣金
            let product_sku_commission_list = [];
            for (let i = 0; i < this.props.product.member_level_list.length; i++) {
                product_sku_commission_list.push({
                    member_level_id: this.props.product.member_level_list[i].member_level_id,
                    member_level_name: this.props.product.member_level_list[i].member_level_name,
                    product_sku_commission: this.props.form.getFieldValue('product_sku_commission_' + this.props.product.member_level_list[i].member_level_id)
                });
                delete values['product_sku_commission_' + this.props.product.member_level_list[i].member_level_id];
            }

            let product_sku_list = [{
                product_sku_is_default: true,
                product_sku_attribute_list: [],
                product_sku_price_list: product_sku_price_list,
                product_sku_commission_list: product_sku_commission_list
            }];
            values.product_sku_list = product_sku_list;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/product/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_product_index_load', {});

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
            product_id: '',
            system_version: ''
        });

        this.props.form.resetFields();

        this.refs.product_image.handleReset();

        this.refs.product_content.handleReset();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'商品详情'} maskClosable={false} width={document.documentElement.clientWidth - 200}
                   className="modal"
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
                                                            this.props.product.app_list.map(function (item) {
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
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="商品名称">
                                    {
                                        getFieldDecorator('product_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '商品名称'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="分类编号">
                                    {
                                        getFieldDecorator('product_category_id', {
                                            initialValue: ''
                                        })(
                                            <Select allowClear placeholder="请选择分类">
                                                {
                                                    this.props.product.product_category_list.map(function (item) {
                                                        return (
                                                            <Option key={item.product_category_id}
                                                                    value={item.product_category_id}>{item.product_category_name}</Option>
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
                                }} className="form-item" label="品牌编号">
                                    {
                                        getFieldDecorator('product_brand_id', {
                                            initialValue: ''
                                        })(
                                            <Select allowClear placeholder="请选择品牌">
                                                {
                                                    this.props.product.product_brand_list.map(function (item) {
                                                        return (
                                                            <Option key={item.product_brand_id}
                                                                    value={item.product_brand_id}>{item.product_brand_name}</Option>
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
                                }} className="form-image-item form-required-item" label="商品图片">
                                    <InputImage name="product_image" limit={1} ref="product_image"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-image-item form-required-item" label="图片列表">
                                    <InputImage name="product_image_list" limit={5} ref="product_image_list"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="商品标记">
                                    <FormItem style={{width: '82px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_new', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>新品</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '82px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_recommend', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>推荐</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '82px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_bargain', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>特价</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '82px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_hot', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>热销</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '82px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_sold_out', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>售完</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '82px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_virtual', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>虚拟</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '82px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_commission', {
                                                valuePropName: 'checked',
                                                initialValue: this.state.is_commission
                                            })(
                                                <Checkbox>佣金</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '82px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_status', {
                                                valuePropName: 'checked',
                                                initialValue: true
                                            })(
                                                <Checkbox>上架</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="会员价格">
                                    {
                                        this.props.product.member_level_list.map(function (item) {
                                            return (
                                                <div key={item.member_level_id} style={{width: '210px', float: 'left'}}>
                                                    <FormItem hasFeedback {...{
                                                        labelCol: {span: 12},
                                                        wrapperCol: {span: 12}
                                                    }} className="form-item" label={item.member_level_name + '(¥)'}>
                                                        {
                                                            getFieldDecorator('product_sku_price_' + item.member_level_id, {
                                                                rules: [{
                                                                    type: 'number',
                                                                    required: true,
                                                                    message: constant.required
                                                                }],
                                                                initialValue: 0.00
                                                            })(
                                                                <InputNumber min={0} max={99999} step={0.01}
                                                                             placeholder={constant.placeholder + '价格'}/>
                                                            )
                                                        }
                                                    </FormItem>
                                                </div>
                                            )
                                        })
                                    }
                                    <div style={{width: '210px', float: 'left'}}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 12},
                                            wrapperCol: {span: 12}
                                        }} className="form-item" label={'普通会员(¥)'}>
                                            {
                                                getFieldDecorator('product_sku_price', {
                                                    rules: [{
                                                        type: 'number',
                                                        required: true,
                                                        message: constant.required
                                                    }],
                                                    initialValue: 0.00
                                                })(
                                                    <InputNumber min={0} max={99999} step={0.01}
                                                                 placeholder={constant.placeholder + '价格'}/>
                                                )
                                            }
                                        </FormItem>
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            this.state.is_commission ?
                                <Row>
                                    <Col span={24}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 2},
                                            wrapperCol: {span: 22}
                                        }} className="form-item" label="会员佣金">
                                            {
                                                this.props.product.member_level_list.map(function (item) {
                                                    return (
                                                        <div key={item.member_level_id}
                                                             style={{width: '210px', float: 'left'}}>
                                                            <FormItem hasFeedback {...{
                                                                labelCol: {span: 12},
                                                                wrapperCol: {span: 12}
                                                            }} className="form-item"
                                                                      label={item.member_level_name + '(%)'}>
                                                                {
                                                                    getFieldDecorator('product_sku_commission_' + item.member_level_id, {
                                                                        rules: [{
                                                                            type: 'number',
                                                                            required: true,
                                                                            message: constant.required
                                                                        }],
                                                                        initialValue: 0.00
                                                                    })(
                                                                        <InputNumber min={0} max={100} step={1}
                                                                                     placeholder={constant.placeholder + '佣金'}/>
                                                                    )
                                                                }
                                                            </FormItem>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                :
                                ''

                        }
                        <Row>
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-image-item" label="SKU属性">
                                    {
                                        this.state.product_category_sku_attribute_list.map(function (item) {
                                            return (
                                                <FormItem key={item.product_category_id} hasFeedback {...{
                                                    labelCol: {span: 2},
                                                    wrapperCol: {span: 20}
                                                }} className="form-item"
                                                          label={item.product_category_sku_attribute_name}>
                                                    {
                                                        item.product_category_sku_attribute_item_list.map(function (product_category_sku_attribute_item) {
                                                            return (
                                                                <div
                                                                    key={product_category_sku_attribute_item.product_category_sku_attribute_item_id}
                                                                    style={{width: '82px', float: 'left', marginLeft: '10px'}}>
                                                                    <FormItem {...{
                                                                        labelCol: {span: 2},
                                                                        wrapperCol: {span: 22}
                                                                    }} className="form-item"
                                                                    >
                                                                        {
                                                                            getFieldDecorator('product_is_virtual', {
                                                                                valuePropName: 'checked',
                                                                                initialValue: false
                                                                            })(
                                                                                <Checkbox>{product_category_sku_attribute_item.product_category_sku_attribute_item_name}</Checkbox>
                                                                            )
                                                                        }
                                                                    </FormItem>
                                                                </div>
                                                            )
                                                        }.bind(this))
                                                    }
                                                </FormItem>
                                            )
                                        })
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="商品介绍">
                                    <InputHtml name="product_content" ref="product_content"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

ProductDetail.propTypes = {};

ProductDetail = Form.create({})(ProductDetail);

export default connect(({product}) => ({product}))(ProductDetail);