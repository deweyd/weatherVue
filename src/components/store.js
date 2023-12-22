import { createStore } from 'vuex';
const store = createStore({
    state() {
        return {
            dataQuery: '',
            dataSelected: []
        };
    },
    mutations: {
        updateDataQuery(state, payload) {
            state.dataQuery = payload;
        },
        updateDataSelected(state, payload) {
            state.dataSelected.push(payload);
        }
    },
    actions: {
        setDataQuery(context, payload) {
            context.commit('updateDataQuery', payload);
        },
        setDataSelected(context, payload) {
            context.commit('updateDataSelected', payload);
        }
    },
    getters: {
        getDataQuery(state) {
            return state.dataQuery;
        },
        getDataSelected(state) {
            return state.dataSelected;
        }
    },
});

export default store;