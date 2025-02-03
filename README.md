# Counts
Webapp to count things.

## Security / Privacy
User passwords are hashed with SHA512 twice. Once on the client and then again on the server.
After providing correct credentials, the user is given a session ID which is stored as a cookie. The session ID expires after a day.
The counter data is encrypted and decrypted on the client using the password with the prefix "transrights<3_" put through SHA512 as a key.
The encryption key is only ever stored on the client in localstorage.
![](password_encryption.png)
