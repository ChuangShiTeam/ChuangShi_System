import constant from '../util/constant';

export default {

	namespace: 'app_stock',

	state: {
		app_id: '',
		app_list: [],
		total: 0,
		page_index: 1,
		page_size: constant.page_size,
		list: [],
        stock_type: '公司',
        stock_action: '',
        product_name: '',
        product_list: []
	},

	reducers: {
		fetch(state, action) {
			return {...state, ...action.data};
		}
	}

};