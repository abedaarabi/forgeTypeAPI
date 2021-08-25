require('dotenv').config({ path: './.env' });
import { Logger } from '@nestjs/common';

// const sql = require('mssql');
import * as sql from 'mssql';
import { ElementProperties } from 'src/metaData/retrieveItemMetaData';

const con = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  options: {
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 1500000,
  },
};

export const connect = async () => {
  try {
    const pool = await sql.connect(con);
    //@ts-ignore
    Logger.debug(`Connecting to database: `, pool.config.user);
  } catch (err) {
    Logger.error(`Error ${err.message}`);
  }
};

//Delete Elements
export const deleteObjId = async (
  modiId: string,
): Promise<sql.IResult<unknown>> => {
  return new Promise((resolve) => {
    Logger.warn('delete element with id: ', modiId);
    const deleteElements = sql.query(
      `DELETE FROM element WHERE element.objectId LIKE '%${modiId}%'`,
    );
    resolve(deleteElements);
    Logger.log('Done');
  });
};

interface Project {
  id: string;
  name: string;
}

interface ItemType {
  id: string;
  projectId: string;
  originalItemUrn: string;
  name: string;
  elementsCount: string;
  date: string;
}

//Insert projects

export const insertProjects = async (
  allProjects: Project[],
): Promise<number[][]> => {
  let pool = await sql.connect(con);
  const projects = allProjects.map(async (project): Promise<number[]> => {
    try {
      let result1 = await pool
        .request()
        .input('id', sql.VarChar(255), project.id)
        .input('name', sql.VarChar(255), project.name)
        .query(
          `INSERT INTO project_name (projectID, projectName) VALUES (@id, @name)`,
        );

      if (result1) {
        Logger.log(
          'inserted projects',
          `rowsAffected: ${result1.rowsAffected}`,
        );
        return result1.rowsAffected;
      }
    } catch (error) {
      Logger.error('inserted projects error', error);
    }
  });
  return await Promise.all(projects);
};

//Insert Items
export const insdertItems = async ({
  id,
  projectId,
  originalItemUrn,
  name,
  elementsCount,
  date,
}: ItemType): Promise<number[]> => {
  let pool = await sql.connect(con);

  try {
    let result1 = await pool
      .request()
      .input('data', sql.VarChar(255), date)
      .input('elementsCount', sql.Int(), elementsCount)
      .input('id', sql.VarChar(255), id)
      .input('name', sql.VarChar(255), name)
      .input('projectId', sql.VarChar(255), projectId)
      .input('originalItemUrn', sql.VarChar(255), originalItemUrn)
      .query(
        `INSERT INTO item_name (date, elementsCount, id, name, projectId, originalItemUrn) VALUES (@data, @elementsCount, @id, @name, @projectId, @originalItemUrn)`,
      );

    if (result1) {
      Logger.log('inserted items', `rowsAffected: ${result1.rowsAffected}`);
      return result1.rowsAffected;
    }
  } catch (error) {
    Logger.error('inserted items error', error.message);
  }
};

//Insert Elements
export const insterElements = async (
  array: ElementProperties[],
): Promise<number> => {
  const request = new sql.Request();
  let tableElt = new sql.Table('element');
  // tableElt.create = true;
  tableElt.columns.add('name', sql.VarChar(255));
  tableElt.columns.add('dbId', sql.VarChar(255));
  tableElt.columns.add('version_id', sql.VarChar(255));
  tableElt.columns.add('TypeName', sql.VarChar(255));
  tableElt.columns.add('Type_Sorting', sql.VarChar(255));
  tableElt.columns.add('Workset', sql.VarChar(255));
  tableElt.columns.add('CCSTypeID_Type', sql.VarChar(255));
  tableElt.columns.add('CCSTypeID', sql.VarChar(255));
  tableElt.columns.add('CCSClassCode_Type', sql.VarChar(255));
  tableElt.columns.add('externalId', sql.VarChar(255));
  tableElt.columns.add('objectId', sql.VarChar(255), {
    nullable: false,
  });
  tableElt.columns.add('BIM7AATypeName', sql.VarChar(255));
  tableElt.columns.add('BIM7AATypeDescription', sql.VarChar(255));
  tableElt.columns.add('BIM7AATypeID', sql.VarChar(255));
  tableElt.columns.add('BIM7AATypeNumber', sql.VarChar(255));
  tableElt.columns.add('BIM7AATypeCode', sql.VarChar(255));
  tableElt.columns.add('BIM7AATypeComments', sql.VarChar(255));

  array.map((element) => {
    tableElt.rows.add(
      element.name,
      element.dbId,
      element.version_id,
      element.TypeName,
      element.Type_Sorting,
      element.Workset,
      element.CCSTypeID_Type,
      element.CCSTypeID,
      element.CCSClassCode_Type,
      element.externalId,
      element.objectId,
      element.BIM7AATypeName,
      element.BIM7AATypeDescription,
      element.BIM7AATypeID,
      element.BIM7AATypeNumber,
      element.BIM7AATypeCode,
      element.BIM7AATypeComments,
    );
  });

  try {
    const result = await request.bulk(tableElt);
    Logger.log('inserted elements', `rowsAffected: ${result.rowsAffected}`);
    return result.rowsAffected;
  } catch (error) {
    Logger.error('inserted elements error', error);
  }
};

/*********
 *
 * selectWorkSet(){
 * select ... from....
 * }
 *
 * const resultV1 = selectWorkSet()
 * const resultV2 = selectWorkSet()
 *
 * {
 * B1vId: 'v1',
 * B2vId: 'v2',
 * pram:"workSet"
 * }
 *
 * Route
 * r1=selectWorkSet(v1, workSet)
 * r2=selectWorkSet(v2, workSet)
 *
 * r1 =[....]
 * r2=[.....]
 *
 * result= compare (r1  vs r2)
 *
 *
 *
 */
