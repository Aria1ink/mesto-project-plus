export const isCastError = (err: Error) => err.name === 'CastError';
export const isValidationError = (err: Error) => err.name === 'ValidationError';
