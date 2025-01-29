import uuid from 'react-native-uuid';

function UserPayload() {
    const user_payload = {
        id: uuid.v4(),
        firstName: "",
        lastName: "",
        dob: "",
        knownAs: "",
        isPrivate: true,
        profileUrl: "",
        isPrimary: false,
        addresses: {
            country: "",
            city: "",
            postalCode: "",
            streetAddress1: "",
            streetAddress2: "",
            state: "",
            isPrimary: false,
            isPreferred: true,
            isBillingAddress: false
        },
        emailAddress: [
            {
                email: "",
                type: "HOME"
            }
        ],
        role: {
            roleName: ""
        },
        phoneNumber: [
            {
                phoneNumber: "",
                type: "PRIMARY"
            }
        ]
        
    }
    return user_payload
}
export { UserPayload }