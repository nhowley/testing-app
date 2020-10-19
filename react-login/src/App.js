import React, { Component } from "react";
import axios from "axios"


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            test: ''
        }
    }

    componentDidMount = () => {
        console.log("app loaded")
    }

    onChange = (e) => {
        this.setState({
            userType: e.target.value
        })
    }

    render(){
        let userType = this.state.userType
        let url = `/login/${userType}`
        return(
            <div id="logreg-forms">
            <form className="form-signin" action={url} method="POST">
            <h1 className="h3 mb-3 font-weight-normal text-center">Login</h1>
             {/* <div className="social-login">
                <button className="btn facebook-btn social-btn" type="button"><span><i className="fab fa-facebook-f"></i> Sign in with Facebook</span> </button>
                <button className="btn google-btn social-btn" type="button"><span><i className="fab fa-google-plus-g"></i> Sign in with Google+</span> </button>
            </div> */}
            <div className="d-flex justify-content-center align-items-center" onChange={(e) => this.onChange(e)}>
                <input type="radio" id="client" name="userType" value="client"/>
                <label htmlFor="client" className="ml-1">Client</label>
                <input type="radio" id="coach" name="userType" value="coach" className="ml-3"/>
                <label htmlFor="coach" className="ml-1">Coach</label>
            </div>
            <input type="email" id="inputEmail" className="form-control mt-4" placeholder="Email address" required="" autoFocus="" name="email" />
            <input type="password" id="inputPassword" className="form-control mt-2" placeholder="Password" required="" name="password" />
            
            <button className="btn btn-success btn-block" type="submit"><i className="fas fa-sign-in-alt"></i> Login</button>
            <a href="#" id="forgot_pswd">Forgot password?</a>
            <hr/>
            {/* <p>Don't have an account!</p> */}
            <button className="btn btn-primary btn-block" type="button" id="btn-signup"><i className="fas fa-user-plus mr-2"></i>Register as a coach</button>
            </form>

            <form action="/reset/password/" className="form-reset">
                <input type="email" id="resetEmail" className="form-control" placeholder="Email address" required="" autoFocus="" />
                <button className="btn btn-primary btn-block" type="submit">Reset Password</button>
                <a href="#" id="cancel_reset"><i className="fas fa-angle-left"></i> Back</a>
            </form>
            
            <form action="/signup/" className="form-signup">
                <div className="social-login">
                    <button className="btn facebook-btn social-btn" type="button"><span><i className="fab fa-facebook-f"></i> Sign up with Facebook</span> </button>
                </div>
                <div className="social-login">
                    <button className="btn google-btn social-btn" type="button"><span><i className="fab fa-google-plus-g"></i> Sign up with Google+</span> </button>
                </div>
                
                <p className="text-center">OR</p>

                <input type="text" id="user-name" className="form-control" placeholder="Full name" required="" autoFocus="" />
                <input type="email" id="user-email" className="form-control" placeholder="Email address" required autoFocus="" />
                <input type="password" id="user-pass" className="form-control" placeholder="Password" required autoFocus="" />
                <input type="password" id="user-repeatpass" className="form-control" placeholder="Repeat Password" required autoFocus="" />

                <button className="btn btn-primary btn-block" type="submit"><i className="fas fa-user-plus"></i> Sign Up</button>
                <a href="#" id="cancel_signup"><i className="fas fa-angle-left"></i> Back</a>
            </form>
            <br/>    
    </div>
        );
    }
}


export default App