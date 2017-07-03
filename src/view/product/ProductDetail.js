import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, Checkbox, message} from 'antd';

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
            action: '',
            product_id: '',
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
                }.bind(this), 200);
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
            url: '/product/' + constant.action + '/find',
            data: {
                product_id: this.state.product_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                var product_image = [];
                if (data.product_image_file !== '') {
                    product_image.push(data.product_image_file);
                }
                this.refs.product_image.handleSetValue(product_image);

                this.refs.product_content.handleSetValue(data.product_content);

                this.props.form.setFieldsValue({
                    category_id: data.category_id,
                    brand_id: data.brand_id,
                    product_name: data.product_name,
                    product_is_new: data.product_is_new,
                    product_is_recommend: data.product_is_recommend,
                    product_is_bargain: data.product_is_bargain,
                    product_is_hot: data.product_is_hot,
                    product_is_sold_out: data.product_is_sold_out,
                    product_is_virtual: data.product_is_virtual,
                    product_status: data.product_status,
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

            values.product_id = this.state.product_id;
            values.system_version = this.state.system_version;

            var file_list = this.refs.product_image.handleGetValue();
            if (file_list.length === 0) {
                values.product_image = '';
            } else {
                values.product_image = file_list[0].file_id;
            }

            values.product_content = this.refs.product_content.handleGetValue();

            this.setState({
                is_load: true
            });

            http.request({
                url: '/product/' + constant.action + '/' + this.state.action,
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
            <Modal title={'商品详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                            <Col span={16}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 3},
                                    wrapperCol: {span: 21}
                                }} className="form-item" label="商品名称">
                                    {
                                        getFieldDecorator('product_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '商品名称'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                        getFieldDecorator('category_id', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '分类编号'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                        getFieldDecorator('brand_id', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '品牌编号'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="商品标记">
                                    <FormItem style={{width: '70px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_new', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>新品</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '70px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_recommend', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>推荐</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '70px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_bargain', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>特价</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '70px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_hot', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>热销</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '70px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_sold_out', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>售完</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '70px', float: 'left'}}>
                                        {
                                            getFieldDecorator('product_is_virtual', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <Checkbox>虚拟</Checkbox>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem style={{width: '70px', float: 'left'}}>
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