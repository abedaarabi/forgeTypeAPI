import * as ForgeSDK from 'forge-apis';
import { oAuth2 } from './forge.oAuth2';
import { hub } from './forge.hub';

type Project = {
  id: string;
  attributes: { name: string };
  relationships: { rootFolder: { data: { id: string } } };
};

export type ProjectInfo = {
  id: string;
  name: string;
  rootFolderId: string;
};

export type Projects = Array<Project>;

//this Function will return Project {id, name, rootFolderId}
export const projects = async () => {
  const credentials = await oAuth2();
  const hubId = await hub();
  const Project = new ForgeSDK.ProjectsApi();

  const allProjects = await Project.getHubProjects(
    hubId,
    undefined,
    undefined,
    credentials,
  );
  const bim360Projects = allProjects.body.data as Projects;

  const neededProjects = [
    'b.12469613-6f90-42c3-b49c-4bb22e440e30',
    'b.c74e65d3-cb3f-4863-9378-479ce0d4f995',
    'b.79a6bff3-34b1-435f-8964-282f78ae1ef5', //*
  ];

  const ProjectInfo = bim360Projects.map((project) => {
    const {
      id,
      attributes: { name },
      relationships: {
        rootFolder: {
          data: { id: rootFolderId },
        },
      },
    } = project;
    return { name, id, rootFolderId };
  });

  const oldId = ProjectInfo.filter((detail) => {
    const isInclude = neededProjects.includes(detail.id);
    if (isInclude) {
      return true;
    } else {
      false;
    }
  });

  return oldId;
};
