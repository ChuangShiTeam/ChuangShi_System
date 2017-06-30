import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, message} from 'antd';

import InputImage from '../../component/InputImage';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class FeijiuRecommendProductDetail extends Component {
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
        notification.on('notification_feijiu_recommend_product_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_feijiu_recommend_product_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                product_id: data.product_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_feijiu_recommend_product_detail_add', this);

        notification.remove('notification_feijiu_recommend_product_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/feijiu/recommend/product/admin/find',
            data: {
                product_id: this.state.product_id
            },
            success: function (data) {
                this.props.form.setFieldsValue({
                    product_name: data.product_name,
                    product_content: data.product_content,
                });

                var product_image = [];
                if (data.product_image_file !== '') {
                    product_image.push(data.product_image_file);
                }
                this.refs.product_image.handleSetValue(product_image);

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

            this.setState({
                is_load: true
            });

            http.request({
                url: '/feijiu/recommend/product/admin/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_feijiu_recommend_product_index_load', {});

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

        this.refs.product_image.handleSetValue([]);
    }

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;

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
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="商品名称">
                                    {
                                        getFieldDecorator('product_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '商品名称'}/>
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
                            <Col span={16}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 3},
                                    wrapperCol: {span: 21}
                                }} className="form-item" label="商品介绍">
                                    {
                                        getFieldDecorator('product_content', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="textarea" rows={4} placeholder={constant.placeholder + '商品介绍'}/>
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

FeijiuRecommendProductDetail.propTypes = {};

FeijiuRecommendProductDetail = Form.create({})(FeijiuRecommendProductDetail);

export default connect(({feijiu_recommend_product}) => ({feijiu_recommend_product}))(FeijiuRecommendProductDetail);