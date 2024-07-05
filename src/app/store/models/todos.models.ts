export interface Todo {
    id: number;
    beschreibung: string;
    faellig: number;
    erledigt: boolean;
    prioritaet: number;
    
}

export interface TodosState {
    todos: Todo[];
}