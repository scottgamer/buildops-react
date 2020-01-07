import React, { useState, useRef, useContext, useEffect } from "react";

import Modal from "../../components/Modal/Modal";
import Backdrop from "../../components/Backdrop/Backdrop";
import EmployeeList from "../../components/Employees/EmployeeList/EmployeeList";
import Spinner from "../../components/Spinner/Spinner";
import AuthContext from "../../context/auth-context";

import CONSTANTS from "../../config/CONSTANTS";

import axios from "axios";

import "../Events.css";

const Employees = () => {
  const [employees, setEmployees] = useState({
    employees: [],
    selectedEmployee: null
  });

  const [isActive, setActive] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [isUpdating, setUpdating] = useState(false);

  const contextType = useContext(AuthContext);

  // References to html form elements
  const firstnameElRef = useRef(null);
  const lastnameElRef = useRef(null);
  const line1ElRef = useRef(null);
  const line2ElRef = useRef(null);
  const cityElRef = useRef(null);
  const stateElRef = useRef(null);
  const zipcodeElRef = useRef(null);
  const skillElRef = useRef(null);

  useEffect(() => {
    fetchEmployees();
    setActive(false);
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const requestBody = {
        query: `
          query {
            employees {
              _id
              firstname
              lastname 
              addresses {
                _id
                line1
                line2
                city
                state
                zipcode
              }
              skills {
                _id
                name
              }
            }
          }
        `
      };

      const response = await axios.post(
        `${CONSTANTS.API_URL}/graphql`,
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }

      const employeesRes = response.data.data.employees;

      if (isActive) {
        setEmployees({ ...employees, employees: employeesRes });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (isActive) {
        setLoading(false);
      }
    }
  };

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalDeleteEmployeeHandler = employeeId => {
    const selectedEmployee = employees.employees.find(
      e => e._id === employeeId
    );

    setEmployees({ ...employees, selectedEmployee });
    setDeleting(true);
  };

  const modalUpdateEmployeeHandler = employeeId => {
    const selectedEmployee = employees.employees.find(
      e => e._id === employeeId
    );

    setEmployees({ ...employees, selectedEmployee });
    setUpdating(true);
  };

  const modalConfirmHandler = async () => {
    try {
      const formValues = getValuesFromForm();

      if (!validateForm(formValues)) {
        return;
      }

      setCreating(false);
      setLoading(true);

      const requestBody = {
        query: `
          mutation {
            createEmployee(employeeInput: {firstname: "${formValues.firstname}", lastname: "${formValues.lastname}", addresses: [{
              line1: "${formValues.line1}",
              line2: "${formValues.line2}",
              city: "${formValues.city}",
              state: "${formValues.state}",
              zipcode: "${formValues.zipCode}"
            }], skills: [{
              name: "${formValues.skill}"
            }]}) {
              _id
              firstname
              lastname
              addresses{
                _id
                line1
                line2
                city
                state
                zipcode
              }
              skills{
                _id
                name
              }
            }
          }
        `
      };

      // const token = contextType.token;

      const response = await axios.post(
        `${CONSTANTS.API_URL}/graphql`,
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json"
            // Authorization: "Bearer " + token
          }
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }

      const updatedEmployees = [...employees.employees];
      updatedEmployees.push(response.data.data.createEmployee);

      setLoading(false);
      setEmployees({
        ...employees,
        employees: updatedEmployees,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const modalCancelHandler = () => {
    setEmployees({
      ...employees,
      selectedEmployee: null
    });
    setCreating(false);
    setDeleting(false);
    setUpdating(false);
  };

  const showDetailHandler = employeeId => {
    const selectedEmployee = employees.employees.find(
      e => e._id === employeeId
    );

    // TODO use setEmployee and set selectedEmployee
    return { selectedEmployee: selectedEmployee };
  };

  const getValuesFromForm = () => {
    const form = {};

    form.firstname = firstnameElRef.current.value;
    form.lastname = lastnameElRef.current.value;
    form.line1 = line1ElRef.current.value;
    form.line2 = line2ElRef.current.value;
    form.city = cityElRef.current.value;
    form.state = stateElRef.current.value;
    form.zipCode = zipcodeElRef.current.value;
    form.skill = skillElRef.current.value;

    return form;
  };

  const updateEmployeeHandler = async employeeId => {
    try {
      const formValues = getValuesFromForm();

      if (!validateForm(formValues)) {
        return;
      }

      setUpdating(false);
      setLoading(true);

      const addressId = employees.selectedEmployee.addresses[0]._id;
      const skillId = employees.selectedEmployee.skills[0]._id;

      const requestBody = {
        query: `
      mutation {
        updateEmployee(updateEmployeeInput: {
          _id:"${employeeId}", 
          firstname: "${formValues.firstname}"
          lastname: "${formValues.lastname}"
          addresses: [{
            _id:"${addressId}", 
            line1: "${formValues.line1}",
            line2: "${formValues.line2}",
            city: "${formValues.city}",
            state: "${formValues.state}",
            zipcode:"${formValues.zipCode}"
          }]
          skills: [
            {
              _id: "${skillId}"
              name: "${formValues.skill}"
            }
          ]
        }) {
          _id
          firstname
          lastname
        }
      }
      `
      };

      // TODO fix auth token
      // const token = contextType.token;

      const response = await axios.post(
        `${CONSTANTS.API_URL}/graphql`,
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json"
            // Authorization: "Bearer " + token
          }
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }

      const currentEmployees = employees.employees;
      const toUpdateEmployeeIndex = currentEmployees.findIndex(
        employee => employee._id === employeeId
      );

      currentEmployees[toUpdateEmployeeIndex] = {
        _id: employeeId,
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        addresses: [
          {
            _id: addressId,
            line1: formValues.line1,
            line2: formValues.line2,
            city: formValues.city,
            state: formValues.state,
            zipcode: formValues.zipCode
          }
        ],
        skills: [
          {
            _id: skillId,
            name: formValues.skill
          }
        ]
      };

      setLoading(false);
      setEmployees({
        ...employees,
        employees: currentEmployees,
        selectedEmployee: null
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEmployeeHandler = async employeeId => {
    try {
      setDeleting(false);
      setLoading(true);

      const requestBody = {
        query: `
          mutation {
            deleteEmployee(employeeId: "${employeeId}") {
              _id
              firstname
              lastname 
            }
          }
        `
      };

      const response = await axios.post(
        `${CONSTANTS.API_URL}/graphql`,
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }

      const deletedEmployeeId = response.data.data.deleteEmployee._id;
      const currentEmployees = employees.employees;

      const updatedEmployees = currentEmployees.filter(e => {
        return e._id !== deletedEmployeeId;
      });

      setEmployees({ ...employees, employees: updatedEmployees });
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (isActive) {
        setLoading(false);
      }
    }
  };

  const validateForm = formValues => {
    const formErrors = {};

    if (!formValues.firstname || formValues.firstname.trim().length === 0) {
      formErrors.firstname = "Required";
    }

    if (!formValues.lastname || formValues.lastname.trim().length === 0) {
      formErrors.lastname = "Required";
    }

    if (!formValues.line1 || formValues.line1.trim().length === 0) {
      formErrors.line1 = "Required";
    }

    if (!formValues.line2 || formValues.line2.trim().length === 0) {
      formErrors.line2 = "Required";
    }

    if (!formValues.city || formValues.city.trim().length === 0) {
      formErrors.city = "Required";
    }

    if (!formValues.state || formValues.state.trim().length === 0) {
      formErrors.state = "Required";
    }

    if (!formValues.zipCode || formValues.zipCode.trim().length === 0) {
      formErrors.zipcode = "Required";
    }

    if (!formValues.skill || formValues.skill.trim().length === 0) {
      formErrors.skill = "Required";
    }

    if (Object.entries(formErrors).length > 0) {
      let out = "Some required fields are still empty: \n\n";
      for (let error in formErrors) {
        out += error + " is " + formErrors[error] + "\n";
      }
      alert(out);
      return false;
    } else {
      return true;
    }
  };

  return (
    <React.Fragment>
      {(isCreating || isUpdating || isDeleting) && (
        <Backdrop clicked={modalCancelHandler} />
      )}

      {isCreating && (
        <Modal
          title="Add Employee"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={async () => {
            await modalConfirmHandler();
          }}
          confirmText="Create"
        >
          <form>
            <div className="form-control">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                ref={firstnameElRef}
                placeholder="First Name"
              />
            </div>
            <div className="form-control">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                ref={lastnameElRef}
                placeholder="Last Name"
              />
            </div>
            <div className="form-control">
              <label htmlFor="line1">Line 1</label>
              <input
                type="text"
                id="line1"
                ref={line1ElRef}
                placeholder="Line 1"
              />
            </div>
            <div className="form-control">
              <label htmlFor="line2">Line 2</label>
              <input
                type="text"
                id="line2"
                ref={line2ElRef}
                placeholder="Line 2"
              />
            </div>
            <div className="form-control">
              <label htmlFor="city">City</label>
              <input type="text" id="city" ref={cityElRef} placeholder="City" />
            </div>
            <div className="form-control">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                ref={stateElRef}
                placeholder="State"
              />
            </div>
            <div className="form-control">
              <label htmlFor="zipcode">Zip Code</label>
              <input
                type="text"
                id="zipcode"
                ref={zipcodeElRef}
                placeholder="Zip Code"
              />
            </div>
            <div className="form-control">
              <label htmlFor="skill">Skill</label>
              <input
                type="text"
                id="skill"
                ref={skillElRef}
                placeholder="Skill"
              />
            </div>
          </form>
        </Modal>
      )}

      {isUpdating && employees.selectedEmployee && (
        <Modal
          title={`Update Employee ${employees.selectedEmployee.firstname} ${employees.selectedEmployee.lastname}`}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={async () => {
            await updateEmployeeHandler(employees.selectedEmployee._id);
          }}
          confirmText="Update"
        >
          <form>
            <div className="form-control">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                ref={firstnameElRef}
                defaultValue={employees.selectedEmployee.firstname}
              />
            </div>
            <div className="form-control">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                ref={lastnameElRef}
                defaultValue={employees.selectedEmployee.lastname}
              />
            </div>
            <div className="form-control">
              <label htmlFor="line1">Line 1</label>
              <input
                type="text"
                id="line1"
                ref={line1ElRef}
                defaultValue={employees.selectedEmployee.addresses[0].line1}
              />
            </div>
            <div className="form-control">
              <label htmlFor="line2">Line 2</label>
              <input
                type="text"
                id="line2"
                ref={line2ElRef}
                defaultValue={employees.selectedEmployee.addresses[0].line2}
              />
            </div>
            <div className="form-control">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                ref={cityElRef}
                defaultValue={employees.selectedEmployee.addresses[0].city}
              />
            </div>
            <div className="form-control">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                ref={stateElRef}
                defaultValue={employees.selectedEmployee.addresses[0].state}
              />
            </div>
            <div className="form-control">
              <label htmlFor="zipcode">Zip Code</label>
              <input
                type="text"
                id="zipcode"
                ref={zipcodeElRef}
                defaultValue={employees.selectedEmployee.addresses[0].zipcode}
              />
            </div>
            <div className="form-control">
              <label htmlFor="skill">Skill</label>
              <input
                type="text"
                id="skill"
                ref={skillElRef}
                defaultValue={employees.selectedEmployee.skills[0].name}
              />
            </div>
          </form>
        </Modal>
      )}

      {isDeleting && employees.selectedEmployee && (
        <Modal
          title="Delete Employee"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={() =>
            deleteEmployeeHandler(employees.selectedEmployee._id)
          }
          confirmText={`Delete`}
        >
          <p>
            Are you sure you want to delete employee:{" "}
            {employees.selectedEmployee.firstname}{" "}
            {employees.selectedEmployee.lastname}
            {"?"}
          </p>
        </Modal>
      )}

      {/* {this.context.token && ( */}
      <div className="events-control">
        <h1>List of Employees</h1>
        <button className="btn" onClick={startCreateEventHandler}>
          Add an Employee
        </button>
      </div>
      {/* )} */}

      {isLoading ? (
        <Spinner />
      ) : (
        <EmployeeList
          employees={employees.employees}
          authUserId={contextType.userId}
          onDelete={modalDeleteEmployeeHandler}
          onUpdate={modalUpdateEmployeeHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Employees;
