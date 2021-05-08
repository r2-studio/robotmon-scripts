export interface UISetting {
  name: string;
  props?: { [key: string]: any };
  events?: { [key: string]: any };
  value?: any;
  children?: (UISetting | string)[];
}
