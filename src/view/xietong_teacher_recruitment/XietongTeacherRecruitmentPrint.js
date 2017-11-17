import React, {Component} from 'react';
import {Modal, Row, Col, Spin, Button} from 'antd';
import Print from 'rc-print';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class XietongTeacherRecruitmentPrint extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_load: false,
			is_show: false,
			teacher_recruitment_id: '',
			teacher_recruitment: {}
		}
	}

	componentDidMount() {
		notification.on('notification_xietong_teacher_recruitment_print', this, function (data) {
			this.setState({
				is_show: true,
				teacher_recruitment_id: data.teacher_recruitment_id
			}, function () {
				this.handleLoad();
			});
		});
	}

	componentWillUnmount() {
		notification.remove('notification_xietong_teacher_recruitment_print', this);
	}

	handleLoad() {
		this.setState({
			is_load: true
		});

		http.request({
			url: '/' + constant.action + '/xietong/teacher/recruitment/find',
			data: {
				teacher_recruitment_id: this.state.teacher_recruitment_id
			},
			success: function (data) {
				this.setState({
					teacher_recruitment: data
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
			teacher_recruitment_id: '',
			teacher_recruitment: {}
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
									<span style={{fontSize: '30px', fontWeight: '1000'}}>佛山协同（国际）学校招聘信息表</span>
								</Col>
							</Row>
							<div style={{marginBottom: '50px'}}></div>
							<table width="100%" style={{width: '100%', border: 'solid 1px black'}}>
								<tr>
									<td style={{width: '25%',padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										姓名
									</td>
									<td style={{width: '25%',padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_name}
									</td>
									<td style={{width: '25%',padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										性别
									</td>
									<td style={{width: '25%',padding: '10px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_sex}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										出生日期
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_birthday}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										手机号码
									</td>
									<td style={{padding: '10px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_mobile}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										邮箱地址
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_email}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										应聘学部
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_faculty}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										应聘学科
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_subject}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										是否应届毕业生
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_is_fresh_graduate?'是':'否'}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										工作年限
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_work_year}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										原工作单位
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_old_unit}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										政治面貌
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_politics_status}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										职称
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_job_title}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										学历
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_education}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										专业
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_major}
									</td>
								</tr>
								<tr>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										毕业院校
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_grad_school}
									</td>
									<td style={{padding: '15px', borderRight: 'solid 1px black', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										现在地址
									</td>
									<td style={{padding: '15px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
										{this.state.teacher_recruitment.teacher_recruitment_now_address}
									</td>
								</tr>
								<tr dangerouslySetInnerHTML={{__html: `<td colspan='4' style="padding: 15px; border-bottom: solid 1px black; text-align: center">教育经历</td>`}}></tr>
								<tr dangerouslySetInnerHTML={{__html: `<td colspan='4' style="padding: 15px; border-bottom: solid 1px black; text-align: left">${this.state.teacher_recruitment.teacher_recruitment_education_experience}</td>`}}></tr>
								<tr dangerouslySetInnerHTML={{__html: `<td colspan='4' style="padding: 15px; border-bottom: solid 1px black; text-align: center">工作经历</td>`}}></tr>
								<tr dangerouslySetInnerHTML={{__html: `<td colspan='4' style="padding: 15px; border-bottom: solid 1px black; text-align: left">${this.state.teacher_recruitment.teacher_recruitment_work_experience}</td>`}}></tr>
								<tr dangerouslySetInnerHTML={{__html: `<td colspan='4' style="padding: 15px; border-bottom: solid 1px black; text-align: center">所获代表性荣誉</td>`}}></tr>
								<tr dangerouslySetInnerHTML={{__html: `<td colspan='4' style="padding: 15px; text-align: left">${this.state.teacher_recruitment.teacher_recruitment_representative_honor}</td>`}}></tr>
							</table>
						</div>
					</Print>
				</Spin>
			</Modal>
		);
	}
}

XietongTeacherRecruitmentPrint.propTypes = {};

export default XietongTeacherRecruitmentPrint;