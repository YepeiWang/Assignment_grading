
export interface rubricItem{
    point: number;
    defaultValue: string;
    index?: number;
};

export const rubricItems: rubricItem[] = [
    {
        point: 8,
        defaultValue: ""
    },
    {
        point: 6,
        defaultValue: ""
    },
    {
        point: 4,
        defaultValue: ""
    },
    {
        point: 2,
        defaultValue: ""
    },
    {
        point: 0,
        defaultValue: ""
    },
];


export interface clusterItem{
    id: number;
    items: string[];

}
export const clusterItems = [
    {
        id: 0,
        items: []
    },
    {
        id: 1,
        items: []
    },
    {
        id: 2,
        items: []
    }
];

export interface errorSubmission{
    student: number;
    submission: string;
    index?: number;
};

export const errorSubmissions: errorSubmission[] = [
    {
        student: 1,
        submission: "Bad bad"
    },
    {
        student: 2,
        submission: "Bad bad"
    },
    {
        student: 3,
        submission: "Bad bad"
    }
];

export interface sameSubmission{
    student: number;
    submission: string;
    index?: number;
};

export const sameSubmissions: sameSubmission[] = [
    {
        student: 1,
        submission: "Not so good"
    },
    {
        student: 2,
        submission: "Not so good"
    },
    {
        student: 3,
        submission: "Not so good"
    }
];


