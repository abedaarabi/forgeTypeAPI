export const hasIdentityData = (arr: any) => {
  const eltCollection = arr.filter((elt) => {
    if (
      elt.properties['Identity Data'] &&
      elt.properties['Identity Data']['Type Name']
    ) {
      return true;
    } else return false;
  });

  return eltCollection;
};
