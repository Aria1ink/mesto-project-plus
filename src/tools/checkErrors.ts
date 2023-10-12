export const isCastError = (err: Error) => err.message && ~err.message.indexOf('Cast to ObjectId failed');
export const isValidationError = (err: Error) => err.name === 'ValidationError';
