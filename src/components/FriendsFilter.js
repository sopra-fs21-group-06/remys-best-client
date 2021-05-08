import React from 'react';
import { api } from "../helpers/api";
import { ServerError, ValidatedClearableInput} from "../helpers/formUtils"
import BoxWithUsers from "./BoxWithUsers"
import debounce from 'lodash.debounce'
import { withRouter } from 'react-router-dom';
import Box from './Box';
import avatar from '../img/avatar.png';
import Avatar from './Avatar';

class FriendsFilter extends React.Component {

    constructor() {
        super();
        this.state = {
            usernameOrEmail: "",
            serverError: null,
            isSubmitting: false,
            users: []
        };

        this.allUsers = [
            {username: "Andrina", email: "andrina@andrina.ch", category: "friends", status: "Free"},
            {username: "Peter", email: "peter@peter.ch", category: "friends", status: "Busy"},
            {username: "Edi", email: "edi@edi.ch", category: "friends", status: "Offline"},
            {username: "Pascal", email: "pascalemmenegger@hotmail.com", category: "pending"},
            {username: "Siddhant", email: "siddhant@andrina.ch", category: "pending"},
            {username: "George Clooney", email: "clooney@gmbh.ch", category: "requests"},
            {username: "David Beckham", email: "becks@david.ch", category: "requests"},
            {username: "Remy", email: "remyegloff@egloff.ch", category: "requests"}
        ]

        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleClearValue = this.handleClearValue.bind(this)
        this.onClickStatus = this.onClickStatus.bind(this)
    }

    async componentDidMount() {
        this.setState({users: this.allUsers})
        // TODO fetch user with waiting icon



        // [{senderName: "Andrina"}]
        const received = await api.get(`/friendrequests/received`);

        // [{receiverName: "Andrina"}]
        const sent = await api.get(`/friendrequests/sent`);

        // [{friends: [{username: "Andrina", status: "Free || Busy || Offline"}]]
        const friends = await api.get(`/myfriends`);
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

    onClickStatus(username) {
        console.log("clicked " + username)

        // TODO Sandro send invitation to clicked user
    }


    /**
     * Confirm link: api.get(`/friendrequests/accept`); + senderName: "Andrina" (I want to confirm Andrina's request)
     * Confirm link: api.get(`/friendrequests/decline`);
     * 
     * When in Create New GAme -> Free should be transformed to Link Invite
     * websocket send to '/app/gamesession/{gameSessionId}/invite'  + username: "Andrina"
     * 
     **/

    render() {
        let {usernameOrEmail, users, serverError, isSubmitting} = this.state

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
                <BoxWithUsers withFilter users={users} isSubmitting={isSubmitting} onClickStatus={this.onClickStatus}/>
                <div className="link-below-box"><p className="clickable">Refresh</p></div>
             </div>
        );
    }
}

export default withRouter(FriendsFilter);