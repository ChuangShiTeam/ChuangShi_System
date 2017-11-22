import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Row, Col, Spin, Button} from 'antd';
import Print from 'rc-print';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class XietongSignupJuniorPrint extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_load: false,
			is_show: false,
			signup_id: '',
			signup_junior: {}
		}
	}

	componentDidMount() {
		notification.on('notification_xietong_signup_junior_print', this, function (data) {
			this.setState({
				is_show: true,
				signup_id: data.signup_id
			}, function () {
				this.handleLoad();
			});
		});
	}

	componentWillUnmount() {
		notification.remove('notification_xietong_signup_junior_print', this);
	}

	handleLoad() {
		this.setState({
			is_load: true
		});

		http.request({
			url: '/' + constant.action + '/xietong/signup/junior/find',
			data: {
				signup_id: this.state.signup_id
			},
			success: function (data) {
				this.setState({
					signup_junior: data
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
			signup_id: '',
			signup_junior: {}
		});
	}

	render() {
		return (
			<Modal title={'打印预览'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
				   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
				   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={() => {this.refs.print.onPrint();}}>打印</Button>
                   ]}
			>
				<Spin spinning={this.state.is_load}>
					<Print ref="print" insertHead={false}>
						<div>
							<div style={{marginBottom: '50px'}}></div>
							<Row>
								<Col md={24} style={{textAlign: 'center'}}>
									<span style={{fontSize: '30px', fontWeight: '1000'}}>佛山协同（国际）学校{this.state.signup_junior.student_category}自荐报名表</span>
								</Col>
							</Row>
							<div style={{marginBottom: '50px'}}></div>
							<table width="100%" style={{width: '100%', border: 'solid 1px black'}}>
								<tr>
									<td style={{width: '25%', padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										姓名
									</td>
									<td style={{width: '25%', padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.student_name}
									</td>
									<td style={{width: '25%', padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										性别
									</td>
									<td style={{width: '25%', padding: '10px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.student_sex}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										出生年月日
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.student_birthday}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										原就读小学
									</td>
									<td style={{padding: '10px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.primary_school}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										小学班级
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.primary_school_class}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										担任职务
									</td>
									<td style={{padding: '10px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.job}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										证件类型
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.id_type}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										证件号码
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.id_no}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										户籍地址
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.permanent_address}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										居住地址
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.live_addresss}
									</td>
								</tr>
								<tr dangerouslySetInnerHTML={{__html: `<td colspan='4' style="padding: 15px; border-bottom: solid 1px black; text-align: center">家庭主要成员</td>`}}></tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										姓名
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										称谓
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										联系电话
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										工作单位
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.father_name}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										父亲
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.father_phone}
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.father_work}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.mother_name}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										母亲
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.mother_phone}
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.signup_junior.mother_work}
									</td>
								</tr>
								<tr dangerouslySetInnerHTML={{__html: `<td colspan='4' style="padding: 15px; border-bottom: solid 1px black; text-align: center">需要说明事项</td>`}}></tr>
								<tr dangerouslySetInnerHTML={{__html: `<td colspan='4' style="padding: 15px; border-bottom: solid 1px black; text-align: left">${this.state.signup_junior.remark}</td>`}}></tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										家长签名
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>

									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										学校受理人签名
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>

									</td>
								</tr>
								<tr dangerouslySetInnerHTML={{__html: `<td colspan='1' style="padding: 15px; border-right: solid 1px black; text-align: center">填报日期</td><td colspan='1' style="padding: 15px; border-right: solid 1px black; text-align: center"></td><td colspan='1' style="padding: 15px; border-right: solid 1px black; text-align: center">报名状态</td><td colspan='1' style="padding: 15px; text-align: left">已报名</td>`}}></tr>
							</table>
						</div>
					</Print>
				</Spin>
			</Modal>
		);
	}
}

XietongSignupJuniorPrint.propTypes = {};

export default connect(({xietong_signup_junior}) => ({xietong_signup_junior}))(XietongSignupJuniorPrint);