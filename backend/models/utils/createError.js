/**
 * Helper function to create errors with error status codes.
 * @param {string} message The error message. 
 * @param {number} status The error code. 
 * @returns The error with message and status.
 */
function createError(message, status) {
    const error = new Error(message);
    error.status = status;
    throw error;
}

export { createError }
