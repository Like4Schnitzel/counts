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
    expires_by: Date
}

export type Reason = {
    id: number,
    counter_id: number,
    added_at: Date,
    reason: string,
    weight: number,
    unit: string,
    culprit: string
}

export type Counter = {
    id: number,
    label: string,
    user: string,
    visibility: "PRIVATE" | "PROTECTED" | "PUBLIC",
    reasons: Reason[]
}
