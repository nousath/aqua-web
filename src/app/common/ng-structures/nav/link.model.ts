export class Link {
    index = 0;
    name: string;
    url: string;
    title: string;
    icon: string;
    isActive = false;
    routerLink: string[];
    permissions: string[];
    constructor(obj?: {
        index?: number,
        name?: string,
        title?: string,
        icon?: string,
        isActive?: boolean,
        url?: string,
        routerLink?: string[],
        permissions?: string[]
    }) {
        if (!obj) { return; }
        this.index = obj.index;
        this.name = obj.name;
        this.title = obj.title;
        this.icon = obj.icon;
        this.isActive = obj.isActive;
        this.url = obj.url;
        this.routerLink = obj.routerLink;
        this.permissions = obj.permissions || [];
    }
}
