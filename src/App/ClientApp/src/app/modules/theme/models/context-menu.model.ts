export class ContextMenu {

  constructor(init?:ContextMenu) {
    if (init) {
      Object.assign(this, init);
    }
  }

  id: number;
  title: string;
  description: string;
  iconUrl: string;
}
