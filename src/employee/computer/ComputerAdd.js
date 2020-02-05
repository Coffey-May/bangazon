import React, { Component } from 'react';
import APIManager from '../../api/APIManager'
import { Button, Form, Header, Dropdown } from 'semantic-ui-react'
import '../../App.css'


export default class ComputerAdd extends Component {

    state = {
        id: '',
        purchaseDate: '',
        decomissionDate: null,
        make: '',
        model: ''
    }

    handleFieldChange = (evt) => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);
    }

    handleDeptDropdownChange = (e, { value }) => this.setState({ departmentId: value })

    handleSupervisorDropdownChange = (e, { value }) => this.setState({ isSupervisor: value })

    addComputer = evt => {
        evt.preventDefault();
        const newComputer = {
            id: this.state.id,
            purchaseDate: this.state.purchaseDate,
            decomissionDate: null,
            make: this.state.make,
            model: this.state.model
        }
        APIManager.addData("computers", newComputer)
            .then(() => this.props.closeSidebar())

    };

    render() {
        const supervisorOptions = [
            { key: 1, text: 'Yes', value: true },
            { key: 2, text: 'No', value: false }
        ]

        const deptOptions = [
            { key: 1575559403192, text: 'Marketing', value: 1575559403192 },
            { key: 1575559403193, text: 'Engineering', value: 1575559403193 },
            { key: 1575559403194, text: 'Accounting', value: 1575559403194 },
            { key: 1575559403195, text: 'Legal', value: 1575559403195 }
        ]

        const { dropdownValue } = this.state;

        return (

            <>
                <Form>
                    <br></br>
                    <Header as='h1' color='grey'>Add New Computer</Header>
                    <div><img src={require('../../images/API.png')} alt="Computer" className="computerImage" /></div>
                    <div className='fifteen wide field'>
                        <label>Employee First Name</label>
                        <input
                            onChange={this.handleFieldChange}
                            placeholder='Enter First Name'
                            id='firstName'
                        />
                    </div>
                    <div className='fifteen wide field'>
                        <label>Employee Last Name</label>
                        <input
                            onChange={this.handleFieldChange}
                            placeholder='Enter Last Name'
                            id='lastName'
                        />
                    </div>
                    <div className='fifteen wide field'>
                        <label>Choose Department</label>
                        <Dropdown
                            selection
                            placeholder='Department Name'
                            options={deptOptions}
                            value={dropdownValue}
                            onChange={this.handleDeptDropdownChange}
                            id='departmentId'
                        />
                    </div>
                    <div className='fifteen wide field'>
                        <label>Grant Supervisor Privileges?</label>
                        <Dropdown
                            selection
                            placeholder='Supervisor Privileges?'
                            options={supervisorOptions}
                            value={dropdownValue}
                            onChange={this.handleSupervisorDropdownChange}
                            id='isSupervisor'
                        />
                    </div>
                    <div className='fifteen wide field'>
                        <label>Employee ID</label>
                        <input
                            onChange={this.handleFieldChange}
                            placeholder='Enter Employee ID'
                            id='employeeId'
                        />
                    </div>
                    <div className='fifteen wide field'>
                        <label>Computer ID</label>
                        <input
                            onChange={this.handleFieldChange}
                            placeholder='Enter Computer ID'
                            id='computerId'
                        />
                    </div>
                    <div className='fifteen wide field'>
                        <label>E-mail Address</label>
                        <input
                            onChange={this.handleFieldChange}
                            placeholder='Enter Email Address'
                            id='email'
                        />
                    </div>
                    <Button
                        type='submit'
                        color='orange'
                        onClick={(evt) => this.addEmployee(evt)}>
                        Create New Computer!
                        </Button>
                    <Button
                        basic
                        color='orange'
                        content='Cancel'
                        onClick={this.props.closeSidebar} />
                </Form>

            </>
        )
    }
}