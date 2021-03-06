import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Modal, Row, Col, Button, Form, Select, Table, Popconfirm, message} from 'antd';

import ProductCategorySkuAttributeDetail from './ProductCategorySkuAttributeDetail';
import ProductCategorySkuAttributeItemIndex from '../product_category_sku_attribute_item/ProductCategorySkuAttributeItemIndex';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class ProductCategorySkuAttributeIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false
        }
    }

    componentDidMount() {
        notification.on('notification_product_category_sku_attribute_index_list', this, function (data) {
            this.setState({
                is_show: true
            });

            new Promise(function (resolve, reject) {
                this.props.dispatch({
                    type: 'product_category_sku_attribute/fetch',
                    data: {
                        product_category_id: data.product_category_id
                    }
                });

                resolve();
            }.bind(this)).then(function () {
                this.handleLoad();
            }.bind(this));
        });

        notification.on('notification_product_category_sku_attribute_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_product_category_sku_attribute_index_load', this);
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'product_category_sku_attribute/fetch',
                data: {
                    page_index: 1
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
            url: '/' + constant.action + '/product/category/sku/attribute/list',
            data: {
                product_category_id: this.props.product_category_sku_attribute.product_category_id,
                page_index: this.props.product_category_sku_attribute.page_index,
                page_size: this.props.product_category_sku_attribute.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'product_category_sku_attribute/fetch',
                    data: {
                        total: data.total,
                        list: data.list
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

    handleChangeIndex(page_index) {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'product_category_sku_attribute/fetch',
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
                type: 'product_category_sku_attribute/fetch',
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
        notification.emit('notification_product_category_sku_attribute_detail_add', {
            product_category_id: this.props.product_category_sku_attribute.product_category_id
        });
    }

    handleEdit(product_category_sku_attribute_id) {
        notification.emit('notification_product_category_sku_attribute_detail_edit', {
            product_category_sku_attribute_id: product_category_sku_attribute_id
        });
    }

    handleDel(product_category_sku_attribute_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/product/category/sku/attribute/delete',
            data: {
                product_category_sku_attribute_id: product_category_sku_attribute_id,
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

    handleItem(product_category_sku_attribute_id) {
        notification.emit('notification_product_category_sku_attribute_item_index_list', {
            product_category_sku_attribute_id: product_category_sku_attribute_id
        });
    }

    handleCancel() {
        this.setState({
            is_load: false,
            is_show: false,
            product_category_id: ''
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: 'SKU属性名称',
            dataIndex: 'product_category_sku_attribute_name'
        }, {
            title: 'SKU属性排序',
            dataIndex: 'product_category_sku_attribute_sort'
        }, {
            width: 200,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleItem.bind(this, record.product_category_sku_attribute_id)}>选项</a>
                  <span className="divider"/>
                  <a onClick={this.handleEdit.bind(this, record.product_category_sku_attribute_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.product_category_sku_attribute_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.product_category_sku_attribute.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.product_category_sku_attribute.page_index,
            pageSize: this.props.product_category_sku_attribute.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <Modal title={'SKU属性信息'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={this.handleCancel.bind(this)}>确定</Button>
                   ]}
            >
                <Row key="0" className="content-title">
                    <Col span={8}>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="plus-circle" size="default"
                                onClick={this.handleAdd.bind(this)}>{constant.add}</Button>
                    </Col>
                </Row>
                <Table key="2"
                       rowKey="product_category_sku_attribute_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.product_category_sku_attribute.list} pagination={pagination}
                       bordered/>
                <ProductCategorySkuAttributeDetail/>
                <ProductCategorySkuAttributeItemIndex/>
            </Modal>
        );
    }
}

ProductCategorySkuAttributeIndex.propTypes = {};

ProductCategorySkuAttributeIndex = Form.create({})(ProductCategorySkuAttributeIndex);

export default connect(({product_category_sku_attribute}) => ({
    product_category_sku_attribute
}))(ProductCategorySkuAttributeIndex);