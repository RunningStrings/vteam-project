/**
 * Helper function to create user to use in 'updateCompleteUserById'.
 * @param {object} body The response body. 
 * @returns The updated user.
 */
function updateUser(body) {
    const user = {
        firstname: body.firstname || null,
        lastname: body.lastname || null,
        email: body.email,
        role: body.role,
        balance: body.balance || null,
        monthly_paid: body.monthly_paid || false
    };
    return user;
}

export { updateUser };
