import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Card, Spin, Form, Input, Button} from 'antd';

import constant from '../util/constant';
import './Style.css';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            this.setState({
                is_load: true
            });

            setTimeout(function () {
                this.props.dispatch(routerRedux.push({
                    pathname: '/',
                    query: {}
                }));
            }.bind(this), 1000);
        });
    }

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;

        return (
            <Card className="login_form">
                <Spin spinning={this.state.is_load}>
                    <FormItem hasFeedback className="">
                        {
                            getFieldDecorator('user_account', {
                                rules: [{
                                    required: true,
                                    message: constant.required
                                }],
                                initialValue: 'admin'
                            })(
                                <Input type="text" placeholder={'用户名'}/>
                            )
                        }
                    </FormItem>
                    <FormItem hasFeedback className="">
                        {
                            getFieldDecorator('user_password', {
                                rules: [{
                                    required: true,
                                    message: constant.required
                                }],
                                initialValue: 'admin'
                            })(
                                <Input type="password" placeholder={'密码'}/>
                            )
                        }
                    </FormItem>
                    <FormItem style={{
                        marginBottom: '0px'
                    }}>
                        <Button type="primary" htmlType="submit" className="" size="default"
                                loading={this.state.is_load}
                                onClick={this.handleSubmit.bind(this)}>登录总控后台</Button>
                    </FormItem>
                </Spin>
            </Card>
        );
    }
}

Login.propTypes = {};

Login = Form.create({})(Login);

export default connect(() => ({}))(Login);
