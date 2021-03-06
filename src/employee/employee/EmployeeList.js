import React, { Component } from "react";
import APIManager from "../../api/APIManager";
import EmployeeCard from "./EmployeeCard";
import EmployeeAdd from "./EmployeeAdd";
import { withRouter } from "react-router-dom";
import EmployeeDetails from "./EmployeeDetails";
import { Sidebar, Grid, Header, Container } from "semantic-ui-react";
import { notify } from "react-notify-toast";

class EmployeeList extends Component {
  state = {
    employees: [],
    storedEmployee: "",
    departments: [],
    selectedEmployee: null
  };

  selectEmployee = id => {
    const { selectedEmployee } = this.state;
    if (selectedEmployee && selectedEmployee.id === id) {
      this.setState({ selectedEmployee: null });
      return;
    }
    APIManager.getById("employees", id)
      .then(employee => {
        this.setState({
          selectedEmployee: employee
        });
      })
      .catch(err => {
        notify.show("There was an error getting employee data", "error");
      });
  };

  searchEmployees = () => {
    if (this.props.searchValue === undefined) {
    } else
      APIManager.searchForEmployeeByName(
        this.props.searchValue[0],
        this.props.searchValue[1]
      )
        .then(response => {
          const employees = response.map(e => {
            e.department = this.state.departments.find(
              d => d.id === e.departmentId
            );
            return e;
          });
          this.setState({ employees, selectedEmployee: null });
        })
        .catch(err => {
          notify.show("There was an error getting employee data", "error");
        });
  };

  componentDidMount() {
    APIManager.getAll("departments")
      .then(departments => {
        return this.setState({ departments });
      })
      .then(() => this.searchEmployees());
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchValue !== this.props.searchValue) {
      this.searchEmployees();
    }
  }
  render() {
    const newActive = this.props.sidebarState;
    return (
      <>
        {this.props.searchValue === undefined ? (
          <>
            <Container textAlign="center">
              <img
                src={require("../../images/Empty-State-Charts.png")}
                className="employeeSearchImg"
                alt="magnifying glass"
              />
              <Header color="grey" as="h2">
                Search Employees
              </Header>
            </Container>
          </>
        ) : (
          <Grid>
            <Grid.Row columns="equal">
              <Grid.Column width={8}>
                {this.state.employees.map(employee => (
                  <EmployeeCard
                    key={employee.id}
                    selectEmployee={this.selectEmployee}
                    employee={employee}
                    sidebarState={this.props.sidebarState}
                    closeSidebar={this.props.closeSidebar}
                  />
                ))}
              </Grid.Column>
              <Grid.Column>
                {this.state.selectedEmployee ? (
                  <EmployeeDetails
                    onEmployeeUpdate={this.searchEmployees}
                    toggle={this.props.toggle}
                    employee={this.state.selectedEmployee}
                    id={this.state.selectedEmployee.id}
                  />
                ) : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
        <Sidebar
          animation="push"
          icon="labeled"
          inverted="false"
          onHide={null}
          vertical="false"
          visible={newActive}
          width="wide"
          direction="right"
        >
          <EmployeeAdd
            closeSidebar={this.props.closeSidebar}
            refresh={this.refresh}
          />
        </Sidebar>
      </>
    );
  }
}

export default withRouter(EmployeeList);
