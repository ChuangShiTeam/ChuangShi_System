import constant from '../util/constant';

export default {

	namespace: 'company_stock',

	state: {
		app_id: '',
		app_list: [],
		total: 0,
		page_index: 1,
		page_size: constant.page_size,
		list: [],
		stock_type: '',
		stock_action: '',
		product_name: ''
	},

	reducers: {
		fetch(state, action) {
			return {...state, ...action.data};
		}
	}

};