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

export type Reason = {
    id: number,
    counter: string,
    reason: string,
    weight: number,
    unit: string,
    culprit: string
}

export type Counter = {
    label: string,
    user: string,
    visibility: string,
    reasons: Reason[]
}
