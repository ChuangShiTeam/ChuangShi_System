import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import ProductCategoryDetail from './ProductCategoryDetail';
import ProductCategorySkuAttributeIndex from '../product_category_sku_attribute/ProductCategorySkuAttributeIndex';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class ProductCategoryIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.product_category.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            product_category_name: this.props.product_category.product_category_name
        });

        this.handleLoad();

        notification.on('notification_product_category_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_product_category_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'product_category/fetch',
                    data: {
                        app_list: data
                    }
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            let app_id = this.props.form.getFieldValue('app_id');
            if (validate.isUndefined(app_id)) {
                app_id = '';
            }

            let product_category_name = this.props.form.getFieldValue('product_category_name');

            this.props.dispatch({
                type: 'product_category/fetch',
                data: {
                    app_id: app_id,
                    product_category_name: product_category_name
                }
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/product/category/' + constant.action + '/list',
            data: {
                app_id: this.props.product_category.app_id,
                product_category_name: this.props.product_category.product_category_name
            },
            success: function (data) {
                let expandedRowKeys = this.setExpandedRowKeys(data);

                this.props.dispatch({
                    type: 'product_category/fetch',
                    data: {
                        list: data,
                        expandedRowKeys: expandedRowKeys
                    }
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    setExpandedRowKeys(list) {
        let expandedRowKeys = [];

        for (let i = 0; i < list.length; i++) {
            expandedRowKeys.push(list[i].product_category_id);

            if (list[i].children) {
                expandedRowKeys = expandedRowKeys.concat(this.setExpandedRowKeys(list[i].children));
            }
        }

        return expandedRowKeys;
    }

    handleChangeIndex(page_index) {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'product_category/fetch',
                data: {
                    page_index: page_index
                }
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleChangeSize(page_index, page_size) {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'product_category/fetch',
                data: {
                    page_index: page_index,
                    page_size: page_size
                }
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleAdd() {
        notification.emit('notification_product_category_detail_add', {
            product_category_parent_id: ''
        });
    }

    handleEdit(product_category_id) {
        notification.emit('notification_product_category_detail_edit', {
            product_category_id: product_category_id
        });
    }

    handleDel(product_category_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/product/category/' + constant.action + '/delete',
            data: {
                product_category_id: product_category_id,
                system_version: system_version
            },
            success: function (data) {
                message.success(constant.success);

                this.handleLoad();
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleSku(product_category_id){
        notification.emit('notification_product_category_sku_attribute_index_list', {
            product_category_id: product_category_id
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '名称',
            dataIndex: 'product_category_name'
        }, {
            width: 200,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleSku.bind(this, record.product_category_id)}>SKU</a>
                  <span className="divider"/>
                  <a onClick={this.handleEdit.bind(this, record.product_category_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.product_category_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">商品分类信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="plus-circle" size="default"
                                onClick={this.handleAdd.bind(this)}>{constant.add}</Button>
                    </Col>
                </Row>
                <Form key="1" className="content-search margin-top">
                    <Row>
                        {
                            constant.action === 'system' ?
                                <Col span={8}>
                                    <FormItem hasFeedback {...{
                                        labelCol: {span: 6},
                                        wrapperCol: {span: 18}
                                    }} className="content-search-item" label="应用名称">
                                        {
                                            getFieldDecorator('app_id', {
                                                initialValue: ''
                                            })(
                                                <Select allowClear placeholder="请选择应用">
                                                    {
                                                        this.props.product_category.app_list.map(function (item) {
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
                                :
                                ''
                        }
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="名称">
                                {
                                    getFieldDecorator('product_category_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="product_category_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.product_category.list} pagination={false}
                       bordered/>
                <ProductCategoryDetail/>
                <ProductCategorySkuAttributeIndex/>
            </QueueAnim>
        );
    }
}

ProductCategoryIndex.propTypes = {};

ProductCategoryIndex = Form.create({})(ProductCategoryIndex);

export default connect(({product_category}) => ({
    product_category
}))(ProductCategoryIndex);