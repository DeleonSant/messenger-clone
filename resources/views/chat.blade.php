@extends('layouts.app')

@section('content')

<div class="container chats">
    <div class="alert alert-danger ">
        @{{ notificationTextDisplay  }}
    </div>
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="card card-default">
                <div class="card-header">Chats</div>

                <div class="card-body">
                    <chat-messages :messages="messages"></chat-messages>
                </div>
                <div class="card-footer">
                    <chat-form @messagesent="addMessage" :user="{{ auth()->user() }}"></chat-form>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <ul class="list-group">
                <li class="list-group-item" v-for="user in users">
                    @{{ user.name }} <span v-if="user.typing" class="badge badge-primary">typing...</span>
                </li>
            </ul>
            <div class="form-group row mt-2">
                <label for="staticEmail" class="col-sm-4 col-form-label">User Id </label>
                <div class="col-sm-8">
                    <input v-model="sendNotificationToUserId" type="text" class="form-control" id="staticEmail">
                </div>
            </div>
            <div class="form-group row mt-2">
                <label for="staticEmail" class="col-sm-4 col-form-label">Text </label>
                <div class="col-sm-8">
                    <input v-model="notificationText" type="text" class="form-control" id="staticEmail">
                </div>
            </div>

            <button type="button" @click="sendNotification" class="btn btn-sm btn-success mt-2">Send
                Notification</button>
        </div>
    </div>

</div>
@endsection
