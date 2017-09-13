import constant from '../util/constant';

export default {

	namespace: 'xietong_course',

	state: {
		app_id: '',
		app_list: [],
		course_teacher: '',
		course_name: '',
		total: 0,
		page_index: 1,
		page_size: constant.page_size,
		list: []
	},

	reducers: {
		fetch(state, action) {
			return {...state, ...action.data};
		}
	}

};