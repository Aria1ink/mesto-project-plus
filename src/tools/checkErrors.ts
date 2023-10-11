export const isCastError = (err: Error) => err.message && ~err.message.indexOf('Cast to ObjectId failed');
