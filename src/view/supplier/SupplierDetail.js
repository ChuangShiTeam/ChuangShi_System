import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message, Switch, Checkbox} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class SupplierDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            supplier_id: '',
            system_version: '',
            product_list: [],
            all_list: [],
            checkedList: [],
            indeterminate: true,
            checkAll: false
        }
    }

    componentDidMount() {
        notification.on('notification_supplier_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_supplier_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                supplier_id: data.supplier_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_supplier_detail_add', this);

        notification.remove('notification_supplier_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/supplier/' + constant.action + '/find',
            data: {
                supplier_id: this.state.supplier_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    user_id: data.user_id,
                    user_name: data.user_name,
                    supplier_status: data.supplier_status
                });

                var product_name_list = [];
                for (let j = 0; j < data.product_list.length; j++) {
                    product_name_list.push(data.product_list[j].product_name)
                }

                this.setState({
                    product_list: data.product_list,
                    product_name_list: product_name_list,
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

            values.supplier_id = this.state.supplier_id;
            values.system_version = this.state.system_version;

            this.setState({
                is_load: true
            });

            var product_name_list = this.state.product_name_list;
            var product_list = this.state.product_list;

            values.product_list = [];
            for (let j = 0; j < product_name_list.length; j++) {
                for (let i = 0; i < product_list.length; i++) {
                    if (product_name_list[j].product_name == product_list[i].product_name ) {
                        values.product_list.push(product_list[i].product_id);
                        break;
                    }
                }
            }

            http.request({
                url: '/supplier/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_supplier_index_load', {});

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
            supplier_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.product_name_list.length),
            checkAll: checkedList.length === this.state.product_name_list.length,
        });
    }

    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? this.state.product_name_list : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;
        const CheckboxGroup = Checkbox.Group;

        return (
            <Modal title={'详情'} maskClosable={false} width={document.documentElement.clientWidth - 200}
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
                                                            this.props.supplier.app_list.map(function (item) {
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
                                }} className="form-item" label="供应商名称">
                                    {
                                        getFieldDecorator('user_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '供应商名称'}
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
                                }} className="form-item" label="供应商状态">
                                    {
                                        getFieldDecorator('supplier_status', {
                                            valuePropName: 'checked',
                                            initialValue: true
                                        })(
                                            <Switch />
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
                                }} className="form-item" label="商品">
                                    <div>
                                        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                            <Checkbox
                                                indeterminate={this.state.indeterminate}
                                                onChange={this.onCheckAllChange}
                                                checked={this.state.checkAll}
                                            >
                                                Check all
                                            </Checkbox>
                                        </div>
                                        <br />
                                        <CheckboxGroup options={this.state.product_name_list}
                                                       value={this.state.checkedList}
                                                       onChange={this.onChange}/>
                                    </div>
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

SupplierDetail.propTypes = {};

SupplierDetail = Form.create({})(SupplierDetail);

export default connect(({supplier}) => ({supplier}))(SupplierDetail);