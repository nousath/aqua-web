export class Action {
    event: (any) => void;
    title: string;
    icon: string;
    type: string;
    value: any;
    options: any[]; // values for select etc
    display: string; // hidden, disabled etc

    constructor(obj?: {
        event?: (any) => void,
        title?: string,
        icon?: string,
        type?: string,
        value?: any,
        options?: any[],
        display?: string
    }) {
        if (!obj) { return; }
        this.event = obj.event;
        this.title = obj.title;
        this.icon = obj.icon;
        this.type = obj.type;
        this.value = obj.value;
        this.options = obj.options;
        this.display = obj.display;
    }
}
