import Vue from 'vue';
import Vuex from 'vuex';
import {getRequest} from "@/utils/api";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {Notification} from 'element-ui';

Vue.use(Vuex);

const state = {
    user: {
        lockPassword: sessionStorage.getItem('lockPassword') || '',
        isLock: sessionStorage.getItem('isLock') || false
    }
}
const getters = {
    user: state => state.user
}
const mutations = {
    SET_LOCK: (state) => {
        state.user.isLock = true
        sessionStorage.setItem('isLock', state.user.isLock)
    },
    SET_LOCK_PASSWORD: (state, lockPassword) => {
        state.user.lockPassword = lockPassword
        sessionStorage.setItem('lockPassword', state.user.lockPassword)
    },
    CLEAR_LOCK: (state) => {
        state.user.isLock = false
        state.user.lockPassword = ''
        sessionStorage.removeItem('isLock')
        sessionStorage.removeItem('lockPassword')
    }
}
const actions = {
    setLock: ({commit}) => {
        commit('SET_LOCK')
    },
    setLockPassword: ({commit}, lockPassword) => {
        commit('SET_LOCK_PASSWORD', lockPassword)
    },
    clearLock: ({commit}) => {
        commit('CLEAR_LOCK')
    }
}

const now = new Date();

const store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {},
        admins: [],
        currentAdmin: JSON.parse(window.sessionStorage.getItem('user')),
        currentSession: null,
        filterKey:'',
        stomp: null,
        idDot: {},
        user: {
            lockPassword: JSON.parse(window.sessionStorage.getItem('lockPassword')) || '',
            isLock: JSON.parse(window.sessionStorage.getItem('isLock')) || false
        }
    },

    getters:{
        user: state => state.user
    },

    mutations: {
        SET_LOCK: (state) => {
            state.user.isLock = true
            sessionStorage.setItem('isLock', state.user.isLock)
        },
        SET_LOCK_PASSWORD: (state, lockPassword) => {
            state.user.lockPassword = lockPassword
            sessionStorage.setItem('lockPassword', state.user.lockPassword)
        },
        CLEAR_LOCK: (state) => {
            state.user.isLock = false
            state.user.lockPassword = ''
            sessionStorage.removeItem('isLock')
            sessionStorage.removeItem('lockPassword')
        },
        INIT_ADMIN(state, admin) {
            state.currentAdmin = admin;
        },
        initRoutes(state, data) {
            state.routes = data;
        },
        changeCurrentSession (state,currentSession) {
            state.currentSession = currentSession;
            Vue.set(state.idDot, state.currentAdmin.username + '#' + state.currentSession.username, false);
        },
        addMessage (state,msg) {
            let mss = state.sessions[state.currentAdmin.username+'#'+msg.to];
            if (!mss) {
                Vue.set(state.sessions, state.currentAdmin.username+'#'+msg.to, []);
            }
            state.sessions[state.currentAdmin.username+'#'+msg.to].push({
                content:msg.content,
                date: new Date(),
                self: !msg.notSelf
            })
        },
        INIT_DATA (state) {
            //浏览器本地的历史聊天记录
            let data = localStorage.getItem('vue-chat-session');
            //console.log(data)
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_ADMINS(state, data) {
            state.admins = data;
        }
    },

    actions: {
        setLock: ({commit}) => {
            commit('SET_LOCK')
        },
        setLockPassword: ({commit}, lockPassword) => {
            commit('SET_LOCK_PASSWORD', lockPassword)
        },
        clearLock: ({commit}) => {
            commit('CLEAR_LOCK')
        },
        connect(context) {
          context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
          let token = window.sessionStorage.getItem('tokenStr');
          context.state.stomp.connect({'Auth-Token':token}, success => {
              context.state.stomp.subscribe('/user/queue/chat', msg => {
                  let receiveMsg = JSON.parse(msg.body);
                  if (!context.state.currentSession || receiveMsg.from != context.state.currentSession.username){
                      Notification.info({
                          title: '【' + receiveMsg.formNickName + '】发来一条消息',
                          message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content,
                          position: 'bottom-right'
                      });
                      Vue.set(context.state.idDot, context.state.currentAdmin.username + '#' + receiveMsg.from, true);
                      console.log(context.state.idDot)
                  }
                  receiveMsg.notSelf = true;
                  receiveMsg.to = receiveMsg.from;
                  context.commit('addMessage', receiveMsg);
              })
          }, error => {

          })
        },
        initData (context) {
            context.commit('INIT_DATA');
            getRequest('/chat/admin').then(resp => {
                if (resp) {
                    context.commit('INIT_ADMINS', resp)
                }
            })
        }
    }
})

store.watch(function (state) {
    return state.sessions
},function (val) {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
    deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store;