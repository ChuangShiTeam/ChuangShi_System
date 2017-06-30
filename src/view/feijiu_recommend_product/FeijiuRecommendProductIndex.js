import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, Popconfirm, message} from 'antd';

import FeijiuRecommendProductDetail from './FeijiuRecommendProductDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class FeijiuRecommendProductIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            product_name: this.props.feijiu_recommend_product.product_name
        });

        this.handleLoad();

        notification.on('notification_feijiu_recommend_product_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_feijiu_recommend_product_index_load', this);
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'feijiu_recommend_product/fetch',
                data: {
                    product_name: this.props.form.getFieldValue('product_name'),
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
            url: '/feijiu/recommend/product/admin/list',
            data: {
                product_name: this.props.feijiu_recommend_product.product_name,
                page_index: this.props.feijiu_recommend_product.page_index,
                page_size: this.props.feijiu_recommend_product.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'feijiu_recommend_product/fetch',
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
                type: 'feijiu_recommend_product/fetch',
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
                type: 'feijiu_recommend_product/fetch',
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
        notification.emit('notification_feijiu_recommend_product_detail_add', {});
    }

    handleEdit(product_id) {
        notification.emit('notification_feijiu_recommend_product_detail_edit', {
            product_id: product_id
        });
    }

    handleDel(product_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/feijiu/recommend/product/admin/delete',
            data: {
                product_id: product_id,
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

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '名称',
            dataIndex: 'product_name'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.product_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.product_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.feijiu_recommend_product.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.feijiu_recommend_product.page_index,
            pageSize: this.props.feijiu_recommend_product.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">信息</div>
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
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="产品名称">
                                {
                                    getFieldDecorator('product_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入产品名称"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="product_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.feijiu_recommend_product.list} pagination={pagination}
                       bordered/>
                <FeijiuRecommendProductDetail/>
            </QueueAnim>
        );
    }
}

FeijiuRecommendProductIndex.propTypes = {};

FeijiuRecommendProductIndex = Form.create({})(FeijiuRecommendProductIndex);

export default connect(({feijiu_recommend_product}) => ({
    feijiu_recommend_product
}))(FeijiuRecommendProductIndex);