/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

const files = require.context('./', true, /\.vue$/i)
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key)))

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import ChatForm from './components/ChatForm'
import ChatMessages from './components/ChatMessages'

const app = new Vue({
    el: '#app',
    components: {
        ChatForm,
        ChatMessages,
    },
    data: {
        messages: [],
        users: [],
        sendNotificationToUserId: "",
        notificationText: "",
        authUserId: "",
        notificationTextDisplay: ""
    },

    created() {
        this.fetchMessages();
        axios.get('/user').then(response => {
            this.authUserId = response.data;
            Echo.private(`notification.${this.authUserId}`)
                .listen('NotificationSent', (e) => {
                    this.notificationTextDisplay = e.text;
                });
        });

        Echo.join('chat')
            .here(users => {
                this.users = users;
            })
            .joining(user => {
                this.users.push(user);
            })
            .leaving(user => {
                this.users = this.users.filter(u => u.id !== user.id);
            })
            .listenForWhisper('typing', ({
                id,
                name
            }) => {

                this.users.forEach((user, index) => {
                    if (user.id === id) {
                        user.typing = true;
                        this.$set(this.users, index, user);
                    }
                });
            })
            .listen('MessageSent', (event) => {
                this.messages.push({
                    message: event.message.message,
                    user: event.user
                });

                this.users.forEach((user, index) => {
                    if (user.id === event.user.id) {
                        user.typing = false;
                        this.$set(this.users, index, user);
                    }
                });
            });
    },

    methods: {
        sendNotification() {
            let notification = {
                sendToUserId: this.sendNotificationToUserId,
                text: this.notificationText,
            };

            axios.post('/send-notification', notification).then(response => {});

            //    Echo.join('chat')
            //         .whisper('typing', this.user);
        },

        fetchMessages() {
            axios.get('/messages').then(response => {
                this.messages = response.data;
            });
        },

        addMessage(message) {
            this.messages.push(message);

            axios.post('/messages', message).then(response => {
                console.log(response.data);
            });
        }
    }
});
