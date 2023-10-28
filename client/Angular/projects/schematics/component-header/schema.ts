export interface Schema {
    // The name of the component.
    name: string;
  
    // The author of the component.
    author: string;
  
    // The path to create the component.
    path?: string;
  
    // The name of the project.
    project?: string;
    
    // the selector of the component.
    selector?: string;
  }