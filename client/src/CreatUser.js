import React, {Component} from 'react';

export default class CreatUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            admin: false
        };
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(event) {
        event.preventDefault();
        this.props.creatUser(this.state.username, this.state.password, this.state.admin);
    }

    onChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <form>

                <div className="field" >
                    <label className="label" >Your username</label>
                    <input onChange={event => this.onChange(event)} name="username"/>
                    <label className="label" >Your username</label>
                    <input onChange={event => this.onChange(event)} name="password"/>
                    <label className="label" >Admin</label>
                    <input type="checkbox" onChange={event => this.onChange(event)} name="admin"/>
                </div>
                <div className="field">
                    <button className="button is-primary" onClick={this.handleInput} type="submit"
                            id="CreatUserButton">Create user
                    </button>
                </div>
            </form>
        )
    };
}