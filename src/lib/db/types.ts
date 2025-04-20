export type TaskStatus="To-Do" | "In Progress" | "Done"

export interface Task{
    id:string
    title:string
    description?:string
    status:TaskStatus
    priority:string
    // assignee_id?:string
    due_date:string
    created_by:string
    assigned_to:string
    team_id:Number
    // created_at:string
    // updated_at:string
}

export interface User{
    id:string
    email:string
    name:string
    avatar_url?:string
}

export interface Team{
    id:string
    name:string
    members:User[]
}