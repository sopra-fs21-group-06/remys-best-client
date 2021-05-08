import React from 'react';
import { api, handleError } from "../helpers/api";
import { ServerError, ValidatedClearableInput} from "../helpers/formUtils"
import BoxWithUsers from "./BoxWithUsers"
import debounce from 'lodash.debounce'
import { withRouter } from 'react-router-dom';
import { withWebsocketContext } from './context/WebsocketProvider';
import sessionManager from "../helpers/sessionManager";
import { createUser } from "../helpers/modelUtils";

class FriendsFilter extends React.Component {

    constructor() {
        super();
        this.state = {
            usernameOrEmail: "",
            serverError: null,
            isSubmitting: false,
            filteredUsers: []
        };

        this.allUsers = []

        /*
        this.allUsers = [
            {username: "Andrina", email: "andrina@andrina.ch", category: "friends", status: "Free"},
            {username: "Peter", email: "peter@peter.ch", category: "friends", status: "Busy"},
            {username: "Edi", email: "edi@edi.ch", category: "friends", status: "Offline"},
            {username: "Pascal", email: "pascalemmenegger@hotmail.com", category: "pending"},
            {username: "Siddhant", email: "siddhant@andrina.ch", category: "pending"},
            {username: "George Clooney", email: "clooney@gmbh.ch", category: "requests"},
            {username: "David Beckham", email: "becks@david.ch", category: "requests"},
            {username: "Remy", email: "remyegloff@egloff.ch", category: "requests"}
        ]*/

        this.gameSessionId = sessionManager.getGameSessionId();
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleClearValue = this.handleClearValue.bind(this)
        this.invite = this.invite.bind(this)
    }

    componentDidMount() {
        this.refreshUsers()
    }

    async refreshUsers() {
        let [friendUsers, sentUsers, receivedUsers] = await Promise.all([
            this.fetchAndTransformFriends(), 
            this.fetchAndTransformSent(), 
            this.fetchAndTransformReceived()
        ]);

        let users = friendUsers.concat(sentUsers).concat(receivedUsers)
        this.setState({filteredUsers: users})
        this.allUsers = users
    }

    async fetchAndTransformFriends() {
        try {
            const response = await api.get(`/myfriends`);
            this.setState({ serverError: null })
            return response.data.friends.map(friend => {
                return createUser(friend.username, "friend@friend.ch", friend.status, "friend")
            })
        } catch (error) {
            this.setState({ serverError: handleError(error) })
        }
    }

    async fetchAndTransformSent() {
        try {
            const response = await api.get(`/friendrequests/sent`);
            this.setState({ serverError: null })
            return response.data.map(sent => {
                return createUser(sent.receiverName, "sent@sent.ch", "Sent", "sent")
            })
        } catch (error) {
            this.setState({ serverError: handleError(error) })
        }
    }

    async fetchAndTransformReceived() {
        try {
            const response = await api.get(`/friendrequests/received`);
            this.setState({ serverError: null })
            return response.data.map(received => {
                return createUser(received.senderName, "received@received.ch", "Received", "received")
            })
        } catch (error) {
            this.setState({ serverError: handleError(error) })
        }
    }

    handleClearValue() {
        let newUsernameOrEmail = ""
        this.setState({usernameOrEmail: newUsernameOrEmail})
        this.searchAndFilter(newUsernameOrEmail)
    }

    handleOnChange(event) {
        let newUsernameOrEmail = event.target.value
        this.setState({usernameOrEmail: newUsernameOrEmail})
        this.searchAndFilterWithDelay(newUsernameOrEmail)
    }

    // search only if value hasn't changed within 300ms
    searchAndFilterWithDelay = debounce((newUsernameOrEmail) => {
        this.searchAndFilter(newUsernameOrEmail)
    }, 300);

    searchAndFilter(searchTerm) {
        if(searchTerm == "") {
            this.setState({users: this.allUsers})
            return
        }

        let filteredUsers = this.allUsers.filter(user => {
            return user.username.toLowerCase().includes(searchTerm.toLowerCase())
        })
        this.setState({users: filteredUsers})
    }

    invite(username) {
        this.props.websocketContext.sockClient.send(`/app/gamesession/${this.gameSessionId}/invite`, {username: username});
    }

    render() {
        let {usernameOrEmail, filteredUsers, serverError, isSubmitting, withInvitation} = this.state

        if(this.props.withInvitation) {
            filteredUsers = filteredUsers.map(user => {
                if(user.status === "Free") {
                    user.status = "Invite"
                    user.invite = () => this.invite(user.username)
                }
                return user
            })
        }

        return (
            <div>
                <ServerError serverError={serverError}/>
                <ValidatedClearableInput 
                    type="text"
                    placeholder="Search for username"
                    value={usernameOrEmail}
                    name="usernameOrEmail"
                    onChange={this.handleOnChange}
                    onClearValue={this.handleClearValue}
                />
                <BoxWithUsers 
                    withFilter 
                    users={filteredUsers} 
                    isSubmitting={isSubmitting} 
                    withInvitation={withInvitation}
                    refreshUsers={this.refreshUsers}
                />
                <div className="link-below-box"><p className="clickable">Refresh</p></div>
             </div>
        );
    }
}

export default withRouter(withWebsocketContext(FriendsFilter));