/**
  * Convert map to array for toJSON() in ISRAProject
  * @param {map} map selected map
*/
const map2Array = (map) => {
    const arr = [];
    map.forEach((e) => {
        arr.push(e.properties);
    });
    return arr;
};

module.exports = {
    map2Array,
};