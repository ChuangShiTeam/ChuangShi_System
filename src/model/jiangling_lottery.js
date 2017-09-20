import constant from '../util/constant';

export default {

    namespace: 'jiangling_lottery',

    state: {
        app_id: '',
        app_list: [],
        lottery_number: '',
        lottery_user_mobile: '',
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