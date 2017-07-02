export default {

    namespace: 'menu',

    state: {
        app_id: '',
        app_list: [],
        menu_name: '',
        list: [],
        expandedRowKeys: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};