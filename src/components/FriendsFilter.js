import React from 'react';
import { api, handleError } from "../helpers/api";
import { ServerError, ValidatedClearableInput} from "../helpers/formUtils"
import BoxWithUsers from "./BoxWithUsers"
import debounce from 'lodash.debounce'
import { createUser } from "../helpers/modelUtils";
import { userCategories, userStatus } from "../helpers/constants";

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

        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleClearValue = this.handleClearValue.bind(this)
        this.refreshUsers = this.refreshUsers.bind(this)
    }

    async componentDidMount() {
        this.setState({isSubmitting: true})
        let users = await this.loadUsers()
        this.updateFilteredUsers(users)
        this.setState({isSubmitting: false})
    }

    async loadUsers() {
        let [friendUsers, sentUsers, receivedUsers] = await Promise.all([
            this.fetchAndTransformFriends(), 
            this.fetchAndTransformSent(), 
            this.fetchAndTransformReceived()
        ]);

        let allUsers = friendUsers.concat(sentUsers).concat(receivedUsers)
        this.allUsers = allUsers
        return allUsers
    }

    updateFilteredUsers(filteredUsers) {
        this.setState({filteredUsers: filteredUsers})
    }

    async refreshUsers() {
        this.handleClearValue();
        this.setState({isSubmitting: true})

        // wait min 300ms to show user it has worked
        let [users] = await Promise.all([
            this.loadUsers(),
            new Promise(r => setTimeout(r, 300))
        ]);

        this.updateFilteredUsers(users)
        this.setState({isSubmitting: false})
    }

    async fetchAndTransformFriends() {
        try {
            const response = await api.get(`/myfriends`);
            this.setState({ serverError: null })
            return response.data.friends.map(friend => {
                console.log("friend: " + friend.username)
                return createUser(friend.username, "friend@friend.ch", friend.status, userCategories.FRIENDS)
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
                console.log("sent: " + sent.receiverName)
                return createUser(sent.receiverName, "sent@sent.ch", null, userCategories.SENT)
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
                console.log("received: " + received.senderName)
                return createUser(received.senderName, "received@received.ch", null, userCategories.RECEIVED)
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
            this.updateFilteredUsers(this.allUsers)
            return
        }

        let filteredUsers = this.allUsers.filter(user => {
            return user.getUsername().toLowerCase().includes(searchTerm.toLowerCase())
        })

        this.updateFilteredUsers(filteredUsers)
    }

    render() {
        let {usernameOrEmail, filteredUsers, serverError, isSubmitting} = this.state
        let {withInvitation} = this.props

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
                    refreshUsers={this.refreshUsers}
                    withInvitation={withInvitation}
                />
                <div className="link-below-box"><p onClick={() => this.refreshUsers()}className="clickable">Refresh</p></div>
             </div>
        );
    }
}

export default FriendsFilter;