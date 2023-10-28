import {
    Rule, Tree, SchematicsException,
    apply, url, applyTemplates, move,
    chain, mergeWith
  } from '@angular-devkit/schematics';
  
  import { strings, normalize, experimental } from '@angular-devkit/core';
  
  import { Schema as SchematicComponentHeader } from './schema';
  
  export function componentHeader(options: SchematicComponentHeader): Rule {
    return (tree: Tree) => {
      const workspaceConfig = tree.read('/angular.json');
      if (!workspaceConfig) {
        throw new SchematicsException('Could not find Angular workspace configuration');
      }
  
      // convert workspace to string
      const workspaceContent = workspaceConfig.toString();
  
      // parse workspace string into JSON object
      const workspace: experimental.workspace.WorkspaceSchema = JSON.parse(workspaceContent);
  
      if (!options.project) {
        options.project = workspace.defaultProject;
      }
  
      const projectName = options.project as string;
  
      const project = workspace.projects[projectName];
  
      const projectType = project.projectType === 'application' ? 'app' : 'lib';
  
      if (options.path === undefined) {
        options.path = `${project.sourceRoot}/${projectType}`;
      }
  
      options.selector = options.selector || buildSelector(options, project && project.prefix || '')
  
      const templateSource = apply(url('./files'), [
        applyTemplates({
          classify: strings.classify,
          dasherize: strings.dasherize,
          name: options.name,
          author: options.author,
          selector: options.selector
        }),
        move(normalize(options.path as string))
      ]);
  
      return chain([
        mergeWith(templateSource)
      ]);
    };
  }
  function buildSelector(options: SchematicComponentHeader, projectPrefix: string) {
    let selector = strings.dasherize(options.name);
    if (projectPrefix) {
      selector = `${projectPrefix}-${selector}`;
    }
  
    return selector;
  }