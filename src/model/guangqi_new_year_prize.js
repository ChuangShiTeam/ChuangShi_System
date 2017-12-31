import constant from '../util/constant';

export default {

    namespace: 'guangqi_new_year_prize',

    state: {
        app_id: '',
        app_list: [],
        new_year_prize_name: '',
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