import { Link } from './link.model';

export class Nav {
  icon: string;
  title: string;
  current: Link;
  items: Link[];
  constructor(obj?: {
    title?: string,
    icon?: string,
    permissions?: string[],
    items?: any[],
    current?: string | number
  }) {
    if (!obj) return;
    this.title = obj.title;
    this.icon = obj.icon;
    this.items = [];
    if (obj.items && obj.items.length) {
      obj.items.forEach(item => {
        const link = new Link(item);

        if (!link.permissions || !link.permissions.length) {
          this.items.push(link);
          return;
        }

        // this link requires permissions
        if (!obj.permissions || !obj.permissions.length) {
          // no permissions supplied
          return;
        }

        link.permissions.forEach(requiredPermission => {
          if (obj.permissions.find(permission => permission.toLowerCase() === requiredPermission.toLowerCase())) {
            this.items.push(link);
            return;
          }
        });
      });
    }

    if (obj.current) {
      this.activate(obj.current);
    } else {
      this.current = this.items[0];
      this.current.isActive = true;
    }


  }
  activate(identifier: string | number | Link): Link {
    if (!identifier) {
      return this.reset();
    }
    let name: string;
    let index: number;
    let link: Link;
    if (typeof identifier === 'string') {
      name = identifier;
    } else if (typeof identifier === 'number') {
      index = identifier;
    } else {
      link = identifier;
    }
    this.items.forEach(element => {
      element.isActive = false;
      if ((name && element.name && element.name.toLowerCase() === name.toLowerCase()) ||
        (index && element.index === index) ||
        (link && element.index === link.index)) {
        this.current = element;
      }
    });

    if (!this.current) {
      this.current = this.items[0];
    }

    this.current.isActive = true;
    return this.current;
  }

  reset(): Link {
    this.current = this.items[0];
    return this.current;
  }
}
