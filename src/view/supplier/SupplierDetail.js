import React, {Component} from "react";
import {connect} from "dva";
import {Button, Col, Form, Input, message, Modal, Row, Select, Spin, Switch, Table} from "antd";
import constant from "../../util/constant";
import notification from "../../util/notification";
import http from "../../util/http";

class SupplierDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            supplier_id: '',
            system_version: 0,
            product_list: [],
            selectedRows: [],
            selectedRowKeys: []
        }
    }

    componentDidMount() {
        notification.on('notification_supplier_detail_add', this, function () {
            this.setState({
                is_show: true,
                action: 'save'
            });
            this.handleLoad();
        });

        notification.on('notification_supplier_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                supplier_id: data.supplier_id
            });
            this.handleLoad(data.supplier_id);
        });
    }

    componentWillUnmount() {
        notification.remove('notification_supplier_detail_add', this);

        notification.remove('notification_supplier_detail_edit', this);
    }

    handleLoad(supplier_id) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/supplier/' + constant.action + '/find',
            data: {
                supplier_id: supplier_id
            },
            success: function (data) {
                if (this.state.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                if (this.state.action === 'update') {
                    this.props.form.setFieldsValue({
                        user_id: data.user_id,
                        user_name: data.user_name,
                        user_account: data.user_account,
                        supplier_status: data.supplier_status
                    });

                    this.setState({
                        supplier_id: data.supplier_id,
                        system_version: data.system_version,
                        selectedRowKeys: data.selectedRowKeys
                    });
                }

                this.setState({
                    product_list: data.product_list
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
            this.setState({
                is_load: true
            });
            var selectedRows = this.state.selectedRows;
            var temp = [];
            for (var i = 0; i < selectedRows.length; i++) {
                temp.push({"product_id": selectedRows[i].product_id});
            }
            values.product_list = temp;
            if (this.state.action === "update") {
                values.supplier_id = this.state.supplier_id;
                values.system_version = this.state.system_version;
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

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;
        const columns = [{
            title: '名称',
            dataIndex: 'product_name',
            render: (text, record, index) => (
                <span>
                    {record.product_name}
                </span>
            )
        }, {
            title: '图片',
            dataIndex: 'product_image',
            render: (text, record, index) => (
                <div className="clearfix">
                    <img alt="example" style={{width: '100%'}} src={constant.host + record.product_image}/>
                </div>
            )
        }];
        const selectedRowKeys = this.state.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                console.log("selectedRowKeys ===", selectedRowKeys);
                this.setState({
                    selectedRows: selectedRows,
                    selectedRowKeys: selectedRowKeys
                });
            }
        };

        return (
            <Modal title={this.state.action === 'save' ? '添加' : this.state.action === 'update' ? '修改' : "详情"}
                   maskClosable={false} width={document.documentElement.clientWidth - 200}
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
                        <h2>基本信息</h2>
                        <br/>
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
                                }} className="form-item" label="供应商帐号">
                                    {
                                        getFieldDecorator('user_account', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '供应商帐号'}
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
                                }} className="form-item" label="供应商密码">
                                    {
                                        getFieldDecorator('user_password', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '供应商密码'}
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
                        <br/>
                        <h2>商品列表</h2>
                        <br/>
                        <Row>
                            <Col span={18}>
                                <Table
                                    key="product_id"
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={this.state.product_list}
                                    pagination={false}
                                />
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