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
export const projects = async (hubId) => {
  const credentials = await oAuth2();

  const Project = new ForgeSDK.ProjectsApi();

  const allProjects = await Project.getHubProjects(
    hubId,
    undefined,
    undefined,
    credentials,
  );
  const bim360Projects = allProjects.body.data as Projects;

  const neededProjects = [
    // 'b.12469613-6f90-42c3-b49c-4bb22e440e30',
    'b.9789bc25-07fa-4fdc-9415-9951e8865d9d', //B313
    // 'b.a9a41e9c-3a75-4fca-bb88-acd926c7bbdc',
    // 'b.971c280a-ba24-4366-8b3c-25ef5cd82511',

    // 'b.c74e65d3-cb3f-4863-9378-479ce0d4f995', //NOL
    // 'b.0063f0d4-abdc-4d09-851e-3aa550c8dc81',
    // 'b.5449d573-5229-45c1-832c-371769347b35',
    // 'b.5172f7a8-7376-4765-a871-ba3b8fcce946',
    // 'b.b85d407c-f4ed-41d1-b42a-2796292dbf0b',
  ];
  // 'b.79a6bff3-34b1-435f-8964-282f78ae1ef5', //*

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
  // console.log(ProjectInfo);

  return oldId;
};

export function repeat() {}
