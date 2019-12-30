/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEmployee = `subscription OnCreateEmployee {
  onCreateEmployee {
    id
    firstname
    lastname
    addresses {
      items {
        id
        employeeId
        line1
        line2
        city
        state
        zipcode
      }
      nextToken
    }
    skills {
      items {
        id
        employeeId
        name
      }
      nextToken
    }
  }
}
`;
export const onUpdateEmployee = `subscription OnUpdateEmployee {
  onUpdateEmployee {
    id
    firstname
    lastname
    addresses {
      items {
        id
        employeeId
        line1
        line2
        city
        state
        zipcode
      }
      nextToken
    }
    skills {
      items {
        id
        employeeId
        name
      }
      nextToken
    }
  }
}
`;
export const onDeleteEmployee = `subscription OnDeleteEmployee {
  onDeleteEmployee {
    id
    firstname
    lastname
    addresses {
      items {
        id
        employeeId
        line1
        line2
        city
        state
        zipcode
      }
      nextToken
    }
    skills {
      items {
        id
        employeeId
        name
      }
      nextToken
    }
  }
}
`;
export const onCreateAddress = `subscription OnCreateAddress {
  onCreateAddress {
    id
    employeeId
    line1
    line2
    city
    state
    zipcode
  }
}
`;
export const onUpdateAddress = `subscription OnUpdateAddress {
  onUpdateAddress {
    id
    employeeId
    line1
    line2
    city
    state
    zipcode
  }
}
`;
export const onDeleteAddress = `subscription OnDeleteAddress {
  onDeleteAddress {
    id
    employeeId
    line1
    line2
    city
    state
    zipcode
  }
}
`;
export const onCreateSkill = `subscription OnCreateSkill {
  onCreateSkill {
    id
    employeeId
    name
  }
}
`;
export const onUpdateSkill = `subscription OnUpdateSkill {
  onUpdateSkill {
    id
    employeeId
    name
  }
}
`;
export const onDeleteSkill = `subscription OnDeleteSkill {
  onDeleteSkill {
    id
    employeeId
    name
  }
}
`;
