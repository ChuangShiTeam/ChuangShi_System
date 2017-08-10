import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import FeijiuFastCreditCardDetail from './FeijiuFastCreditCardDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class FeijiuFastCreditCardIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.feijiu_fast_credit_card.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            credit_card_name: this.props.feijiu_fast_credit_card.credit_card_name,
        });

        this.handleLoad();

        notification.on('notification_feijiu_fast_credit_card_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_feijiu_fast_credit_card_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'feijiu_fast_credit_card/fetch',
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

            let credit_card_name = this.props.form.getFieldValue('credit_card_name');

            this.props.dispatch({
                type: 'feijiu_fast_credit_card/fetch',
                data: {
                    app_id: app_id,
                    credit_card_name: credit_card_name,
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
            url: '/' + constant.action + '/feijiu/fast/credit/card/list',
            data: {
                app_id: this.props.feijiu_fast_credit_card.app_id,
                credit_card_name: this.props.feijiu_fast_credit_card.credit_card_name,
                page_index: this.props.feijiu_fast_credit_card.page_index,
                page_size: this.props.feijiu_fast_credit_card.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'feijiu_fast_credit_card/fetch',
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
                type: 'feijiu_fast_credit_card/fetch',
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
                type: 'feijiu_fast_credit_card/fetch',
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
        notification.emit('notification_feijiu_fast_credit_card_detail_add', {});
    }

    handleEdit(credit_card_id) {
        notification.emit('notification_feijiu_fast_credit_card_detail_edit', {
            credit_card_id: credit_card_id
        });
    }

    handleDel(credit_card_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/feijiu/fast/credit/card/delete',
            data: {
                credit_card_id: credit_card_id,
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
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '信用卡名称',
            dataIndex: 'credit_card_name'
        }, {
            title: '信用卡链接',
            dataIndex: 'credit_card_link'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.credit_card_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.credit_card_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.feijiu_fast_credit_card.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.feijiu_fast_credit_card.page_index,
            pageSize: this.props.feijiu_fast_credit_card.page_size,
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
                                                        this.props.feijiu_fast_credit_card.app_list.map(function (item) {
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
                            }} className="content-search-item" label="信用卡名称">
                                {
                                    getFieldDecorator('credit_card_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入信用卡名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="credit_card_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.feijiu_fast_credit_card.list} pagination={pagination}
                       bordered/>
                <FeijiuFastCreditCardDetail/>
            </QueueAnim>
        );
    }
}

FeijiuFastCreditCardIndex.propTypes = {};

FeijiuFastCreditCardIndex = Form.create({})(FeijiuFastCreditCardIndex);

export default connect(({feijiu_fast_credit_card}) => ({
    feijiu_fast_credit_card
}))(FeijiuFastCreditCardIndex);