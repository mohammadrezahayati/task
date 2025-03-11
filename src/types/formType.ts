export interface VisibilityCondition {
    dependsOn: string;
    condition: 'equals' | 'notEquals';
    value: string;
}

export interface DynamicOptions {
    fieldsId?: string;
    dependsOn: string;
    endpoint: string;
    method: 'GET' | 'POST';
}

export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'group';
    required: boolean;
    options?: string[];
    visibility?: VisibilityCondition;
    dynamicOptions?: DynamicOptions;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
    fields?: FormField[]; // For nested fields (e.g., groups)
}

export interface FormStructure {
    formId: string;
    title: string;
    fields: FormField[];
}
