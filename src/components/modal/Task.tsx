export enum priorityEnum {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
export enum TaskStatus {
    TODO = "TODO",
    INPROCESS = "INPROCESS",
    COMPLETED = "COMPLETED",
}

export interface TaskData {
    title: string;
    description: string;
    tags: string[];
    priority: priorityEnum;
    status: TaskStatus;
    startDate?: Date;
    endDate?: Date;
    projectId: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    tags: string[];
    priority: priorityEnum;
    status: TaskStatus;
    startDate?: Date;
    endDate?: Date;
    projectId: string;
}