import React, {Component} from 'react';

export default class CreatUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        };
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(event) {
        event.preventDefault();
        this.props.creatUser(this.state.username, this.state.password);
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <form>

                <div className="field" >
                    <label className="label" htmlFor="QuestionInput">Your username</label>
                    <input onChange={event => this.onChange(event)} name="username"/>
                    <label className="label" htmlFor="QuestionInput">Your username</label>
                    <input onChange={event => this.onChange(event)} name="password"/>
                </div>
                <div className="field">
                    <button className="button is-primary" onClick={this.handleInput} type="submit"
                            id="QuestionButton">Create user
                    </button>
                </div>
            </form>
        )
    };
}