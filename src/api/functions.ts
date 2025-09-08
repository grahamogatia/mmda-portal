export function generateSessionToken(length: number = 32): string {
    // Create a Uint8Array with the desired length
    const array = new Uint8Array(length);
    // Fill the array with cryptographically secure random values
    window.crypto.getRandomValues(array);
    // Convert the byte array to a hex string
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}