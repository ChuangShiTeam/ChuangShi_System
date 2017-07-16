import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Switch, Select, InputNumber} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class ExpressDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            express_id: '',
            system_version: '',
        }
    }

    componentDidMount() {
        notification.on('notification_express_detail_view', this, function (data) {
            this.setState({
                is_show: true,
                express_id: data.express_id
            }, function () {
                this.handleLoad();
            });
        });

    }

    componentWillUnmount() {
        notification.remove('notification_express_detail_view', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/express/' + constant.action + '/find',
            data: {
                express_id: this.state.express_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    express_shipper_code: data.express_shipper_code,
                    express_no: data.express_no,
                    express_type: data.express_type,
                    express_receiver_company: data.express_receiver_company,
                    express_receiver_name: data.express_receiver_name,
                    express_receiver_tel: data.express_receiver_tel,
                    express_receiver_mobile: data.express_receiver_mobile,
                    express_receiver_postcode: data.express_receiver_postcode,
                    express_receiver_province: data.express_receiver_province,
                    express_receiver_city: data.express_receiver_city,
                    express_receiver_area: data.express_receiver_area,
                    express_receiver_address: data.express_receiver_address,
                    express_sender_company: data.express_sender_company,
                    express_sender_name: data.express_sender_name,
                    express_sender_tel: data.express_sender_tel,
                    express_sender_mobile: data.express_sender_mobile,
                    express_sender_postcode: data.express_sender_postcode,
                    express_sender_province: data.express_sender_province,
                    express_sender_city: data.express_sender_city,
                    express_sender_area: data.express_sender_area,
                    express_sender_address: data.express_sender_address,
                    express_cost: data.express_cost,
                    express_is_pay: data.express_is_pay,
                    express_pay_way: data.express_pay_way,
                    express_start_date: data.express_start_date,
                    express_end_date: data.express_end_date,
                    express_logistics: data.express_logistics,
                    express_status: data.express_status,
                    express_remark: data.express_remark
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

    handleCancel() {
        this.setState({
            is_load: false,
            is_show: false,
            action: '',
            express_id: '',
            system_version: '',
            is_view: false
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'快递单详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[<Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>]}
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
                                                            this.props.express.app_list.map(function (item) {
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
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="快递公司编码">
                                    {
                                        getFieldDecorator('express_shipper_code', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
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
                                }} className="form-item" label="快递单号">
                                    {
                                        getFieldDecorator('express_no', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="快递类型">
                                    {
                                        getFieldDecorator('express_type', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人">
                                    {
                                        getFieldDecorator('express_receiver_name', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人手机">
                                    {
                                        getFieldDecorator('express_receiver_mobile', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人省">
                                    {
                                        getFieldDecorator('express_receiver_province', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人市">
                                    {
                                        getFieldDecorator('express_receiver_city', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人区">
                                    {
                                        getFieldDecorator('express_receiver_area', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货详细地址">
                                    {
                                        getFieldDecorator('express_receiver_address', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="发货人">
                                    {
                                        getFieldDecorator('express_sender_name', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="发货人手机">
                                    {
                                        getFieldDecorator('express_sender_mobile', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="发货人省">
                                    {
                                        getFieldDecorator('express_sender_province', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="发货人市">
                                    {
                                        getFieldDecorator('express_sender_city', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="发货人区">
                                    {
                                        getFieldDecorator('express_sender_area', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="发货人详细地址">
                                    {
                                        getFieldDecorator('express_sender_address', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
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
                                }} className="form-item" label="寄件费（运费）">
                                    {
                                        getFieldDecorator('express_cost', {
                                            initialValue: ''
                                        })(
                                            <InputNumber/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="运费是否支付">
                                    {
                                        getFieldDecorator('express_is_pay', {
                                            valuePropName: 'checked',
                                            initialValue: false
                                        })(
                                            <Switch />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="运费支付方式">
                                    {
                                        getFieldDecorator('express_pay_way', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="快递发货时间">
                                    {
                                        getFieldDecorator('express_start_date', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
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
                                }} className="form-item" label="快递取货时间">
                                    {
                                        getFieldDecorator('express_end_date', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="物流信息">
                                    {
                                        getFieldDecorator('express_logistics', {
                                            initialValue: ''
                                        })(
                                            <Input type="textarea" rows={4}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="状态">
                                    {
                                        getFieldDecorator('express_status', {
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
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
                                }} className="form-item" label="备注">
                                    {
                                        getFieldDecorator('express_remark', {
                                            initialValue: ''
                                        })(
                                            <Input type="textarea" rows={4}/>
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

ExpressDetail.propTypes = {};

ExpressDetail = Form.create({})(ExpressDetail);

export default connect(({express}) => ({express}))(ExpressDetail);