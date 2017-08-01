import constant from '../util/constant';

export default {

	namespace: 'warehouse_member_delivery_order',

	state: {
		app_id: '',
		app_list: [],
		user_name: '',
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