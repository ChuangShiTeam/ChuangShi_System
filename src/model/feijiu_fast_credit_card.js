import constant from '../util/constant';

export default {

    namespace: 'feijiu_fast_credit_card',

    state: {
        app_id: '',
        app_list: [],
        credit_card_name: '',
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