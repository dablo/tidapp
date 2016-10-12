let latency = 400;
let id = 0;

function getId() {
  return ++id;
}

let contacts = [
  {
    id: getId(),
    firstName: 'David',
    lastName: 'Blomberg',
    email: 'david.blomberg@aptitud.se',
    phoneNumber: '0733-099990'
  },
  {
    id: getId(),
    firstName: 'Anders',
    lastName: 'Löwenborg',
    email: 'anders.lowenborg@aptitud.se',
    phoneNumber: '0733-099990'
  },
  {
    id: getId(),
    firstName: 'Tomas',
    lastName: 'Näslund',
    email: 'tomas.naslund@aptitud.se',
    phoneNumber: '0733-099990'
  },
  {
    id: getId(),
    firstName: 'Åsa',
    lastName: 'Liljegren',
    email: 'asa.liljegren@aptitud.se',
    phoneNumber: '0733-099990'
  },
  {
    id: getId(),
    firstName: 'Håkan',
    lastName: 'Alexander',
    email: 'hakan.alexander@aptitud.se',
    phoneNumber: '867-5309'
  }
];

export class WebAPI {
  isRequesting = false;

  getContactList() {
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let results = contacts.map(x => {
          return {
            id: x.id,
            firstName: x.firstName,
            lastName: x.lastName,
            email: x.email
          }
        });
        resolve(results);
        this.isRequesting = false;
      }, latency);
    });
  }

  getContactDetails(id) {
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let found = contacts.filter(x => x.id == id)[0];
        resolve(JSON.parse(JSON.stringify(found)));
        this.isRequesting = false;
      }, latency);
    });
  }

  saveContact(contact) {
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(contact));
        let found = contacts.filter(x => x.id == contact.id)[0];

        if (found) {
          let index = contacts.indexOf(found);
          contacts[index] = instance;
        } else {
          instance.id = getId();
          contacts.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}
