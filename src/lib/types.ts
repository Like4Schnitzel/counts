export type LogInBody = {
    username: string,
    password: string
}

export type UserRow = {
    name: string,
    password: string
}

export type Session = {
    id: string,
    user: string,
    expiresBy: Date
}
