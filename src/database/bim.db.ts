require('dotenv').config({ path: './.env' });

const sql = require('mssql');
// import sql from 'mssql';

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

    console.log(`Connecting to database ${pool.config.user}`);
  } catch (err) {
    console.log(`Error ${err.message}`);
  }
};

//Delete Elements
export const deleteObjId = async (modiId: string): Promise<any> => {
  return new Promise((resolve) => {
    console.log('delete element with id: ', modiId);
    const rr = sql.query(
      `DELETE FROM element WHERE element.objectId LIKE '%${modiId}%'`,
    );
    resolve(rr);
    console.log('Done');
  });
};

interface ProjectArray {
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
  allProjects: ProjectArray[],
): Promise<any> => {
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
      console.log(result1.rowsAffected);

      return result1.rowsAffected;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  });
};

//Insert Items
export const insdertItems = async ({
  id,
  projectId,
  originalItemUrn,
  name,
  elementsCount,
  date,
}: ItemType) => {
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
    console.log(result1);

    return result1;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

//Insert Elements
export const insterElements = async (rr) => {
  const request = new sql.Request();
  let tableElt = new sql.Table('element');
  // tableElt.create = true;
  tableElt.columns.add('name', sql.VarChar(255));
  tableElt.columns.add('dbId', sql.VarChar(255));
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

  rr.map((element) => {
    tableElt.rows.add(
      element.name,
      element.dbId,
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

  let result;
  try {
    result = await request.bulk(tableElt);
    console.log(result);
  } catch (error) {
    console.log('table element error', error.message);
  }
};
